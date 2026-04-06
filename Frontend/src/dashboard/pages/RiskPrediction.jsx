import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Dumbbell,
  Loader2,
  MessageCircle,
  Pill,
  ShieldCheck,
  Soup,
  Stethoscope,
} from 'lucide-react';
import { riskService } from '../../services/api';
import Button from '../../shared/ui/Button';
import DashReveal from '../../shared/ui/DashReveal';

const SYMPTOM_LABELS = {
  fever: 'Fever',
  cough: 'Cough',
  headache: 'Headache',
  fatigue: 'Fatigue',
  vomiting: 'Vomiting',
  chest_pain: 'Chest Pain',
  sore_throat: 'Sore Throat',
  breathlessness: 'Breathlessness',
  nausea: 'Nausea',
  dizziness: 'Dizziness',
  body_pain: 'Body Pain',
  diarrhea: 'Diarrhea',
  skin_rash: 'Skin Rash',
  itching: 'Itching',
  weight_loss: 'Weight Loss',
  sweating: 'Sweating',
};

const initialSymptoms = Object.keys(SYMPTOM_LABELS).reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {});

const confidenceText = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return `${Math.round(value * 100)}%`;
};

const RiskPrediction = () => {
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const selectedSymptoms = useMemo(
    () => Object.entries(symptoms).filter(([, enabled]) => enabled).map(([key]) => key),
    [symptoms]
  );

  const toggleSymptom = (key) => {
    setSymptoms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetAll = () => {
    setSymptoms(initialSymptoms);
    setResult(null);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setResult(null);

    if (selectedSymptoms.length < 2) {
      setError('Please select at least 2 symptoms for better prediction.');
      return;
    }

    try {
      setIsLoading(true);
      const payload = Object.keys(symptoms).reduce((acc, key) => {
        acc[key] = symptoms[key];
        return acc;
      }, {});

      const response = await riskService.predictSymptomsDisease(payload);
      if (response.success) {
        setResult(response);
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Prediction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareWhatsapp = async () => {
    if (!result) return;

    try {
      setIsSharing(true);
      setError('');
      setMessage('');

      const response = await riskService.shareSymptomsToWhatsapp({
        predictedDisease: result.predictedDisease,
        confidence: result.confidence,
        topPredictions: result.topPredictions,
        selectedSymptoms: result.selectedSymptoms,
        details: result.details,
      });

      setMessage(response.message || 'Prediction summary sent on WhatsApp.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to share on WhatsApp right now.');
    } finally {
      setIsSharing(false);
    }
  };

  const details = result?.details || {};

  return (
    <div className="space-y-6 sm:space-y-8">
      <DashReveal>
      <div className="dash-card-static">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0b1030]">Symptoms Disease Prediction</h2>
          <p className="text-sm sm:text-base text-[#5f697a]">
            Select symptoms and the AI model will suggest the most likely disease along with diet, workout, precautions, and medications.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(SYMPTOM_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleSymptom(key)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors text-left ${
                  symptoms[key]
                    ? 'bg-[#506cd7] text-white border-[#506cd7]'
                    : 'bg-white text-[#0b1030] border-[#e8eaf9] hover:bg-[#f0f1fc]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-[#5f697a]">
              Selected: <span className="font-semibold text-[#0b1030]">{selectedSymptoms.length}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={resetAll}>
                Reset
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Predicting...
                  </span>
                ) : (
                  'Predict Disease'
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </form>
      </div>
      </DashReveal>

      {result && (
        <motion.div
          className="space-y-6 sm:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-blue-50 border border-blue-100 p-4 sm:p-6 rounded-[20px] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="dash-icon-badge bg-blue-600">
              <Stethoscope size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-[#0b1030]">
                Predicted Disease: {result.predictedDisease}
              </h3>
              <p className="text-sm sm:text-base text-[#394162]">
                Confidence: <span className="font-semibold">{confidenceText(result.confidence)}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="dash-card-static space-y-3">
              <h4 className="dash-heading text-sm sm:text-base flex items-center gap-2">
                <Activity size={18} className="text-[#506cd7]" />
                Description
              </h4>
              <p className="text-sm text-[#5f697a]">
                {details.description || 'Description not available for this disease.'}
              </p>
            </div>

            <div className="dash-card-static space-y-3">
              <h4 className="dash-heading text-sm sm:text-base flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#f59e0b]" />
                Top Predictions
              </h4>
              <div className="space-y-2">
                {(result.topPredictions || []).map((item) => (
                  <div
                    key={item.disease}
                    className="flex items-center justify-between rounded-xl border border-[#e8eaf9] px-3 py-2"
                  >
                    <span className="text-sm font-medium text-[#0b1030]">{item.disease}</span>
                    <span className="text-xs font-semibold text-[#506cd7]">{confidenceText(item.confidence)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="dash-card-static space-y-3">
              <h4 className="dash-heading text-sm sm:text-base flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" />
                Precautions
              </h4>
              <ul className="space-y-2 text-sm text-[#5f697a] list-disc pl-5">
                {(details.precautions || []).length > 0
                  ? details.precautions.map((item) => <li key={item}>{item}</li>)
                  : <li>No precautions available.</li>}
              </ul>
            </div>

            <div className="dash-card-static space-y-3">
              <h4 className="dash-heading text-sm sm:text-base flex items-center gap-2">
                <Pill size={18} className="text-[#ef4444]" />
                Medications
              </h4>
              <ul className="space-y-2 text-sm text-[#5f697a] list-disc pl-5">
                {(details.medications || []).length > 0
                  ? details.medications.map((item) => <li key={item}>{item}</li>)
                  : <li>No medication guidance available.</li>}
              </ul>
            </div>

            <div className="dash-card-static space-y-3">
              <h4 className="dash-heading text-sm sm:text-base flex items-center gap-2">
                <Soup size={18} className="text-orange-500" />
                Diet Plan
              </h4>
              <ul className="space-y-2 text-sm text-[#5f697a] list-disc pl-5">
                {(details.diets || []).length > 0
                  ? details.diets.map((item) => <li key={item}>{item}</li>)
                  : <li>No diet suggestions available.</li>}
              </ul>
            </div>

            <div className="dash-card-static space-y-3">
              <h4 className="dash-heading text-sm sm:text-base flex items-center gap-2">
                <Dumbbell size={18} className="text-blue-500" />
                Workout Plan
              </h4>
              <ul className="space-y-2 text-sm text-[#5f697a] list-disc pl-5">
                {(details.workouts || []).length > 0
                  ? details.workouts.map((item) => <li key={item}>{item}</li>)
                  : <li>No workout suggestions available.</li>}
              </ul>
            </div>
          </div>

          {(details.riskFactors || []).length > 0 && (
            <div className="dash-card-static space-y-3">
              <h4 className="dash-heading text-sm sm:text-base">Risk Factors</h4>
              <ul className="space-y-2 text-sm text-[#5f697a] list-disc pl-5">
                {details.riskFactors.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}

          <div className="dash-card-static">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-[#5f697a]">
                Share this complete report, including all suggestions, on WhatsApp.
              </p>
              <Button type="button" variant="secondary" onClick={handleShareWhatsapp} disabled={isSharing}>
                {isSharing ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle size={16} />
                    Send Full Result on WhatsApp
                  </span>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {message && <p className="text-sm font-medium text-[#5f697a]">{message}</p>}
    </div>
  );
};

export default RiskPrediction;
