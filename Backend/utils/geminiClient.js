/**
 * Gemini client wrapper for structured JSON output.
 *
 * Free tier limits (gemini-1.5-flash): 15 RPM, 1500 RPD.
 * We implement a simple in-memory token bucket so we never 429, plus a
 * strict JSON schema so the LLM output is always parseable.
 *
 * If GEMINI_API_KEY is missing or the API fails, every public function
 * returns `null`. Callers MUST handle null and fall back gracefully.
 */

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const MODEL_NAME = 'gemini-1.5-flash';
const MAX_REQ_PER_MINUTE = 14; // one under the 15/min limit, for safety
const MAX_REQ_PER_DAY = 1400; // one under the 1500/day limit
const MAX_REPORT_TEXT_CHARS = 20000; // ~5k tokens, keeps us well under model limits

// Lazy singleton — only instantiated when a key is present
let genAI = null;
let modelInstance = null;

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAI) {
    try {
      genAI = new GoogleGenerativeAI(apiKey);
    } catch (err) {
      console.error('[gemini] init failed:', err.message);
      return null;
    }
  }
  if (!modelInstance) {
    modelInstance = genAI.getGenerativeModel({
      model: MODEL_NAME,
      // Relax safety for medical terminology (we still have source attribution + disclaimers)
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    });
  }
  return modelInstance;
}

// ──────────────────────────────────────────────────────────────────
// Rate limiter (in-memory — fine for single-process dev; replace with
// Redis for multi-instance deploy)
// ──────────────────────────────────────────────────────────────────
const rateState = {
  minuteWindow: [],
  dayWindow: [],
};

function checkRateLimit() {
  const now = Date.now();
  const minuteAgo = now - 60 * 1000;
  const dayAgo = now - 24 * 60 * 60 * 1000;
  rateState.minuteWindow = rateState.minuteWindow.filter((t) => t > minuteAgo);
  rateState.dayWindow = rateState.dayWindow.filter((t) => t > dayAgo);

  if (rateState.minuteWindow.length >= MAX_REQ_PER_MINUTE) {
    return { ok: false, reason: 'minute-limit' };
  }
  if (rateState.dayWindow.length >= MAX_REQ_PER_DAY) {
    return { ok: false, reason: 'day-limit' };
  }
  rateState.minuteWindow.push(now);
  rateState.dayWindow.push(now);
  return { ok: true };
}

// ──────────────────────────────────────────────────────────────────
// JSON Schema for report analysis (Gemini schema vocabulary)
// ──────────────────────────────────────────────────────────────────
const reportAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    reportType: {
      type: SchemaType.STRING,
      description: 'A short label e.g. "Blood Test", "X-Ray", "Prescription", "Unknown"',
    },
    summary: {
      type: SchemaType.STRING,
      description: '2-4 sentence plain-language overview of the report',
    },
    keyFindings: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          metric: { type: SchemaType.STRING },
          value: { type: SchemaType.STRING },
          normalRange: { type: SchemaType.STRING },
          status: {
            type: SchemaType.STRING,
            enum: ['normal', 'low', 'high', 'critical'],
          },
        },
        required: ['metric', 'value', 'status'],
      },
    },
    flags: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          severity: {
            type: SchemaType.STRING,
            enum: ['low', 'moderate', 'high'],
          },
          message: { type: SchemaType.STRING },
        },
        required: ['severity', 'message'],
      },
    },
    recommendedActions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    suggestedMedications: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          purpose: { type: SchemaType.STRING },
        },
        required: ['name'],
      },
    },
    suggestedSpecialists: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          specialty: { type: SchemaType.STRING },
          reason: { type: SchemaType.STRING },
        },
        required: ['specialty'],
      },
    },
  },
  required: ['reportType', 'summary', 'keyFindings', 'recommendedActions'],
};

const SYSTEM_PROMPT = `You are a careful medical report analyzer for a health assistant app.

Rules:
- NEVER diagnose. Use hedging language ("may indicate", "suggests", "consider").
- Extract ONLY information that is explicitly present in the report text.
- For numeric findings, include the measured value, the normal range if stated, and a status classification.
- For flags, only include moderate/high severity — do not alarm the user about normal findings.
- Suggested medications should be generic/class names (e.g., "statin", "metformin"), not specific brands.
- Suggested specialists should be standard terms (Cardiologist, Endocrinologist, Dermatologist, etc.).
- Return ONLY valid JSON matching the schema. No prose, no markdown, no code fences.`;

/**
 * Analyze extracted report text and return a structured summary.
 * Returns null if Gemini is unavailable or the call fails twice.
 */
export async function analyzeReport(reportText) {
  if (!reportText || typeof reportText !== 'string' || reportText.trim().length < 40) {
    return null;
  }
  const model = getModel();
  if (!model) {
    console.warn('[gemini] GEMINI_API_KEY missing — skipping analysis');
    return null;
  }

  const rate = checkRateLimit();
  if (!rate.ok) {
    console.warn('[gemini] rate limit reached:', rate.reason);
    return { __rateLimited: rate.reason };
  }

  const trimmedText = reportText.slice(0, MAX_REPORT_TEXT_CHARS);
  const prompt = `${SYSTEM_PROMPT}\n\n--- REPORT TEXT BEGIN ---\n${trimmedText}\n--- REPORT TEXT END ---`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: reportAnalysisSchema,
        temperature: 0.2,
      },
    });
    const raw = result?.response?.text?.();
    if (!raw) {
      console.error('[gemini] empty response from model');
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (parseErr) {
      console.error('[gemini] JSON parse failed, retrying once with stricter prompt');
      // Retry once — new prompt emphasising raw JSON
      const retry = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text:
                  SYSTEM_PROMPT +
                  '\n\nReturn ONLY the raw JSON object, nothing else. Do not wrap in markdown or code fences.\n\n' +
                  trimmedText,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: reportAnalysisSchema,
          temperature: 0,
        },
      });
      try {
        return JSON.parse(retry?.response?.text?.() || '{}');
      } catch {
        return null;
      }
    }
  } catch (err) {
    console.error('[gemini] analyzeReport failed:', err.message);
    // Log the full error object for diagnosis (status code, response body, etc.)
    if (err.status) console.error('[gemini] status:', err.status);
    if (err.statusText) console.error('[gemini] statusText:', err.statusText);
    if (err.errorDetails) console.error('[gemini] errorDetails:', JSON.stringify(err.errorDetails));
    if (err.response) {
      try {
        const body = typeof err.response.text === 'function' ? await err.response.text() : err.response;
        console.error('[gemini] response body:', body);
      } catch { /* ignore */ }
    }
    if (err.stack) console.error(err.stack.split('\n').slice(0, 5).join('\n'));
    return null;
  }
}

export function isGeminiAvailable() {
  return !!process.env.GEMINI_API_KEY;
}
