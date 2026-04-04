import React from 'react';

const PartLabel = ({ name, x, y }) => {
  if (!name) return null;

  return (
    <div
      className="absolute z-20 pointer-events-none select-none hidden sm:block"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -140%)',
      }}
    >
      <div className="bg-slate-900/85 backdrop-blur-sm text-white text-[11px] font-medium
                      px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap">
        {name}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2
                        bg-slate-900/85 rotate-45" />
      </div>
    </div>
  );
};

export default PartLabel;
