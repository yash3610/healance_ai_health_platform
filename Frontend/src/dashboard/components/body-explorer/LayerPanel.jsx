import React, { useState } from 'react';
import { Bone, Heart, Brain, Layers, ChevronDown } from 'lucide-react';

const LAYERS = [
  { id: 'muscles', label: 'Muscles', icon: Layers, active: true },
  { id: 'bones', label: 'Bones', icon: Bone, active: true },
  { id: 'organs', label: 'Organs', icon: Heart, active: true },
  { id: 'systems', label: 'Systems', icon: Brain, active: true },
];

const LayerPanel = ({ activeLayer = 'muscles', onLayerChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeItem = LAYERS.find((l) => l.id === activeLayer) || LAYERS[0];
  const ActiveIcon = activeItem.icon;

  return (
    <>
      {/* Desktop: vertical panel */}
      <div className="absolute top-3 left-3 z-20 hidden sm:flex flex-col gap-1.5">
        {LAYERS.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          const isAvailable = layer.active;

          return (
            <button
              key={layer.id}
              onClick={() => isAvailable && onLayerChange?.(layer.id)}
              disabled={!isAvailable}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
                transition-all duration-200 min-w-[120px] text-left
                ${isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-[1.02]'
                  : isAvailable
                    ? 'bg-white/90 backdrop-blur-md text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-200/60 shadow-sm'
                    : 'bg-white/50 backdrop-blur-sm text-slate-300 border border-slate-100 cursor-not-allowed'
                }
              `}
              title={!isAvailable ? 'Coming soon' : ''}
            >
              <Icon size={14} />
              <span>{layer.label}</span>
              {!isAvailable && (
                <span className="ml-auto text-[9px] font-normal opacity-50">Soon</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile: compact dropdown */}
      <div className="absolute top-3 left-3 z-20 sm:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                     bg-red-600 text-white shadow-lg shadow-red-600/25"
        >
          <ActiveIcon size={14} />
          <span>{activeItem.label}</span>
          <ChevronDown size={12} className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>

        {mobileOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMobileOpen(false)} />
            <div className="absolute top-full left-0 mt-1.5 z-20 flex flex-col gap-1 min-w-[130px]
                            bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/60 shadow-xl p-1.5">
              {LAYERS.filter((l) => l.id !== activeLayer).map((layer) => {
                const Icon = layer.icon;
                return (
                  <button
                    key={layer.id}
                    onClick={() => {
                      if (layer.active) {
                        onLayerChange?.(layer.id);
                        setMobileOpen(false);
                      }
                    }}
                    disabled={!layer.active}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                      ${layer.active
                        ? 'text-slate-700 hover:bg-red-50 hover:text-red-600'
                        : 'text-slate-300 cursor-not-allowed'
                      }`}
                  >
                    <Icon size={13} />
                    <span>{layer.label}</span>
                    {!layer.active && <span className="ml-auto text-[9px] opacity-50">Soon</span>}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LayerPanel;
