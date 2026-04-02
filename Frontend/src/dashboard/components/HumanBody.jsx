import React from 'react';
import { BodyComponent } from 'reactjs-human-body';

const clickedIdToLabel = {
  head: 'Head',
  leftShoulder: 'Shoulders',
  rightShoulder: 'Shoulders',
  leftArm: 'Hands',
  rightArm: 'Hands',
  chest: 'Chest',
  stomach: 'Stomach',
  leftLeg: 'Legs',
  rightLeg: 'Legs',
  leftHand: 'Hands',
  rightHand: 'Hands',
  leftFoot: 'Feet',
  rightFoot: 'Feet'
};

const keyMap = {
  head: 'head',
  left_shoulder: 'leftShoulder',
  right_shoulder: 'rightShoulder',
  left_arm: 'leftArm',
  right_arm: 'rightArm',
  chest: 'chest',
  stomach: 'stomach',
  left_leg: 'leftLeg',
  right_leg: 'rightLeg',
  left_hand: 'leftHand',
  right_hand: 'rightHand',
  left_foot: 'leftFoot',
  right_foot: 'rightFoot'
};

const HumanBody = ({ gender, onPartClick, partsInput = {}, resetToken = 0 }) => {
  const normalizedPartsInput = Object.entries(partsInput).reduce((acc, [key, value]) => {
    const mappedKey = keyMap[key] || key;
    acc[mappedKey] = { show: value?.show !== false };
    return acc;
  }, {});

  const handleClick = (id) => {
    const partName = clickedIdToLabel[id] || id;
    onPartClick(partName);
  };

  return (
    <div className="w-full h-full max-h-[700px] flex items-center justify-center">
      <div className="scale-[0.95] sm:scale-100 origin-center">
        <BodyComponent
          key={resetToken}
          partsInput={normalizedPartsInput}
          bodyModel={gender === 'female' ? 'female' : 'male'}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default HumanBody;
