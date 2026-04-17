/**
 * Groq LLM client — used for medical report analysis.
 *
 * Groq hosts Llama 3.x with an OpenAI-compatible API, so we reuse the
 * already-installed `openai` SDK by pointing it at Groq's base URL.
 *
 * Free tier limits (approximate, subject to change on console.groq.com):
 *   llama-3.3-70b-versatile: 30 RPM, 1,000 RPD, 12,000 TPM
 *   llama-3.1-8b-instant:    30 RPM, 14,400 RPD, 6,000 TPM
 *
 * We use 70B as primary (best medical reasoning) with 8B fallback on
 * errors. A small in-memory token bucket keeps us under the per-minute
 * limit.
 */

import OpenAI from 'openai';

const BASE_URL = 'https://api.groq.com/openai/v1';
const MODEL_PRIMARY = 'llama-3.3-70b-versatile';
const MODEL_FALLBACK = 'llama-3.1-8b-instant';
const MAX_REQ_PER_MINUTE = 28;   // one under the 30/min cap, for safety
const MAX_REPORT_TEXT_CHARS = 16000; // ~4k tokens, keeps us under context cap

let groqClient = null;

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  if (!groqClient) {
    try {
      groqClient = new OpenAI({ apiKey, baseURL: BASE_URL });
    } catch (err) {
      console.error('[groq] init failed:', err.message);
      return null;
    }
  }
  return groqClient;
}

// ──────────────────────────────────────────────────────────────────
// Rate limiter — 28 req/min rolling window
// ──────────────────────────────────────────────────────────────────
const rateState = { minuteWindow: [] };
function checkRateLimit() {
  const now = Date.now();
  const minuteAgo = now - 60 * 1000;
  rateState.minuteWindow = rateState.minuteWindow.filter((t) => t > minuteAgo);
  if (rateState.minuteWindow.length >= MAX_REQ_PER_MINUTE) {
    return { ok: false, reason: 'minute-limit' };
  }
  rateState.minuteWindow.push(now);
  return { ok: true };
}

// ──────────────────────────────────────────────────────────────────
// JSON schema for report analysis — described in the prompt since Groq's
// json_object mode doesn't enforce a schema (unlike Gemini's responseSchema).
// We rely on strict prompting + post-parse validation.
// ──────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a careful medical report analyzer for a patient health app.

RULES:
- NEVER diagnose. Use hedging language ("may indicate", "suggests", "consider").
- Extract ONLY information explicitly present in the report text.
- Return ONLY a JSON object matching the schema below. No prose, no markdown, no code fences.
- For ARRAY fields — if you cannot confidently extract any items, return an EMPTY ARRAY (open bracket, close bracket). NEVER emit placeholder entries like {"name":"Unknown"} or {"specialty":"Unknown"}. An empty array is always preferable to placeholder entries.
- For STRING fields — if the information is genuinely absent, use a short honest phrase (e.g. "Not specified in this report").
- Only suggest medications when the report clearly indicates a condition that has a well-known first-line medication class. If uncertain, return an empty suggestedMedications array.

REQUIRED JSON SCHEMA:
{
  "reportType": string,              // e.g. "Blood Test", "X-Ray", "Prescription", "Unknown"
  "summary": string,                 // 2-4 sentence plain-language overview
  "keyFindings": [                   // each observable metric
    {
      "metric": string,              // e.g. "LDL Cholesterol"
      "value": string,               // measured value with unit
      "normalRange": string,         // optional — only if stated
      "status": "normal" | "low" | "high" | "critical"
    }
  ],
  "flags": [                         // only moderate/high severity items
    { "severity": "low" | "moderate" | "high", "message": string }
  ],
  "recommendedActions": [string],    // 2-6 short next-step bullets
  "suggestedMedications": [          // generic/class names (e.g. "statin")
    { "name": string, "purpose": string }
  ],
  "suggestedSpecialists": [          // standard specialty names
    { "specialty": string, "reason": string }
  ]
}

Return ONLY the JSON object. Begin response with "{" and end with "}".`;

// Placeholder-ish values the LLM sometimes emits when it can't extract data.
// We strip items matching these so the UI never shows "Unknown" cards.
const PLACEHOLDER_VALUES = new Set([
  'unknown',
  'not specified',
  'not applicable',
  'n/a',
  'na',
  'none',
  'tbd',
  '',
]);

const isPlaceholder = (value) => {
  if (value == null) return true;
  const v = String(value).trim().toLowerCase();
  if (!v) return true;
  return PLACEHOLDER_VALUES.has(v);
};

function validateShape(obj) {
  if (!obj || typeof obj !== 'object') return null;
  return {
    reportType: typeof obj.reportType === 'string' ? obj.reportType : 'Medical Report',
    summary: typeof obj.summary === 'string' ? obj.summary : '',
    keyFindings: Array.isArray(obj.keyFindings)
      ? obj.keyFindings.filter(
          (f) => f && typeof f === 'object' && !isPlaceholder(f.metric) && !isPlaceholder(f.value)
        )
      : [],
    flags: Array.isArray(obj.flags)
      ? obj.flags.filter((f) => f && typeof f === 'object' && !isPlaceholder(f.message))
      : [],
    recommendedActions: Array.isArray(obj.recommendedActions)
      ? obj.recommendedActions.filter((a) => typeof a === 'string' && !isPlaceholder(a))
      : [],
    suggestedMedications: Array.isArray(obj.suggestedMedications)
      ? obj.suggestedMedications.filter((m) => m && typeof m === 'object' && !isPlaceholder(m.name))
      : [],
    suggestedSpecialists: Array.isArray(obj.suggestedSpecialists)
      ? obj.suggestedSpecialists.filter((s) => s && typeof s === 'object' && !isPlaceholder(s.specialty))
      : [],
  };
}

async function callGroq(model, prompt) {
  const client = getClient();
  if (!client) return { error: 'no-client' };
  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });
    const raw = completion?.choices?.[0]?.message?.content;
    if (!raw) return { error: 'empty-response' };
    try {
      return { ok: true, data: JSON.parse(raw) };
    } catch {
      return { error: 'invalid-json', raw };
    }
  } catch (err) {
    console.error(`[groq:${model}] call failed:`, err.message);
    if (err.status) console.error(`[groq:${model}] status:`, err.status);
    if (err.error?.message) console.error(`[groq:${model}] error:`, err.error.message);
    return { error: 'api-error', message: err.message };
  }
}

/**
 * Analyze extracted report text and return a structured summary.
 * Returns null if the LLM is unavailable or both primary + fallback fail.
 * Returns `{ __rateLimited: 'minute-limit' }` when we would exceed the free tier.
 */
export async function analyzeReport(reportText) {
  if (!reportText || typeof reportText !== 'string' || reportText.trim().length < 40) {
    return null;
  }
  if (!getClient()) {
    console.warn('[groq] GROQ_API_KEY missing — skipping analysis');
    return null;
  }

  const rate = checkRateLimit();
  if (!rate.ok) {
    console.warn('[groq] rate limit reached:', rate.reason);
    return { __rateLimited: rate.reason };
  }

  const trimmed = reportText.slice(0, MAX_REPORT_TEXT_CHARS);
  const userPrompt = `--- REPORT TEXT BEGIN ---\n${trimmed}\n--- REPORT TEXT END ---\n\nReturn ONLY the JSON object.`;

  // Try primary model first
  let result = await callGroq(MODEL_PRIMARY, userPrompt);

  // On any failure (rate-limit, invalid-json, api-error), retry once on 8B fallback
  if (!result.ok) {
    console.warn(`[groq] primary (${MODEL_PRIMARY}) failed (${result.error}); retrying on ${MODEL_FALLBACK}`);
    result = await callGroq(MODEL_FALLBACK, userPrompt);
  }

  if (!result.ok) return null;
  return validateShape(result.data);
}

export function isGroqAvailable() {
  return !!process.env.GROQ_API_KEY;
}
