import * as THREE from 'three';

// ─── LAYER COLOR PALETTES ────────────────────────────────────
// Each layer has per-region colors for realistic medical visualization

export const LAYER_PALETTES = {
  muscles: {
    Brain:     { base: '#E8B4A0', accent: '#D4967E' },  // Warm skin (head)
    Heart:     { base: '#C75B5B', accent: '#A84444' },  // Deep red (pectorals)
    Lungs:     { base: '#D4726A', accent: '#B85C55' },  // Medium red (ribcage)
    Shoulders: { base: '#C9685E', accent: '#AD5448' },  // Red-brown (deltoids)
    Hands:     { base: '#D9917A', accent: '#C07A64' },  // Warm pinkish (arms)
    Legs:      { base: '#CB6B60', accent: '#B05550' },  // Red-pink (quads)
    Feet:      { base: '#D49888', accent: '#BC7F70' },  // Light warm (feet)
    roughness: 0.82,
    metalness: 0.02,
    opacity: 1.0,
  },
  bones: {
    Brain:     { base: '#F5EDE4', accent: '#E8DCC8' },  // Skull - ivory white
    Heart:     { base: '#EDE5D8', accent: '#DDD2C0' },  // Ribcage/sternum
    Lungs:     { base: '#E8DCC8', accent: '#D4C8B0' },  // Spine/ribs
    Shoulders: { base: '#F0E6D8', accent: '#E0D4C2' },  // Scapula/clavicle
    Hands:     { base: '#F2EAE0', accent: '#E4D8C8' },  // Arm bones/phalanges
    Legs:      { base: '#EBE0D0', accent: '#D8CCB8' },  // Femur/tibia
    Feet:      { base: '#F0E8DE', accent: '#E2D8CA' },  // Tarsals/metatarsals
    roughness: 0.70,
    metalness: 0.05,
    opacity: 1.0,
  },
  organs: {
    Brain:     { base: '#E8A0B0', accent: '#D08898' },  // Brain - pinkish
    Heart:     { base: '#C44040', accent: '#A83030' },  // Heart - deep red
    Lungs:     { base: '#D4908A', accent: '#BC7872' },  // Lungs - pink-red
    Shoulders: { base: '#D4A898', accent: '#C09080' },  // Muscle tissue
    Hands:     { base: '#D4A898', accent: '#C09080' },  // Tissue
    Legs:      { base: '#D4A090', accent: '#BC8878' },  // Tissue
    Feet:      { base: '#D4A898', accent: '#C09080' },  // Tissue
    roughness: 0.75,
    metalness: 0.03,
    opacity: 0.85,
  },
  systems: {
    Brain:     { base: '#7EB8E0', accent: '#5CA0D0' },  // Nervous - blue
    Heart:     { base: '#E06060', accent: '#C84848' },  // Circulatory - red
    Lungs:     { base: '#80C0A0', accent: '#60A880' },  // Respiratory - green
    Shoulders: { base: '#B088D0', accent: '#9870B8' },  // Lymphatic - purple
    Hands:     { base: '#7EB8E0', accent: '#5CA0D0' },  // Nervous - blue
    Legs:      { base: '#E06060', accent: '#C84848' },  // Circulatory - red
    Feet:      { base: '#7EB8E0', accent: '#5CA0D0' },  // Nervous - blue
    roughness: 0.60,
    metalness: 0.08,
    opacity: 0.90,
  },
};

// Material defaults
export const MATERIAL_CONFIG = {
  roughness: 0.82,
  metalness: 0.02,
  envMapIntensity: 0.2,
};

// Highlight colors (Healance brand)
export const HIGHLIGHT_COLOR = new THREE.Color('#0ea5e9');
export const SELECTED_COLOR = new THREE.Color('#14b8a6');
