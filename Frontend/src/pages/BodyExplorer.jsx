import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, AlertCircle, ShieldCheck, Stethoscope } from 'lucide-react';
import HumanBody from '../components/HumanBody';
import Button from '../components/ui/Button';

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

  const handlePartClick = (partName) => {
    setSelectedPart(partName);
  };

  const partInfo = bodyData[selectedPart] || bodyData["default"];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Interactive Body Explorer</h2>
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex">
          <button 
            onClick={() => setGender('male')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === 'male' ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Male
          </button>
          <button 
            onClick={() => setGender('female')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === 'female' ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Female
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative overflow-hidden flex justify-center items-center">
        <div className="w-full max-w-md h-full">
          <HumanBody gender={gender} onPartClick={handlePartClick} />
        </div>

        <div className="absolute bottom-6 left-6 bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-xs">
          <p className="text-sm text-slate-600 flex items-center">
            <Activity size={16} className="mr-2 text-primary-500" />
            Hover and click on body parts to view detailed health insights.
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 flex justify-between items-center text-white">
                <h3 className="text-2xl font-bold">{selectedPart}</h3>
                <button onClick={() => setSelectedPart(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Function</h4>
                  <p className="text-slate-700 leading-relaxed">{partInfo.function}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
