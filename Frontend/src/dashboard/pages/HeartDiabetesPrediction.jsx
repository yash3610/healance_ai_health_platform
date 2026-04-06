import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Droplets, Loader2, Send } from 'lucide-react';
import { riskService } from '../../services/api';
import Button from '../../shared/ui/Button';
import DashReveal from '../../shared/ui/DashReveal';

const initialForm = {
  age: '',
  gender: 'Male',
  weight: '',
  height: '',
  glucose: '',
  bloodPressure: '',
  cholesterol: '',
};

const parseNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

const HeartDiabetesPrediction = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState('');

  const bmi = useMemo(() => {
    const weight = parseNumber(formData.weight);
    const height = parseNumber(formData.height);
    if (!weight || !height) return null;
    const meters = height / 100;
    return Number((weight / (meters * meters)).toFixed(2));
  }, [formData.weight, formData.height]);

  const bmiCategory = useMemo(() => {
    if (!bmi) return '-';
    return getBmiCategory(bmi);
  }, [bmi]);

  const validate = () => {
    const nextErrors = {};

    const age = parseNumber(formData.age);
    const weight = parseNumber(formData.weight);
    const height = parseNumber(formData.height);
    const glucose = parseNumber(formData.glucose);
    const bloodPressure = parseNumber(formData.bloodPressure);
    const cholesterol = parseNumber(formData.cholesterol);

    if (!age || age < 1 || age > 120) nextErrors.age = 'Required';
    if (!weight || weight < 20 || weight > 350) nextErrors.weight = 'Required';
    if (!height || height < 90 || height > 250) nextErrors.height = 'Required';
    if (!glucose || glucose < 40 || glucose > 500) nextErrors.glucose = 'Required';
    if (!bloodPressure || bloodPressure < 40 || bloodPressure > 280) {
      nextErrors.bloodPressure = 'Required';
    }
    if (!cholesterol || cholesterol < 80 || cholesterol > 700) {
      nextErrors.cholesterol = 'Required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!validate()) return;

    try {
      setIsLoading(true);
      const payload = {
        age: Number(formData.age),
        gender: formData.gender,
        weight: Number(formData.weight),
        height: Number(formData.height),
        glucose: Number(formData.glucose),
        bloodPressure: Number(formData.bloodPressure),
        cholesterol: Number(formData.cholesterol),
      };

      const response = await riskService.predictAll(payload);
      if (response.success) {
        setResults(response);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Prediction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareWhatsapp = async () => {
    if (!results) return;

    try {
      setIsSharing(true);
      setMessage('');

      const response = await riskService.shareToWhatsapp({
        diabetes: results.diabetes,
        heart: results.heart,
        bmi: results.bmi,
        bmiCategory: results.bmiCategory,
      });

      setMessage(response.message || 'Result shared on WhatsApp.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to share on WhatsApp right now.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashReveal>
      <div className="dash-card-static">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0b1030]">Heart & Diabetes ML Prediction</h2>
        <p className="text-sm text-[#5f697a] mt-1">
          Fill details and get instant risk prediction with BMI and smart suggestions.
        </p>

        <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" onSubmit={handlePredict}>
          <label className="space-y-1">
            <span className="text-sm font-medium text-[#0b1030]">Age</span>
            <input
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              className="dash-input"
              placeholder="29"
            />
            {errors.age && <span className="text-xs text-red-600">{errors.age}</span>}
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-[#0b1030]">Gender</span>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="dash-input"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-[#0b1030]">Weight (kg)</span>
            <input
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              className="dash-input"
              placeholder="70"
            />
            {errors.weight && <span className="text-xs text-red-600">{errors.weight}</span>}
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-[#0b1030]">Height (cm)</span>
            <input
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              className="dash-input"
              placeholder="170"
            />
            {errors.height && <span className="text-xs text-red-600">{errors.height}</span>}
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-[#0b1030]">Glucose level</span>
            <input
              name="glucose"
              type="number"
              value={formData.glucose}
              onChange={handleChange}
              className="dash-input"
              placeholder="115"
            />
            {errors.glucose && <span className="text-xs text-red-600">{errors.glucose}</span>}
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-[#0b1030]">Blood Pressure</span>
            <input
              name="bloodPressure"
              type="number"
              value={formData.bloodPressure}
              onChange={handleChange}
              className="dash-input"
              placeholder="120"
            />
            {errors.bloodPressure && <span className="text-xs text-red-600">{errors.bloodPressure}</span>}
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-[#0b1030]">Cholesterol</span>
            <input
              name="cholesterol"
              type="number"
              value={formData.cholesterol}
              onChange={handleChange}
              className="dash-input"
              placeholder="180"
            />
            {errors.cholesterol && <span className="text-xs text-red-600">{errors.cholesterol}</span>}
          </label>

          <div className="rounded-[20px] border border-[#e8eaf9] bg-[#f0f1fc] px-4 py-3 flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase text-[#506cd7] tracking-wide">Calculated BMI</span>
            <span className="text-2xl font-heading font-bold text-[#0b1030]">{bmi || '--'}</span>
            <span className="text-xs text-[#5f697a]">Category: {bmiCategory}</span>
          </div>

          <div className="lg:col-span-3">
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Predicting...
                </span>
              ) : (
                'Predict Risk'
              )}
            </Button>
          </div>
        </form>
      </div>
      </DashReveal>

      {results && (
        <motion.div
          className="dash-card-static space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`rounded-[20px] border p-4 ${
                results.diabetes === 'Risk' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Droplets size={18} className={results.diabetes === 'Risk' ? 'text-red-600' : 'text-green-600'} />
                <h3 className="font-bold text-[#0b1030]">Diabetes Risk</h3>
              </div>
              <p className={`text-lg font-bold mt-2 ${results.diabetes === 'Risk' ? 'text-red-700' : 'text-green-700'}`}>
                {results.diabetes === 'Risk' ? '❌ Risk' : '✅ No Risk'}
              </p>
            </div>

            <div
              className={`rounded-[20px] border p-4 ${
                results.heart === 'Risk' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart size={18} className={results.heart === 'Risk' ? 'text-red-600' : 'text-green-600'} />
                <h3 className="font-bold text-[#0b1030]">Heart Risk</h3>
              </div>
              <p className={`text-lg font-bold mt-2 ${results.heart === 'Risk' ? 'text-red-700' : 'text-green-700'}`}>
                {results.heart === 'Risk' ? '❤️ Risk' : '✅ Safe'}
              </p>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#e8eaf9] p-4 bg-[#f0f1fc]">
            <h4 className="font-semibold text-[#0b1030]">Health Suggestions</h4>
            <ul className="mt-2 text-sm text-[#5f697a] list-disc pl-5 space-y-1">
              {results.suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-end">
            <Button type="button" variant="secondary" onClick={handleShareWhatsapp} disabled={isSharing}>
              {isSharing ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Send size={16} />
                  Send on WhatsApp
                </span>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {message && <p className="text-sm font-medium text-[#5f697a]">{message}</p>}
    </div>
  );
};

export default HeartDiabetesPrediction;
