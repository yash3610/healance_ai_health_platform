import React from 'react';
import { motion } from 'framer-motion';

const BodyPart = ({ id, d, name, onClick, className }) => (
  <motion.path
    id={id}
    d={d}
    className={`cursor-pointer transition-all duration-300 ${className}`}
    initial={{ opacity: 0.8 }}
    whileHover={{ opacity: 1, scale: 1.01 }}
    onClick={() => onClick(name)}
    fill="currentColor"
    stroke="white"
    strokeWidth="2"
  />
);

const HumanBody = ({ gender, onPartClick }) => {
  // Simplified abstract representation of body parts
  // In a real app, these would be precise SVG paths for a medical illustration
  
  return (
    <svg viewBox="0 0 400 800" className="w-full h-full max-h-[700px] text-slate-200">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Head */}
      <BodyPart 
        id="head" 
        name="Head" 
        d="M200,50 C170,50 160,80 160,110 C160,140 175,160 200,160 C225,160 240,140 240,110 C240,80 230,50 200,50 Z" 
        className="text-slate-300 hover:text-primary-400"
        onClick={onPartClick}
      />
      
      {/* Brain (Overlay on Head area for interaction) */}
      <BodyPart 
        id="brain" 
        name="Brain" 
        d="M185,70 C185,60 215,60 215,70 C215,90 185,90 185,70 Z" 
        className="text-slate-400 hover:text-pink-400"
        onClick={onPartClick}
      />

      {/* Eyes */}
      <BodyPart 
        id="eyes" 
        name="Eyes" 
        d="M180,100 C180,95 190,95 190,100 M210,100 C210,95 220,95 220,100" 
        className="text-slate-400 hover:text-blue-400"
        onClick={onPartClick}
      />

      {/* Neck */}
      <path d="M185,155 L185,180 L215,180 L215,155 Z" fill="currentColor" className="text-slate-300" />

      {/* Torso / Chest */}
      <BodyPart 
        id="chest" 
        name="Chest" 
        d="M160,180 L240,180 L260,280 L140,280 Z" 
        className="text-slate-300 hover:text-primary-300"
        onClick={onPartClick}
      />

      {/* Lungs */}
      <BodyPart 
        id="lungs" 
        name="Lungs" 
        d="M170,190 Q190,190 195,240 Q170,250 165,240 Z M230,190 Q210,190 205,240 Q230,250 235,240 Z" 
        className="text-slate-400 hover:text-red-300"
        onClick={onPartClick}
      />

      {/* Heart */}
      <BodyPart 
        id="heart" 
        name="Heart" 
        d="M200,210 Q215,200 220,220 Q200,240 200,210" 
        className="text-slate-400 hover:text-red-500"
        onClick={onPartClick}
      />

      {/* Stomach Area / Abdomen */}
      <BodyPart 
        id="abdomen" 
        name="Stomach" 
        d="M140,280 L260,280 L250,400 L150,400 Z" 
        className="text-slate-300 hover:text-primary-300"
        onClick={onPartClick}
      />

      {/* Liver */}
      <BodyPart 
        id="liver" 
        name="Liver" 
        d="M160,290 Q200,280 210,310 Q160,320 160,290" 
        className="text-slate-400 hover:text-orange-400"
        onClick={onPartClick}
      />

      {/* Kidneys */}
      <BodyPart 
        id="kidneys" 
        name="Kidneys" 
        d="M170,330 C160,330 160,350 170,350 C180,350 180,330 170,330 M230,330 C220,330 220,350 230,350 C240,350 240,330 230,330" 
        className="text-slate-400 hover:text-yellow-600"
        onClick={onPartClick}
      />

      {/* Intestine */}
      <BodyPart 
        id="intestine" 
        name="Intestine" 
        d="M180,360 Q200,350 220,360 Q220,390 180,390 Z" 
        className="text-slate-400 hover:text-pink-300"
        onClick={onPartClick}
      />

      {/* Arms */}
      <BodyPart 
        id="left-arm" 
        name="Hands" 
        d="M160,180 L130,250 L110,350 L130,360 L150,260 L160,180" 
        className="text-slate-300 hover:text-primary-400"
        onClick={onPartClick}
      />
      <BodyPart 
        id="right-arm" 
        name="Hands" 
        d="M240,180 L270,250 L290,350 L270,360 L250,260 L240,180" 
        className="text-slate-300 hover:text-primary-400"
        onClick={onPartClick}
      />

      {/* Legs */}
      <BodyPart 
        id="left-leg" 
        name="Legs" 
        d="M150,400 L140,550 L130,700 L160,700 L170,550 L195,400 Z" 
        className="text-slate-300 hover:text-primary-400"
        onClick={onPartClick}
      />
      <BodyPart 
        id="right-leg" 
        name="Legs" 
        d="M250,400 L260,550 L270,700 L240,700 L230,550 L205,400 Z" 
        className="text-slate-300 hover:text-primary-400"
        onClick={onPartClick}
      />

    </svg>
  );
};

export default HumanBody;
