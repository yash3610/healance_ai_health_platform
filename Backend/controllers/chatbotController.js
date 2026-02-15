import ChatSession from '../models/ChatSession.js';
import { searchDrugInfo, formatDrugResponse, getDrugNotFoundResponse } from '../utils/fdaApi.js';

// Medicine database for the Medicine Info Bot (FALLBACK - Now using FDA API)
const medicineDB = {
  paracetamol: {
    name: 'Paracetamol (Acetaminophen)',
    uses: 'Pain reliever and fever reducer. Used for headaches, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
    dosage: '500mg-1000mg every 4-6 hours. Maximum 4g/day for adults.',
    sideEffects: 'Nausea, liver damage (high doses), allergic reactions (rare), blood disorders (very rare).',
    precautions: 'Do not exceed 4g/day. Avoid with alcohol. Consult doctor if liver disease present.',
    interactions: 'Warfarin, Carbamazepine, Isoniazid'
  },
  ibuprofen: {
    name: 'Ibuprofen',
    uses: 'Anti-inflammatory pain reliever. Used for arthritis, menstrual cramps, dental pain, muscle aches.',
    dosage: '200-400mg every 4-6 hours. Maximum 1200mg/day (OTC).',
    sideEffects: 'Stomach upset, heartburn, dizziness, mild headache, kidney problems (long-term).',
    precautions: 'Take with food. Avoid if history of stomach ulcers. Not recommended in late pregnancy.',
    interactions: 'Aspirin, Blood thinners, ACE inhibitors, Lithium'
  },
  aspirin: {
    name: 'Aspirin (Acetylsalicylic Acid)',
    uses: 'Pain relief, fever reducer, anti-inflammatory, blood thinner for heart attack prevention.',
    dosage: '325-650mg every 4-6 hours for pain. 75-100mg daily for heart protection.',
    sideEffects: 'Stomach bleeding, ulcers, tinnitus, allergic reactions.',
    precautions: 'Not for children under 16 (Reye syndrome risk). Avoid before surgery.',
    interactions: 'Warfarin, Methotrexate, SSRIs, other NSAIDs'
  },
  amoxicillin: {
    name: 'Amoxicillin',
    uses: 'Antibiotic for bacterial infections: ear infections, UTIs, respiratory infections, H. pylori.',
    dosage: '250-500mg every 8 hours, or 500-875mg every 12 hours for 7-14 days.',
    sideEffects: 'Diarrhea, nausea, skin rash, vomiting.',
    precautions: 'Complete full course. Inform doctor of penicillin allergy. May reduce birth control efficacy.',
    interactions: 'Methotrexate, Warfarin, Probenecid'
  },
  metformin: {
    name: 'Metformin',
    uses: 'Type 2 diabetes management. Helps control blood sugar levels.',
    dosage: 'Start 500mg twice daily, max 2000mg/day. Take with meals.',
    sideEffects: 'Nausea, diarrhea, stomach pain, metallic taste, vitamin B12 deficiency (long-term).',
    precautions: 'Monitor kidney function. Stop before contrast dye procedures. Avoid excessive alcohol.',
    interactions: 'Contrast dyes, Alcohol, Certain diuretics'
  },
};

// Health symptom responses
const symptomResponses = {
  headache: 'For headaches: Stay hydrated, rest in a dark room, try over-the-counter pain relief. If persistent or severe, consult a doctor. Common causes include stress, dehydration, eye strain, and poor posture.',
  fever: 'For fever: Rest and stay hydrated. Take paracetamol or ibuprofen as directed. Seek medical help if temperature exceeds 103°F (39.4°C), lasts over 3 days, or is accompanied by severe symptoms.',
  cold: 'For common cold: Rest, drink warm fluids, use steam inhalation, take vitamin C. Most colds resolve in 7-10 days. See a doctor if symptoms worsen or you have difficulty breathing.',
  cough: 'For cough: Stay hydrated, use honey and warm water, try steam inhalation. If cough persists beyond 3 weeks, produces blood, or is accompanied by fever, consult a doctor immediately.',
  stomach: 'For stomach issues: Eat bland foods (BRAT diet), stay hydrated, avoid spicy/oily foods. If you experience severe pain, blood in stool, or symptoms lasting over 48 hours, see a doctor.',
  anxiety: 'For anxiety: Practice deep breathing exercises (4-7-8 technique), try progressive muscle relaxation, limit caffeine, exercise regularly. If anxiety is persistent and affecting daily life, consider speaking with a mental health professional.',
  sleep: 'For sleep issues: Maintain consistent sleep schedule, avoid screens 1 hour before bed, create a dark/cool room environment, limit caffeine after 2pm. If insomnia persists, consult a sleep specialist.',
  back: 'For back pain: Apply ice for first 48 hours, then switch to heat. Gentle stretching and walking help. Maintain good posture. See a doctor if pain radiates down legs or is accompanied by numbness.',
};

// @desc    Send message to AI chatbot
// @route   POST /api/chatbot/message
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message, botType, sessionId } = req.body;

    if (!message || !botType) {
      return res.status(400).json({ success: false, message: 'Message and botType are required' });
    }

    // Find or create chat session
    let session;
    if (sessionId) {
      session = await ChatSession.findById(sessionId);
    }
    if (!session) {
      session = await ChatSession.create({
        user: req.user._id,
        botType,
        messages: [],
        title: message.substring(0, 50),
      });
    }

    // Add user message
    session.messages.push({ role: 'user', content: message, botType });

    // Generate AI response
    let responseText = '';

    if (botType === 'medicine') {
      // Medicine Info Bot - Using FDA API for REAL medicine information
      const searchTerm = message.toLowerCase().trim();
      
      try {
        // Fetch real-time medicine information from FDA API
        const fdaResult = await searchDrugInfo(searchTerm);
        
        if (fdaResult.found) {
          // Format and return FDA data
          responseText = formatDrugResponse(fdaResult);
        } else {
          // Try fallback to static database if FDA doesn't have info
          const matchedMedicine = Object.keys(medicineDB).find(key =>
            searchTerm.includes(key) || key.includes(searchTerm)
          );

          if (matchedMedicine) {
            const med = medicineDB[matchedMedicine];
            responseText = `💊 **${med.name}** *(From Local Database)*\n\n` +
              `**Uses:** ${med.uses}\n\n` +
              `**Dosage:** ${med.dosage}\n\n` +
              `**Side Effects:** ${med.sideEffects}\n\n` +
              `**Precautions:** ${med.precautions}\n\n` +
              `**Drug Interactions:** ${med.interactions}\n\n` +
              `⚠️ *This is basic information. For detailed FDA-approved information, try searching with the exact drug name. Always consult your doctor or pharmacist.*`;
          } else {
            // Medicine not found in FDA or local database
            responseText = getDrugNotFoundResponse(searchTerm);
          }
        }
      } catch (error) {
        console.error('Medicine lookup error:', error);
        responseText = `Sorry, I encountered an error while fetching medicine information. Please try again or consult your healthcare provider.\n\nError: ${error.message}`;
      }
    } else {
      // Health Assistant Bot
      const lowerMsg = message.toLowerCase();
      const matchedSymptom = Object.keys(symptomResponses).find(key =>
        lowerMsg.includes(key)
      );

      if (matchedSymptom) {
        responseText = symptomResponses[matchedSymptom];
      } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        responseText = 'Hello! I\'m your AI Health Assistant. I can help you with symptoms like headaches, fever, cold, cough, stomach issues, anxiety, sleep problems, and back pain. What would you like to know about?';
      } else if (lowerMsg.includes('diet') || lowerMsg.includes('food') || lowerMsg.includes('nutrition')) {
        responseText = 'For a balanced diet: Include plenty of fruits and vegetables, whole grains, lean proteins, and healthy fats. Aim for 5 servings of fruits/vegetables daily. Stay hydrated with 2-3 liters of water. Limit processed foods, added sugars, and excessive salt.';
      } else if (lowerMsg.includes('exercise') || lowerMsg.includes('workout') || lowerMsg.includes('fitness')) {
        responseText = 'For overall fitness: Aim for 150 minutes of moderate aerobic activity per week. Include strength training 2-3 times a week. Start slowly if you\'re new to exercise. Always warm up and cool down. Listen to your body and rest when needed.';
      } else if (lowerMsg.includes('weight') || lowerMsg.includes('bmi')) {
        responseText = 'For healthy weight management: Focus on sustainable lifestyle changes. Eat a balanced diet, exercise regularly (30 min/day), get adequate sleep (7-8 hrs), manage stress. BMI ranges: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (30+). Consult a nutritionist for personalized plans.';
      } else {
        responseText = 'Based on your query, I recommend staying hydrated and maintaining a healthy lifestyle. If you\'re experiencing specific symptoms, please describe them (e.g., headache, fever, stomach pain) and I\'ll provide more targeted advice. For medical emergencies, please call your local emergency number immediately.';
      }
    }

    // Add bot response
    session.messages.push({ role: 'assistant', content: responseText, botType });
    await session.save();

    res.json({
      success: true,
      response: responseText,
      sessionId: session._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get chat history
// @route   GET /api/chatbot/sessions
// @access  Private
export const getChatSessions = async (req, res) => {
  try {
    const { botType } = req.query;
    const filter = { user: req.user._id };
    if (botType) filter.botType = botType;

    const sessions = await ChatSession.find(filter)
      .sort({ updatedAt: -1 })
      .select('title botType createdAt updatedAt');

    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get messages from a session
// @route   GET /api/chatbot/sessions/:sessionId
// @access  Private
export const getSessionMessages = async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete chat session
// @route   DELETE /api/chatbot/sessions/:sessionId
// @access  Private
export const deleteSession = async (req, res) => {
  try {
    await ChatSession.findOneAndDelete({
      _id: req.params.sessionId,
      user: req.user._id,
    });
    res.json({ success: true, message: 'Chat session deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
