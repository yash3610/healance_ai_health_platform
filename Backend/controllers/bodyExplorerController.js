// Comprehensive body parts data for the Body Explorer feature

const bodyPartsData = {
  "Head": {
    function: "Houses and protects the brain. Contains sensory organs for sight, hearing, smell, and taste.",
    diseases: ["Migraine", "Sinusitis", "Concussion", "Tension Headache"],
    symptoms: ["Headache", "Dizziness", "Visual changes", "Facial pain"],
    tests: ["CT Scan", "MRI", "Neurological Exam"],
    prevention: ["Adequate sleep", "Hydration", "Stress management", "Wear helmets"],
    metrics: "Cognitive Function: Normal"
  },
  "Brain": {
    function: "Controls thought, memory, emotion, touch, motor skills, vision, breathing, temperature, and hunger.",
    diseases: ["Alzheimer's Disease", "Stroke", "Migraine", "Epilepsy", "Parkinson's"],
    symptoms: ["Headache", "Confusion", "Vision changes", "Memory loss", "Seizures"],
    tests: ["MRI", "CT Scan", "EEG", "Cognitive Assessment"],
    prevention: ["Mental exercises", "Adequate sleep", "Healthy diet", "Regular physical activity", "Social engagement"],
    metrics: "Cognitive Score: Normal"
  },
  "Eyes": {
    function: "Primary organs of sight, converting light into electrical signals sent to the brain for visual processing.",
    diseases: ["Myopia", "Glaucoma", "Cataracts", "Macular Degeneration"],
    symptoms: ["Blurred vision", "Eye strain", "Redness", "Floaters"],
    tests: ["Visual Acuity Test", "Eye Pressure Test", "Retinal Exam"],
    prevention: ["20-20-20 rule for screens", "UV-protective sunglasses", "Regular eye exams", "Adequate vitamin A"],
    metrics: "Vision: 20/20"
  },
  "Chest": {
    function: "Protects the heart and lungs. Contains the ribcage and respiratory muscles for breathing.",
    diseases: ["Costochondritis", "Pneumonia", "Pleurisy"],
    symptoms: ["Chest pain", "Difficulty breathing", "Tenderness"],
    tests: ["Chest X-ray", "CT Scan", "ECG"],
    prevention: ["Good posture", "Breathing exercises", "Regular checkups"],
    metrics: "Respiratory Rate: 12-20 bpm"
  },
  "Heart": {
    function: "Pumps blood throughout the body, supplying oxygen and nutrients to tissues and removing waste products.",
    diseases: ["Coronary Artery Disease", "Arrhythmia", "Heart Failure", "Valve Disease", "Cardiomyopathy"],
    symptoms: ["Chest pain", "Shortness of breath", "Fatigue", "Palpitations", "Swelling in legs"],
    tests: ["ECG", "Echocardiogram", "Stress Test", "Cardiac Catheterization", "Blood Tests (Troponin)"],
    prevention: ["Regular cardio exercise", "Low sodium diet", "Stress management", "No smoking", "Healthy weight"],
    metrics: "Resting Heart Rate: 60-100 bpm"
  },
  "Lungs": {
    function: "Facilitate gas exchange, bringing oxygen into the blood and removing carbon dioxide from the body.",
    diseases: ["Asthma", "COPD", "Pneumonia", "Tuberculosis", "Lung Cancer"],
    symptoms: ["Coughing", "Wheezing", "Chest tightness", "Shortness of breath", "Blood in sputum"],
    tests: ["Spirometry", "Chest X-ray", "CT Scan", "Pulse Oximetry", "Bronchoscopy"],
    prevention: ["Avoid smoking", "Air quality awareness", "Breathing exercises", "Regular flu vaccination", "Use masks in polluted areas"],
    metrics: "SpO2: 95-100%"
  },
  "Stomach": {
    function: "Digests food using enzymes and acids. Breaks down food into nutrients that can be absorbed by the intestines.",
    diseases: ["Gastritis", "GERD", "Peptic Ulcer", "Stomach Cancer", "IBS"],
    symptoms: ["Abdominal pain", "Bloating", "Nausea", "Heartburn", "Loss of appetite"],
    tests: ["Endoscopy", "H. pylori Test", "Barium Swallow", "Abdominal Ultrasound"],
    prevention: ["Balanced diet", "Avoid excessive spicy food", "Regular meals", "Limit alcohol", "Manage stress"],
    metrics: "pH Level: 1.5-3.5"
  },
  "Liver": {
    function: "Processes nutrients, filters toxins from blood, produces bile for digestion, and stores vitamins and minerals.",
    diseases: ["Hepatitis", "Fatty Liver Disease", "Cirrhosis", "Liver Cancer"],
    symptoms: ["Jaundice", "Fatigue", "Abdominal swelling", "Dark urine", "Nausea"],
    tests: ["Liver Function Test (LFT)", "Ultrasound", "Fibroscan", "CT Scan", "Liver Biopsy"],
    prevention: ["Limit alcohol", "Maintain healthy weight", "Hepatitis vaccination", "Avoid toxins", "Exercise regularly"],
    metrics: "ALT/AST: Normal Range"
  },
  "Kidneys": {
    function: "Filter blood to remove waste, balance body fluids, regulate blood pressure, and produce hormones.",
    diseases: ["Kidney Stones", "Chronic Kidney Disease", "UTI", "Polycystic Kidney Disease"],
    symptoms: ["Back pain", "Frequent urination", "Blood in urine", "Fatigue", "Swelling"],
    tests: ["Kidney Function Test", "Urinalysis", "Ultrasound", "CT Scan", "GFR Test"],
    prevention: ["Adequate water intake", "Low sodium diet", "Regular exercise", "Avoid NSAIDs overuse", "Control blood sugar"],
    metrics: "GFR: >90 mL/min (Normal)"
  },
  "Spine": {
    function: "Provides structural support, protects the spinal cord, and enables flexible movement of the torso.",
    diseases: ["Herniated Disc", "Scoliosis", "Spinal Stenosis", "Osteoporosis"],
    symptoms: ["Back pain", "Numbness", "Tingling", "Weakness in limbs", "Stiffness"],
    tests: ["X-ray", "MRI", "CT Scan", "Bone Density Test", "Nerve Conduction Study"],
    prevention: ["Good posture", "Core strengthening exercises", "Ergonomic workstation", "Regular stretching", "Maintain healthy weight"],
    metrics: "Spinal Alignment: Normal"
  },
  "Left Arm": {
    function: "Used for grasping, lifting, and manipulating objects. Contains bones, muscles, nerves, and blood vessels.",
    diseases: ["Tennis Elbow", "Carpal Tunnel Syndrome", "Fractures", "Arthritis"],
    symptoms: ["Pain", "Numbness", "Weakness", "Tingling", "Swelling"],
    tests: ["X-ray", "EMG", "Nerve Conduction Study", "MRI"],
    prevention: ["Proper ergonomics", "Regular stretching", "Strengthening exercises", "Avoid repetitive strain"],
    metrics: "Grip Strength: Normal"
  },
  "Right Arm": {
    function: "Used for grasping, lifting, and manipulating objects. Contains bones, muscles, nerves, and blood vessels.",
    diseases: ["Tennis Elbow", "Carpal Tunnel Syndrome", "Fractures", "Arthritis"],
    symptoms: ["Pain", "Numbness", "Weakness", "Tingling", "Swelling"],
    tests: ["X-ray", "EMG", "Nerve Conduction Study", "MRI"],
    prevention: ["Proper ergonomics", "Regular stretching", "Strengthening exercises", "Avoid repetitive strain"],
    metrics: "Grip Strength: Normal"
  },
  "Left Leg": {
    function: "Supports body weight, enables locomotion and balance. Contains large bones, muscles, and joints.",
    diseases: ["DVT", "Varicose Veins", "Knee Osteoarthritis", "Fractures"],
    symptoms: ["Pain", "Swelling", "Cramping", "Numbness", "Difficulty walking"],
    tests: ["X-ray", "Doppler Ultrasound", "MRI", "Blood Tests"],
    prevention: ["Regular exercise", "Proper footwear", "Stretching", "Maintain healthy weight", "Stay hydrated"],
    metrics: "Range of Motion: Normal"
  },
  "Right Leg": {
    function: "Supports body weight, enables locomotion and balance. Contains large bones, muscles, and joints.",
    diseases: ["DVT", "Varicose Veins", "Knee Osteoarthritis", "Fractures"],
    symptoms: ["Pain", "Swelling", "Cramping", "Numbness", "Difficulty walking"],
    tests: ["X-ray", "Doppler Ultrasound", "MRI", "Blood Tests"],
    prevention: ["Regular exercise", "Proper footwear", "Stretching", "Maintain healthy weight", "Stay hydrated"],
    metrics: "Range of Motion: Normal"
  },
};

// @desc    Get all body parts data
// @route   GET /api/body-explorer
// @access  Public (or Private based on your need)
export const getAllBodyParts = (req, res) => {
  res.json({
    success: true,
    data: bodyPartsData,
    totalParts: Object.keys(bodyPartsData).length,
  });
};

// @desc    Get specific body part info
// @route   GET /api/body-explorer/:partName
// @access  Public
export const getBodyPartInfo = (req, res) => {
  const partName = req.params.partName;
  const partInfo = bodyPartsData[partName];

  if (!partInfo) {
    // Return default data for unknown parts
    return res.json({
      success: true,
      data: {
        function: "Essential body part maintaining structural or physiological integrity.",
        diseases: ["Infection", "Inflammation", "Trauma"],
        symptoms: ["Pain", "Swelling", "Redness"],
        tests: ["Physical Exam", "Imaging"],
        prevention: ["Regular checkups", "Healthy lifestyle"],
        metrics: "Status: Healthy"
      },
      partName,
    });
  }

  res.json({ success: true, data: partInfo, partName });
};
