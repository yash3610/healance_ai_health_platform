import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Footprints, Target, ArrowRight } from 'lucide-react';

const ACTIONS = [
  {
    key: 'symptoms',
    label: 'Run Symptoms Check',
    subtitle: 'See possible conditions',
    icon: Brain,
    iconClass: 'dash-icon-badge--gradient-rose',
    href: '/dashboard/risk-prediction',
  },
  {
    key: 'walk',
    label: 'Start Walking',
    subtitle: 'Earn coins per step',
    icon: Footprints,
    iconClass: 'dash-icon-badge--gradient-amber',
    href: '/404',
  },
  {
    key: 'goal',
    label: 'Add a Goal',
    subtitle: 'Track your daily habits',
    icon: Target,
    iconClass: 'dash-icon-badge--gradient-emerald',
    href: '/dashboard/reverse-planner',
  },
];

const QuickActionsBar = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.key}
            type="button"
            onClick={() => navigate(action.href)}
            className="dash-card dash-card-glow group flex items-center gap-3 text-left"
          >
            <div className={`dash-icon-badge ${action.iconClass}`}>
              <Icon size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0b1030] truncate">{action.label}</p>
              <p className="text-xs text-[#6a7283] truncate">{action.subtitle}</p>
            </div>
            <ArrowRight
              size={16}
              className="text-[#506cd7] opacity-60 group-hover:opacity-100 transition-transform group-hover:translate-x-0.5 flex-shrink-0"
            />
          </button>
        );
      })}
    </div>
  );
};

export default QuickActionsBar;
