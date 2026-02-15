import React, { useState } from 'react';
import { Target, Droplets, Flame, Moon, Footprints, ChevronRight, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { name: 'Mon', progress: 80 },
  { name: 'Tue', progress: 65 },
  { name: 'Wed', progress: 90 },
  { name: 'Thu', progress: 75 },
  { name: 'Fri', progress: 85 },
  { name: 'Sat', progress: 50 },
  { name: 'Sun', progress: 70 },
];

const GoalCard = ({ icon: Icon, title, current, target, unit, color, progress }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={24} />
      </div>
      <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
        {Math.round(progress)}%
      </span>
    </div>
    <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
    <div className="flex items-end gap-1 mb-3">
      <span className="text-2xl font-bold text-slate-900">{current}</span>
      <span className="text-sm text-slate-500 mb-1">/ {target} {unit}</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${color.replace('text', 'bg').replace('bg-opacity-10', '')}`} 
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-xs text-slate-500 mt-3 flex items-center">
      <Target size={12} className="mr-1" /> Daily target needed: {Math.round((target - current) / 7)} {unit}/day
    </p>
  </div>
);

const ReversePlanner = () => {
  const [goals, setGoals] = useState({
    steps: { current: 6500, target: 10000 },
    water: { current: 1.5, target: 3 },
    calories: { current: 1200, target: 2200 },
    sleep: { current: 6.5, target: 8 }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reverse Health Planner</h2>
          <p className="text-slate-600">Set your goals and let AI guide you backwards to achieve them.</p>
        </div>
        <Button>
          <Target size={18} className="mr-2" /> Update Goals
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GoalCard 
          icon={Footprints} 
          title="Daily Steps" 
          current={goals.steps.current} 
          target={goals.steps.target} 
          unit="steps" 
          color="bg-orange-500" 
          progress={(goals.steps.current / goals.steps.target) * 100} 
        />
        <GoalCard 
          icon={Droplets} 
          title="Water Intake" 
          current={goals.water.current} 
          target={goals.water.target} 
          unit="L" 
          color="bg-blue-500" 
          progress={(goals.water.current / goals.water.target) * 100} 
        />
        <GoalCard 
          icon={Flame} 
          title="Calories Burned" 
          current={goals.calories.current} 
          target={goals.calories.target} 
          unit="kcal" 
          color="bg-red-500" 
          progress={(goals.calories.current / goals.calories.target) * 100} 
        />
        <GoalCard 
          icon={Moon} 
          title="Sleep Duration" 
          current={goals.sleep.current} 
          target={goals.sleep.target} 
          unit="hrs" 
          color="bg-purple-500" 
          progress={(goals.sleep.current / goals.sleep.target) * 100} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Weekly Goal Completion</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="progress" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">AI Suggestions</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1">
                <CheckCircle size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Increase water intake by 500ml</p>
                <p className="text-xs text-slate-500">Based on your activity level today.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <CheckCircle size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Walk 2000 more steps</p>
                <p className="text-xs text-slate-500">To reach your weekly average.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <CheckCircle size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Sleep by 10:30 PM</p>
                <p className="text-xs text-slate-500">To ensure 8 hours of rest.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Estimated Goal Completion</span>
              <span className="text-sm font-bold text-primary-600">Oct 24, 2023</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full">
              <div className="bg-green-500 h-2 rounded-full w-[75%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReversePlanner;
