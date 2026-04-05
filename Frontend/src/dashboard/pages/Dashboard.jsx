import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Activity, Heart, TrendingUp, AlertCircle, Brain, Footprints, Droplets, Target, Coins, Calendar,
  Bell, BellRing, X, Plus, Minus, Volume2, CheckCircle
} from 'lucide-react';
import Button from '../../shared/ui/Button';
import { SkeletonCard, SkeletonChart, SkeletonSchedule, SkeletonRiskCard } from '../../shared/ui/Skeleton';
import EmptyState from '../../shared/ui/EmptyState';
import axios from 'axios';
import { useHealthData } from '../../context/HealthDataContext';

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
  <div className="dash-card h-full">
    <div className="flex justify-between items-start mb-3 sm:mb-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-[#5f697a] truncate">{title}</p>
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#0b1030] mt-1">
          {value} <span className="text-xs sm:text-sm font-normal text-[#6a7283]">{unit}</span>
        </h3>
      </div>
      <div className={`dash-icon-badge ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    {subtext ? (
      <div className="text-xs sm:text-sm text-[#5f697a]">
        {subtext}
      </div>
    ) : (
      <div className="flex items-center text-xs sm:text-sm">
        <span className="text-green-500 font-medium flex items-center">
          <TrendingUp size={14} className="mr-1" /> {change}
        </span>
        <span className="text-[#6a7283] ml-2">vs last week</span>
      </div>
    )}
    {onAction && (
      <button
        onClick={onAction}
        className="mt-3 w-full text-xs font-medium text-[#506cd7] hover:text-[#4753bf] flex items-center justify-center gap-1 py-2 bg-[#f0f1fc] hover:bg-[#e8eaf9] rounded-lg transition-colors"
      >
        <Bell size={12} /> {actionLabel || 'Set Reminder'}
      </button>
    )}
  </div>
);

// Water Tracker Component
const WaterTracker = ({ onSetReminder, reminderActive }) => {
  const { waterIntake, addWater, removeWater, updateGoalProgress, activeGoals } = useHealthData();
  const glasses = Math.floor(waterIntake * 4); // 1L = 4 glasses (250ml each)
  const target = 12; // 3L = 12 glasses
  const remaining = Math.max(target - glasses, 0);

  // Find water goal to get actual ID
  const waterGoal = activeGoals.find(g => g.type === 'water');

  const handleAddGlass = async () => {
    const newValue = Math.min(waterIntake + 0.25, 3);
    addWater();
    
    // Update backend if water goal exists
    if (waterGoal) {
      await updateGoalProgress('water', newValue);
    }
  };

  const handleRemoveGlass = async () => {
    const newValue = Math.max(waterIntake - 0.25, 0);
    removeWater();
    
    // Update backend if water goal exists
    if (waterGoal) {
      await updateGoalProgress('water', newValue);
    }
  };

  return (
    <div className="dash-card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="dash-icon-badge bg-blue-500">
            <Droplets size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-[#5f697a]">Water Intake</p>
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#0b1030]">
              {waterIntake.toFixed(1)} <span className="text-xs sm:text-sm font-normal text-[#6a7283]">/ 3 L</span>
            </h3>
          </div>
        </div>
        <button
          onClick={onSetReminder}
          className={`p-2 rounded-lg transition-colors ${
            reminderActive
              ? 'bg-blue-100 text-blue-600'
              : 'bg-[#f0f1fc] hover:bg-[#e8eaf9] text-[#5f697a]'
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
              i < glasses ? 'bg-blue-500' : 'bg-[#f0f1fc]'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#5f697a]">
          {remaining > 0 ? `${remaining} glasses remaining` : '🎉 Goal reached!'}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRemoveGlass}
            disabled={waterIntake <= 0}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-[#f0f1fc] hover:bg-[#e8eaf9] disabled:opacity-50 transition-colors"
            aria-label="Remove one glass of water"
          >
            <Minus size={16} className="text-[#5f697a]" />
          </button>
          <button
            onClick={handleAddGlass}
            disabled={waterIntake >= 3}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-blue-100 hover:bg-blue-200 disabled:opacity-50 transition-colors"
            aria-label="Add one glass of water"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1030]/50 backdrop-blur-sm">
      <div className="bg-white rounded-[20px] w-full max-w-sm p-6" style={{ boxShadow: '0 22px 38px rgba(11, 16, 48, 0.11)' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-heading font-bold text-[#0b1030] flex items-center gap-2">
            <Droplets className="text-blue-500" /> Water Reminder
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-[#f0f1fc] rounded-lg">
            <X size={20} className="text-[#5f697a]" />
          </button>
        </div>

        <p className="text-sm text-[#5f697a] mb-4">
          Set a reminder to drink water at regular intervals throughout the day.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-[#0b1030] mb-2">Remind me every</label>
          <div className="flex items-center gap-3">
            <select
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="dash-input flex-1"
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
  const { dailySteps, stepsGoal, goalsCount, coins, waterIntake, fetchHealthData, isInitialLoad } = useHealthData();
  
  const [waterReminderActive, setWaterReminderActive] = useState(false);
  const [waterReminderInterval, setWaterReminderInterval] = useState(30);
  const [isWaterReminderModalOpen, setIsWaterReminderModalOpen] = useState(false);
  const [waterReminderTimerId, setWaterReminderTimerId] = useState(null);

  // Calculate steps progress
  const stepsProgress = Math.round((dailySteps / stepsGoal) * 100);
  const stepsFormatted = dailySteps.toLocaleString();
  const stepsGoalFormatted = (stepsGoal / 1000).toFixed(0) + 'k';

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
    fetchHealthData();

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
      {isInitialLoad ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          <StatCard
            key="steps"
            title="Daily Steps"
            value={stepsFormatted}
            unit={`/ ${stepsGoalFormatted}`}
            change="+12%"
            icon={Footprints}
            color="bg-orange-500"
            subtext={`${stepsProgress}% of daily goal`}
          />,
          <WaterTracker
            key="water"
            onSetReminder={() => waterReminderActive ? stopWaterReminder() : setIsWaterReminderModalOpen(true)}
            reminderActive={waterReminderActive}
          />,
          <StatCard
            key="goals"
            title="Active Goals"
            value={goalsCount.toString()}
            unit="ongoing"
            icon={Target}
            color="bg-purple-500"
            subtext="Track your progress"
          />,
          <StatCard
            key="coins"
            title="Walk & Earn"
            value={coins.toString()}
            unit="coins"
            icon={Coins}
            color="bg-yellow-500"
            subtext="Redeemable for coupons"
          />
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            {card}
          </motion.div>
        ))}
      </div>
      )}

      {isInitialLoad ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <SkeletonChart />
          <SkeletonSchedule />
        </div>
      ) : (
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        {/* Main Chart */}
        <div className="lg:col-span-2 dash-card-static">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h3 className="dash-heading text-sm sm:text-base">Weekly Health Trends</h3>
            <select className="text-sm border-none bg-[#f0f1fc] rounded-lg px-3 py-1 text-[#5f697a] focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
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
                  contentStyle={{ borderRadius: '16px', border: '1px solid rgba(80, 108, 215, 0.12)', boxShadow: '0 10px 35px rgba(2, 6, 23, 0.08)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Calendar & Reminders */}
        <div className="dash-card-static flex flex-col">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="dash-icon-badge bg-[#506cd7]">
              <Calendar size={20} className="text-white" />
            </div>
            <h3 className="dash-heading text-sm sm:text-base">Today's Schedule</h3>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-start gap-3 pb-4 border-b border-[#f0f1fc]">
              <div className="flex flex-col items-center min-w-[3rem]">
                <span className="text-xs font-bold text-[#6a7283]">08:00</span>
                <span className="text-xs text-[#6a7283]">AM</span>
              </div>
              <div className="bg-green-50 p-3 rounded-xl w-full border-l-4 border-green-500">
                <h4 className="text-sm font-bold text-[#0b1030]">Morning Medication</h4>
                <p className="text-xs text-[#5f697a]">Vitamin D & Calcium</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-[#f0f1fc]">
              <div className="flex flex-col items-center min-w-[3rem]">
                <span className="text-xs font-bold text-[#6a7283]">05:30</span>
                <span className="text-xs text-[#6a7283]">PM</span>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl w-full border-l-4 border-blue-500">
                <h4 className="text-sm font-bold text-[#0b1030]">Evening Walk</h4>
                <p className="text-xs text-[#5f697a]">Goal: 30 minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center min-w-[3rem]">
                <span className="text-xs font-bold text-[#6a7283]">09:00</span>
                <span className="text-xs text-[#6a7283]">PM</span>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl w-full border-l-4 border-purple-500">
                <h4 className="text-sm font-bold text-[#0b1030]">Sleep Routine</h4>
                <p className="text-xs text-[#5f697a]">No screen time</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      )}

      {/* Risk Summary & Insights */}
      {isInitialLoad ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <SkeletonRiskCard />
          <SkeletonRiskCard />
        </div>
      ) : (
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="dash-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <div className="dash-icon-badge bg-red-500">
                <Activity size={20} className="text-white" />
              </div>
              <h3 className="dash-heading text-sm sm:text-base">Latest Risk Prediction</h3>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full inline-flex items-center gap-1"><CheckCircle size={12} /> Low Risk</span>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center p-3 bg-[#f0f1fc] rounded-xl">
               <span className="text-sm text-[#5f697a]">Heart Disease Risk</span>
               <span className="font-bold text-[#0b1030]">12%</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-[#f0f1fc] rounded-xl">
               <span className="text-sm text-[#5f697a]">Diabetes Probability</span>
               <span className="font-bold text-[#0b1030]">5%</span>
             </div>
             <div className="mt-4 pt-4 border-t border-[#e8eaf9]">
               <p className="text-sm text-[#5f697a]">
                 Based on your latest vitals, your health metrics are stable. Continue your current workout routine.
               </p>
             </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="dash-icon-badge bg-[#506cd7]">
              <Brain size={20} className="text-white" />
            </div>
            <h3 className="dash-heading text-sm sm:text-base">AI Insights</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                  <Activity size={14} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0b1030]">Activity Recommendation</h4>
                  <p className="text-xs text-[#5f697a] mt-1">Try to increase your daily steps by 2000 to improve cardiovascular health.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-1.5 rounded-full mt-0.5">
                  <AlertCircle size={14} className="text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0b1030]">Sleep Pattern</h4>
                  <p className="text-xs text-[#5f697a] mt-1">Your average sleep duration is 6h 20m. Aim for 7-8 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      )}

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
