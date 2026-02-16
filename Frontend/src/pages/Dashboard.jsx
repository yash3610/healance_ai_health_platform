import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, Heart, TrendingUp, AlertCircle, Brain, Footprints, Droplets, Target, Coins, Calendar,
  Bell, BellRing, X, Plus, Minus, Volume2
} from 'lucide-react';
import Button from '../components/ui/Button';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const data = [
  { name: 'Mon', score: 65, heart: 72 },
  { name: 'Tue', score: 70, heart: 75 },
  { name: 'Wed', score: 68, heart: 71 },
  { name: 'Thu', score: 74, heart: 78 },
  { name: 'Fri', score: 78, heart: 74 },
  { name: 'Sat', score: 85, heart: 70 },
  { name: 'Sun', score: 82, heart: 72 },
];

const StatCard = ({ title, value, unit, change, icon: Icon, color, subtext, onAction, actionLabel }) => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
    <div className="flex justify-between items-start mb-3 sm:mb-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">{title}</p>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          {value} <span className="text-xs sm:text-sm font-normal text-slate-400">{unit}</span>
        </h3>
      </div>
      <div className={`p-2 sm:p-3 rounded-xl ${color} flex-shrink-0`}>
        <Icon size={18} className="text-white sm:w-5 sm:h-5" />
      </div>
    </div>
    {subtext ? (
      <div className="text-xs sm:text-sm text-slate-500">
        {subtext}
      </div>
    ) : (
      <div className="flex items-center text-xs sm:text-sm">
        <span className="text-green-500 font-medium flex items-center">
          <TrendingUp size={14} className="mr-1" /> {change}
        </span>
        <span className="text-slate-400 ml-2">vs last week</span>
      </div>
    )}
    {onAction && (
      <button 
        onClick={onAction}
        className="mt-3 w-full text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1 py-2 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
      >
        <Bell size={12} /> {actionLabel || 'Set Reminder'}
      </button>
    )}
  </div>
);

// Water Tracker Component
const WaterTracker = ({ waterIntake, setWaterIntake, onSetReminder, reminderActive }) => {
  const glasses = Math.floor(waterIntake * 4); // 1L = 4 glasses (250ml each)
  const target = 12; // 3L = 12 glasses
  const remaining = Math.max(target - glasses, 0);

  const addGlass = () => {
    setWaterIntake(prev => Math.min(prev + 0.25, 3));
  };

  const removeGlass = () => {
    setWaterIntake(prev => Math.max(prev - 0.25, 0));
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 sm:p-3 rounded-xl bg-blue-500">
            <Droplets size={18} className="text-white sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Water Intake</p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {waterIntake.toFixed(1)} <span className="text-xs sm:text-sm font-normal text-slate-400">/ 3 L</span>
            </h3>
          </div>
        </div>
        <button
          onClick={onSetReminder}
          className={`p-2 rounded-lg transition-colors ${
            reminderActive 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
          title={reminderActive ? 'Reminder Active' : 'Set Water Reminder'}
        >
          {reminderActive ? <BellRing size={18} /> : <Bell size={18} />}
        </button>
      </div>

      {/* Glass Visualization */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({ length: target }).map((_, i) => (
          <div 
            key={i}
            className={`w-6 h-8 rounded-md transition-all ${
              i < glasses ? 'bg-blue-500' : 'bg-slate-100'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {remaining > 0 ? `${remaining} glasses remaining` : '🎉 Goal reached!'}
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={removeGlass}
            disabled={waterIntake <= 0}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors"
          >
            <Minus size={16} className="text-slate-600" />
          </button>
          <button 
            onClick={addGlass}
            disabled={waterIntake >= 3}
            className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 disabled:opacity-50 transition-colors"
          >
            <Plus size={16} className="text-blue-600" />
          </button>
        </div>
      </div>

      {reminderActive && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg flex items-center gap-2 text-xs text-blue-700">
          <Volume2 size={14} />
          <span>Reminder every 30 minutes</span>
        </div>
      )}
    </div>
  );
};

// Water Reminder Modal
const WaterReminderModal = ({ isOpen, onClose, onSave, currentInterval }) => {
  const [interval, setInterval] = useState(currentInterval || 30);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Droplets className="text-blue-500" /> Water Reminder
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Set a reminder to drink water at regular intervals throughout the day.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Remind me every</label>
          <div className="flex items-center gap-3">
            <select
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => onSave(interval)}>
            <Bell size={16} className="mr-2" /> Set Reminder
          </Button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [waterIntake, setWaterIntake] = useState(1.2);
  const [waterReminderActive, setWaterReminderActive] = useState(false);
  const [waterReminderInterval, setWaterReminderInterval] = useState(30);
  const [isWaterReminderModalOpen, setIsWaterReminderModalOpen] = useState(false);
  const [waterReminderTimerId, setWaterReminderTimerId] = useState(null);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  // Show browser notification
  const showBrowserNotification = useCallback((title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200]
      });
    }
  }, []);

  // Create notification
  const createNotification = async (title, message, type = 'reminder') => {
    try {
      const token = localStorage.getItem('healance_token');
      await axios.post(`${API_URL}/notifications`, 
        { title, message, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to create notification');
    }
  };

  // Start water reminder
  const startWaterReminder = (intervalMinutes) => {
    // Clear existing timer
    if (waterReminderTimerId) {
      clearInterval(waterReminderTimerId);
    }

    setWaterReminderInterval(intervalMinutes);
    setWaterReminderActive(true);
    setIsWaterReminderModalOpen(false);

    // Create initial notification in DB
    createNotification(
      '💧 Water Reminder Set',
      `You'll be reminded to drink water every ${intervalMinutes} minutes`,
      'reminder'
    );

    // Set up interval for reminders
    const timerId = setInterval(() => {
      createNotification(
        '💧 Time to Hydrate!',
        'Drink a glass of water to stay healthy and focused.',
        'reminder'
      );
      showBrowserNotification('💧 Water Reminder', 'Time to drink water!');
    }, intervalMinutes * 60 * 1000);

    setWaterReminderTimerId(timerId);

    // Store in localStorage
    localStorage.setItem('waterReminderActive', 'true');
    localStorage.setItem('waterReminderInterval', String(intervalMinutes));
  };

  // Stop water reminder
  const stopWaterReminder = () => {
    if (waterReminderTimerId) {
      clearInterval(waterReminderTimerId);
    }
    setWaterReminderActive(false);
    setWaterReminderTimerId(null);
    localStorage.removeItem('waterReminderActive');
    localStorage.removeItem('waterReminderInterval');
  };

  // Handle water tracker update with notification
  useEffect(() => {
    const glasses = Math.floor(waterIntake * 4);
    const milestones = [4, 8, 12]; // 1L, 2L, 3L
    
    milestones.forEach(milestone => {
      if (glasses === milestone) {
        const liters = milestone / 4;
        createNotification(
          '🎉 Water Goal Progress!',
          `Great job! You've reached ${liters}L of water intake today.`,
          'achievement'
        );
        showBrowserNotification('🎉 Water Goal', `You've drunk ${liters}L today!`);
      }
    });
  }, [waterIntake]);

  // Initialize on mount
  useEffect(() => {
    requestNotificationPermission();

    // Restore water reminder state
    const savedReminderActive = localStorage.getItem('waterReminderActive');
    const savedInterval = localStorage.getItem('waterReminderInterval');
    if (savedReminderActive === 'true' && savedInterval) {
      startWaterReminder(Number(savedInterval));
    }

    // Cleanup on unmount
    return () => {
      if (waterReminderTimerId) {
        clearInterval(waterReminderTimerId);
      }
    };
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard 
          title="Daily Steps" 
          value="6,240" 
          unit="/ 10k" 
          change="+12%" 
          icon={Footprints} 
          color="bg-orange-500" 
          subtext="62% of daily goal"
        />
        <WaterTracker 
          waterIntake={waterIntake}
          setWaterIntake={setWaterIntake}
          onSetReminder={() => waterReminderActive ? stopWaterReminder() : setIsWaterReminderModalOpen(true)}
          reminderActive={waterReminderActive}
        />
        <StatCard 
          title="Active Goals" 
          value="3" 
          unit="ongoing" 
          icon={Target} 
          color="bg-purple-500" 
          subtext="Weight loss on track"
        />
        <StatCard 
          title="Walk & Earn" 
          value="450" 
          unit="coins" 
          icon={Coins} 
          color="bg-yellow-500" 
          subtext="Redeemable for coupons"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Weekly Health Trends</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 text-slate-600 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Calendar & Reminders */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Calendar size={20} className="text-primary-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Today's Schedule</h3>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-start gap-3 pb-4 border-b border-slate-50">
              <div className="flex flex-col items-center min-w-[3rem]">
                <span className="text-xs font-bold text-slate-400">08:00</span>
                <span className="text-xs text-slate-400">AM</span>
              </div>
              <div className="bg-green-50 p-3 rounded-xl w-full border-l-4 border-green-500">
                <h4 className="text-sm font-bold text-slate-800">Morning Medication</h4>
                <p className="text-xs text-slate-600">Vitamin D & Calcium</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-slate-50">
              <div className="flex flex-col items-center min-w-[3rem]">
                <span className="text-xs font-bold text-slate-400">05:30</span>
                <span className="text-xs text-slate-400">PM</span>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl w-full border-l-4 border-blue-500">
                <h4 className="text-sm font-bold text-slate-800">Evening Walk</h4>
                <p className="text-xs text-slate-600">Goal: 30 minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center min-w-[3rem]">
                <span className="text-xs font-bold text-slate-400">09:00</span>
                <span className="text-xs text-slate-400">PM</span>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl w-full border-l-4 border-purple-500">
                <h4 className="text-sm font-bold text-slate-800">Sleep Routine</h4>
                <p className="text-xs text-slate-600">No screen time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Summary & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-lg">
                <Activity size={20} className="text-red-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">Latest Risk Prediction</h3>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Low Risk</span>
          </div>
          
          <div className="space-y-4">
             <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
               <span className="text-sm text-slate-600">Heart Disease Risk</span>
               <span className="font-bold text-slate-800">12%</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
               <span className="text-sm text-slate-600">Diabetes Probability</span>
               <span className="font-bold text-slate-800">5%</span>
             </div>
             <div className="mt-4 pt-4 border-t border-slate-100">
               <p className="text-sm text-slate-500">
                 Based on your latest vitals, your health metrics are stable. Continue your current workout routine.
               </p>
             </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Brain size={20} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-800">AI Insights</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                  <Activity size={14} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Activity Recommendation</h4>
                  <p className="text-xs text-slate-600 mt-1">Try to increase your daily steps by 2000 to improve cardiovascular health.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-1.5 rounded-full mt-0.5">
                  <AlertCircle size={14} className="text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Sleep Pattern</h4>
                  <p className="text-xs text-slate-600 mt-1">Your average sleep duration is 6h 20m. Aim for 7-8 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Reminder Modal */}
      <WaterReminderModal
        isOpen={isWaterReminderModalOpen}
        onClose={() => setIsWaterReminderModalOpen(false)}
        onSave={startWaterReminder}
        currentInterval={waterReminderInterval}
      />
    </div>
  );
};

export default Dashboard;
