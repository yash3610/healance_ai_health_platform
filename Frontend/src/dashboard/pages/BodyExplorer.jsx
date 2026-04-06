import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import AnatomyViewer from '../components/body-explorer/AnatomyViewer';
import PartDetailCard from '../components/body-explorer/PartDetailCard';

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
  const [hoveredPart, setHoveredPart] = useState(null);
  const [activeLayer, setActiveLayer] = useState('muscles');

  const handlePartClick = (partName) => {
    setSelectedPart(partName);
  };

  const handleCloseDetail = () => {
    setSelectedPart(null);
  };

  const partInfo = selectedPart ? (bodyData[selectedPart] || bodyData["default"]) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center gap-3 mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold text-[#0b1030] truncate">
          Interactive Body Explorer
        </h2>
        <div className="bg-white p-0.5 sm:p-1 rounded-xl border border-[#e8eaf9] flex flex-shrink-0">
          <button
            onClick={() => setGender('male')}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
              ${gender === 'male'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-[#5f697a] hover:bg-[#f0f1fc]'
              }`}
          >
            Male
          </button>
          <button
            onClick={() => setGender('female')}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
              ${gender === 'female'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-[#5f697a] hover:bg-[#f0f1fc]'
              }`}
          >
            Female
          </button>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 bg-gradient-to-b from-[#f0f1fc] to-white rounded-[20px] border border-[#e8eaf9]
                      relative overflow-hidden min-h-[350px] sm:min-h-[450px] lg:min-h-[550px]"
           style={{ boxShadow: '0 10px 35px rgba(2, 6, 23, 0.08)' }}>
        <AnatomyViewer
          gender={gender}
          selectedPart={selectedPart}
          onPartClick={handlePartClick}
          onHover={setHoveredPart}
          activeLayer={activeLayer}
          onLayerChange={setActiveLayer}
        />

        <PartDetailCard
          partName={selectedPart}
          partInfo={partInfo}
          onClose={handleCloseDetail}
        />

        {/* Hint */}
        <div className="absolute bottom-12 sm:bottom-14 left-3 sm:left-4 z-10
                        bg-white/80 backdrop-blur-md p-2 sm:p-3 rounded-lg sm:rounded-xl
                        border border-[#e8eaf9] max-w-[150px] sm:max-w-[180px]"
             style={{ boxShadow: '0 10px 35px rgba(2, 6, 23, 0.08)' }}>
          <p className="text-[9px] sm:text-[10px] lg:text-xs text-[#6a7283] flex items-center">
            <Activity size={10} className="mr-1 sm:mr-1.5 text-red-400 flex-shrink-0" />
            <span className="hidden sm:inline">Drag to rotate, scroll to zoom</span>
            <span className="sm:hidden">Drag & pinch</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BodyExplorer;
