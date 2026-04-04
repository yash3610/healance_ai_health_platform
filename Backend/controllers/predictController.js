import Notification from '../models/Notification.js';
import RiskPrediction from '../models/RiskPrediction.js';
import runPythonPrediction from '../utils/mlPredictor.js';
import { normalizeWhatsAppNumber, isValidWhatsAppNumber, sendWhatsAppTextMessage } from '../utils/sendWhatsApp.js';

const parseNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const computeBmi = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  if (!heightM) return null;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
};

const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

const getSuggestions = ({ diabetesResult, heartResult, bmiCategory }) => {
  const suggestions = [];

  if (diabetesResult === 'Risk') {
    suggestions.push('Reduce sugar intake and choose low-GI foods.');
    suggestions.push('Walk at least 30 minutes daily.');
  }

  if (heartResult === 'Risk') {
    suggestions.push('Limit sodium and saturated fats in your meals.');
    suggestions.push('Track blood pressure and cholesterol regularly.');
  }

  if (bmiCategory === 'Underweight') {
    suggestions.push('Add calorie-dense healthy foods and strength training.');
  }

  if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
    suggestions.push('Target gradual weight loss with diet and exercise balance.');
  }

  if (!suggestions.length) {
    suggestions.push('Keep maintaining your balanced routine and yearly checkups.');
  }

  return suggestions;
};

const probabilityToRiskScore = (probability) => {
  if (typeof probability !== 'number' || Number.isNaN(probability)) return null;
  return Math.max(0, Math.min(100, Math.round(probability * 100)));
};

const overallRiskFromScore = (score = 0) => {
  if (score > 70) return 'critical';
  if (score > 50) return 'high';
  if (score > 25) return 'moderate';
  return 'low';
};

const savePredictionRecord = async ({
  userId,
  validated,
  bmi,
  diabetesRisk,
  heartRisk,
  summary,
  recommendations,
}) => {
  const maxRisk = Math.max(diabetesRisk || 0, heartRisk || 0);
  const overallRisk = overallRiskFromScore(maxRisk);

  await RiskPrediction.create({
    user: userId,
    input: {
      age: validated.age,
      gender: validated.gender,
      weight: validated.weight,
      height: validated.height,
      bloodPressure: String(validated.bloodPressure),
      cholesterol: validated.cholesterol,
      bloodSugar: validated.glucose,
      bmi,
      familyHistory: [],
    },
    results: {
      overallRisk,
      heartDiseaseRisk: heartRisk,
      diabetesRisk,
      summary,
      recommendations,
    },
  });
};

const validateCommonInputs = (body) => {
  const age = parseNumber(body.age);
  const genderRaw = String(body.gender || '').trim().toLowerCase();
  const weight = parseNumber(body.weight);
  const height = parseNumber(body.height);
  const glucose = parseNumber(body.glucose);
  const bloodPressure = parseNumber(body.bloodPressure);
  const cholesterol = parseNumber(body.cholesterol);

  if (!age || age < 1 || age > 120) {
    return { error: 'Age must be between 1 and 120.' };
  }

  if (!['male', 'female'].includes(genderRaw)) {
    return { error: 'Gender must be Male or Female.' };
  }

  if (!weight || weight < 20 || weight > 350) {
    return { error: 'Weight must be between 20 and 350 kg.' };
  }

  if (!height || height < 90 || height > 250) {
    return { error: 'Height must be between 90 and 250 cm.' };
  }

  if (!glucose || glucose < 40 || glucose > 500) {
    return { error: 'Glucose must be between 40 and 500.' };
  }

  if (!bloodPressure || bloodPressure < 40 || bloodPressure > 280) {
    return { error: 'Blood pressure must be between 40 and 280.' };
  }

  if (!cholesterol || cholesterol < 80 || cholesterol > 700) {
    return { error: 'Cholesterol must be between 80 and 700.' };
  }

  return {
    age,
    gender: genderRaw,
    weight,
    height,
    glucose,
    bloodPressure,
    cholesterol,
  };
};

// @desc    Predict diabetes risk
// @route   POST /api/predict/diabetes
// @access  Private
export const predictDiabetes = async (req, res) => {
  try {
    const validated = validateCommonInputs(req.body);
    if (validated.error) {
      return res.status(400).json({ success: false, message: validated.error });
    }

    const bmi = req.body.bmi ? parseNumber(req.body.bmi) : computeBmi(validated.weight, validated.height);
    if (!bmi) {
      return res.status(400).json({ success: false, message: 'BMI could not be calculated.' });
    }

    const payload = {
      modelType: 'diabetes',
      features: {
        age: validated.age,
        glucose: validated.glucose,
        bmi,
      },
    };

    const prediction = await runPythonPrediction(payload);
    const diabetesRisk = probabilityToRiskScore(prediction.probability);
    const recommendations = getSuggestions({
      diabetesResult: prediction.result,
      heartResult: 'No Risk',
      bmiCategory: getBmiCategory(bmi),
    });

    await savePredictionRecord({
      userId: req.user._id,
      validated,
      bmi,
      diabetesRisk,
      heartRisk: null,
      summary: `Diabetes prediction: ${prediction.result}`,
      recommendations,
    });

    return res.json({
      success: true,
      diabetes: prediction.result,
      probability: prediction.probability,
      bmi,
      bmiCategory: getBmiCategory(bmi),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Predict heart disease risk
// @route   POST /api/predict/heart
// @access  Private
export const predictHeart = async (req, res) => {
  try {
    const validated = validateCommonInputs(req.body);
    if (validated.error) {
      return res.status(400).json({ success: false, message: validated.error });
    }

    const bmi = req.body.bmi ? parseNumber(req.body.bmi) : computeBmi(validated.weight, validated.height);
    if (!bmi) {
      return res.status(400).json({ success: false, message: 'BMI could not be calculated.' });
    }

    const fbs = validated.glucose > 120 ? 1 : 0;
    const payload = {
      modelType: 'heart',
      features: {
        age: validated.age,
        gender: validated.gender === 'male' ? 1 : 0,
        blood_pressure: validated.bloodPressure,
        cholesterol: validated.cholesterol,
        fbs,
      },
    };

    const prediction = await runPythonPrediction(payload);
    const heartRisk = probabilityToRiskScore(prediction.probability);
    const recommendations = getSuggestions({
      diabetesResult: 'No Risk',
      heartResult: prediction.result,
      bmiCategory: getBmiCategory(bmi),
    });

    await savePredictionRecord({
      userId: req.user._id,
      validated,
      bmi,
      diabetesRisk: null,
      heartRisk,
      summary: `Heart prediction: ${prediction.result}`,
      recommendations,
    });

    return res.json({
      success: true,
      heart: prediction.result,
      probability: prediction.probability,
      bmi,
      bmiCategory: getBmiCategory(bmi),
      fbs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Predict both heart and diabetes risk
// @route   POST /api/predict/all
// @access  Private
export const predictAll = async (req, res) => {
  try {
    const validated = validateCommonInputs(req.body);
    if (validated.error) {
      return res.status(400).json({ success: false, message: validated.error });
    }

    const bmi = req.body.bmi ? parseNumber(req.body.bmi) : computeBmi(validated.weight, validated.height);
    if (!bmi) {
      return res.status(400).json({ success: false, message: 'BMI could not be calculated.' });
    }

    const fbs = validated.glucose > 120 ? 1 : 0;

    const [diabetesPrediction, heartPrediction] = await Promise.all([
      runPythonPrediction({
        modelType: 'diabetes',
        features: {
          age: validated.age,
          glucose: validated.glucose,
          bmi,
        },
      }),
      runPythonPrediction({
        modelType: 'heart',
        features: {
          age: validated.age,
          gender: validated.gender === 'male' ? 1 : 0,
          blood_pressure: validated.bloodPressure,
          cholesterol: validated.cholesterol,
          fbs,
        },
      }),
    ]);

    const diabetesResult = diabetesPrediction.result;
    const heartResult = heartPrediction.result;
    const bmiCategory = getBmiCategory(bmi);
    const suggestions = getSuggestions({ diabetesResult, heartResult, bmiCategory });
    const diabetesRisk = probabilityToRiskScore(diabetesPrediction.probability);
    const heartRisk = probabilityToRiskScore(heartPrediction.probability);

    await savePredictionRecord({
      userId: req.user._id,
      validated,
      bmi,
      diabetesRisk,
      heartRisk,
      summary: `Combined prediction: Diabetes ${diabetesResult}, Heart ${heartResult}`,
      recommendations: suggestions,
    });

    await Notification.create({
      user: req.user._id,
      title: 'ML Risk Prediction Ready',
      message: `Diabetes: ${diabetesResult}, Heart: ${heartResult}`,
      type: 'health',
      link: '/dashboard/risk-prediction/heart-diabetes',
    });

    return res.json({
      success: true,
      diabetes: diabetesResult,
      heart: heartResult,
      probability: {
        diabetes: diabetesPrediction.probability,
        heart: heartPrediction.probability,
      },
      bmi,
      bmiCategory,
      fbs,
      suggestions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Share latest prediction on WhatsApp
// @route   POST /api/predict/share-whatsapp
// @access  Private
export const sharePredictionOnWhatsApp = async (req, res) => {
  try {
    const { diabetes, heart, bmi, bmiCategory } = req.body;

    if (!diabetes || !heart) {
      return res.status(400).json({
        success: false,
        message: 'diabetes and heart are required.',
      });
    }

    if (!req.user?.whatsappNumber) {
      return res.status(400).json({
        success: false,
        message: 'No WhatsApp number found in your profile. Please add it first.',
      });
    }

    const normalized = normalizeWhatsAppNumber(req.user.whatsappNumber);
    if (!isValidWhatsAppNumber(normalized)) {
      return res.status(400).json({ success: false, message: 'Invalid WhatsApp number.' });
    }

    const patientName = req.user?.name || 'User';
    const message = [
      `Hi ${patientName}, your Healance ML prediction summary:`,
      `Diabetes Risk: ${diabetes}`,
      `Heart Risk: ${heart}`,
      bmi ? `BMI: ${bmi}` : null,
      bmiCategory ? `BMI Category: ${bmiCategory}` : null,
      'Please consult a doctor for clinical diagnosis.',
    ]
      .filter(Boolean)
      .join('\n');

    const sendResult = await sendWhatsAppTextMessage(normalized, message);

    return res.json({
      success: true,
      message: sendResult.sent
        ? 'Prediction sent to WhatsApp successfully.'
        : 'WhatsApp credentials missing. Message simulated in dev mode.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
