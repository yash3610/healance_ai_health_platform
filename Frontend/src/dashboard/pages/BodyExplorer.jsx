import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, AlertCircle, ShieldCheck, Stethoscope } from 'lucide-react';
import HumanBody from '../components/HumanBody';

const bodyData = {
  "Heart": {
    function: "Pumps blood throughout the body, supplying oxygen and nutrients to tissues.",
    diseases: ["Coronary Artery Disease", "Arrhythmia", "Heart Failure"],
    symptoms: ["Chest pain", "Shortness of breath", "Fatigue"],
    tests: ["ECG", "Echocardiogram", "Stress Test"],
    prevention: ["Regular cardio", "Low sodium diet", "Stress management"],
    metrics: "Resting Rate: 60-100 bpm"
  },
  "Brain": {
    function: "Controls thought, memory, emotion, touch, motor skills, vision, breathing, temperature, and hunger.",
    diseases: ["Alzheimer's", "Stroke", "Migraine"],
    symptoms: ["Headache", "Confusion", "Vision changes"],
    tests: ["MRI", "CT Scan", "EEG"],
    prevention: ["Mental exercises", "Adequate sleep", "Healthy diet"],
    metrics: "Cognitive Score: Normal"
  },
  "Lungs": {
    function: "Facilitate gas exchange, bringing oxygen into the blood and removing carbon dioxide.",
    diseases: ["Asthma", "COPD", "Pneumonia"],
    symptoms: ["Coughing", "Wheezing", "Chest tightness"],
    tests: ["Spirometry", "Chest X-ray"],
    prevention: ["Avoid smoking", "Air quality awareness", "Breathing exercises"],
    metrics: "Capacity: 98% SpO2"
  },
  "Shoulders": {
    function: "Provide joint mobility and support arm rotation and lifting.",
    diseases: ["Rotator cuff injury", "Bursitis", "Frozen shoulder"],
    symptoms: ["Shoulder pain", "Stiffness", "Reduced arm movement"],
    tests: ["Shoulder X-ray", "MRI", "Range of motion test"],
    prevention: ["Posture correction", "Strength training", "Avoid overuse"],
    metrics: "Mobility: Functional"
  },
  "Hands": {
    function: "Enable grip, touch sensing, and fine motor movements.",
    diseases: ["Carpal tunnel syndrome", "Tendonitis", "Arthritis"],
    symptoms: ["Numbness", "Weak grip", "Joint pain"],
    tests: ["Nerve conduction study", "X-ray", "Grip strength test"],
    prevention: ["Ergonomic posture", "Hand stretches", "Frequent breaks"],
    metrics: "Grip Strength: Normal"
  },
  "Legs": {
    function: "Support body weight and enable walking, running, and balance.",
    diseases: ["Varicose veins", "Muscle strain", "Knee osteoarthritis"],
    symptoms: ["Pain", "Swelling", "Weakness"],
    tests: ["Doppler ultrasound", "X-ray", "Physical assessment"],
    prevention: ["Regular walking", "Strength training", "Hydration"],
    metrics: "Gait Score: Stable"
  },
  "Feet": {
    function: "Maintain balance, absorb shock, and support movement.",
    diseases: ["Plantar fasciitis", "Flat foot", "Diabetic foot"],
    symptoms: ["Heel pain", "Burning sensation", "Swelling"],
    tests: ["Foot pressure analysis", "X-ray", "Neuropathy screening"],
    prevention: ["Supportive footwear", "Foot hygiene", "Stretching"],
    metrics: "Pressure Pattern: Balanced"
  },
  // Default fallback for other parts
  "default": {
    function: "Essential body part maintaining structural or physiological integrity.",
    diseases: ["Infection", "Inflammation", "Trauma"],
    symptoms: ["Pain", "Swelling", "Redness"],
    tests: ["Physical Exam", "Imaging"],
    prevention: ["Regular checkups", "Healthy lifestyle"],
    metrics: "Status: Healthy"
  }
};

const BodyExplorer = () => {
  const [gender, setGender] = useState('male');
  const [selectedPart, setSelectedPart] = useState(null);
  const [bodyResetToken, setBodyResetToken] = useState(0);

  const partsInput = {
    head: { show: true },
    left_shoulder: { show: true },
    right_shoulder: { show: true },
    left_arm: { show: true },
    right_arm: { show: true },
    chest: { show: true },
    stomach: { show: true },
    left_leg: { show: true },
    right_leg: { show: true },
    left_hand: { show: true },
    right_hand: { show: true },
    left_foot: { show: true },
    right_foot: { show: true }
  };

  const handlePartClick = (partName) => {
    setSelectedPart(partName);
  };

  const handleCloseModal = () => {
    setSelectedPart(null);
    setBodyResetToken((prev) => prev + 1);
  };

  const partInfo = bodyData[selectedPart] || bodyData["default"];

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Interactive Body Explorer</h2>
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex">
          <button 
            onClick={() => setGender('male')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === 'male' ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Male
          </button>
          <button 
            onClick={() => setGender('female')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === 'female' ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Female
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 relative overflow-hidden flex justify-center items-center min-h-[400px]">
        <div className="w-full max-w-xs sm:max-w-md h-full">
          <HumanBody
            gender={gender}
            onPartClick={handlePartClick}
            partsInput={partsInput}
            resetToken={bodyResetToken}
          />
        </div>

        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 max-w-[200px] sm:max-w-xs">
          <p className="text-xs sm:text-sm text-slate-600 flex items-center">
            <Activity size={14} className="mr-2 text-primary-500 flex-shrink-0" />
            <span className="hidden sm:inline">Hover and click on body parts to view detailed health insights.</span>
            <span className="sm:hidden">Tap body parts for health insights.</span>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {selectedPart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 sm:p-6 flex justify-between items-center text-white">
                <h3 className="text-xl sm:text-2xl font-bold">{selectedPart}</h3>
                <button onClick={handleCloseModal} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Function</h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{partInfo.function}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2 mb-2 text-red-600 font-bold">
                      <AlertCircle size={18} /> Common Diseases
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {partInfo.diseases.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold">
                      <Stethoscope size={18} /> Recommended Tests
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {partInfo.tests.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 mb-2 text-green-700 font-bold">
                    <ShieldCheck size={18} /> Prevention & Care
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {partInfo.prevention.map((p, i) => (
                      <span key={i} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-green-700 shadow-sm border border-green-100">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Related Metrics</span>
                  <span className="font-bold text-slate-800">{partInfo.metrics}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BodyExplorer;
