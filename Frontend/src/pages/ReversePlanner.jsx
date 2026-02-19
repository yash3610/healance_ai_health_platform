import React, { useState, useEffect } from 'react';
import { Target, Droplets, Flame, Moon, Footprints, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, Loader2, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useHealthData } from '../context/HealthDataContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const goalIcons = {
  steps: Footprints,
  water: Droplets,
  calories: Flame,
  sleep: Moon,
  weight: Target,
  custom: Target
};

const goalColors = {
  steps: 'bg-orange-500',
  water: 'bg-blue-500',
  calories: 'bg-red-500',
  sleep: 'bg-purple-500',
  weight: 'bg-green-500',
  custom: 'bg-primary-500'
};

const defaultGoalUnits = {
  steps: 'steps',
  water: 'L',
  calories: 'kcal',
  sleep: 'hrs',
  weight: 'kg',
  custom: ''
};

const GoalCard = ({ goal, onEdit, onDelete, onLogProgress }) => {
  const Icon = goalIcons[goal.type] || Target;
  const color = goalColors[goal.type] || 'bg-primary-500';
  const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);
  const remaining = Math.max(goal.target - goal.current, 0);
  const daysLeft = goal.endDate ? Math.ceil((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 7;
  const dailyNeeded = daysLeft > 0 ? Math.round(remaining / daysLeft) : 0;

  return (
    <div className="bg-white p-3 sm:p-6 rounded-2xl shadow-sm border border-slate-100 relative group">
      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(goal)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
          <Edit2 size={14} className="text-slate-500" />
        </button>
        <button onClick={() => onDelete(goal._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 size={14} className="text-red-500" />
        </button>
      </div>

      <div className="flex justify-between items-start mb-2 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon size={18} className={`sm:w-6 sm:h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg ${
          progress >= 100 ? 'bg-green-100 text-green-600' : 
          progress >= 50 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
        }`}>
          {progress}%
        </span>
      </div>
      
      <h3 className="font-bold text-sm sm:text-base text-slate-800 mb-1">{goal.title}</h3>
      <div className="flex items-end gap-1 mb-2 sm:mb-3">
        <span className="text-lg sm:text-2xl font-bold text-slate-900">{goal.current}</span>
        <span className="text-[10px] sm:text-sm text-slate-500 mb-0.5 sm:mb-1">/ {goal.target} {goal.unit}</span>
      </div>
      
      <div className="w-full bg-slate-100 h-1.5 sm:h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${color}`} 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-2 sm:mt-3">
        <p className="text-[8px] sm:text-xs text-slate-500 flex items-center">
          <Target size={10} className="mr-1 flex-shrink-0 sm:w-3 sm:h-3" /> 
          {dailyNeeded > 0 ? `${dailyNeeded} ${goal.unit}/day needed` : 'Goal reached!'}
        </p>
        <button 
          onClick={() => onLogProgress(goal)}
          className="text-[10px] sm:text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          + Log
        </button>
      </div>
    </div>
  );
};

// Goal Modal Component
const GoalModal = ({ isOpen, onClose, goal, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    type: 'steps',
    title: '',
    current: 0,
    target: 10000,
    unit: 'steps',
    endDate: ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        type: goal.type,
        title: goal.title,
        current: goal.current,
        target: goal.target,
        unit: goal.unit,
        endDate: goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        type: 'steps',
        title: 'Daily Steps',
        current: 0,
        target: 10000,
        unit: 'steps',
        endDate: ''
      });
    }
  }, [goal, isOpen]);

  const handleTypeChange = (type) => {
    const titles = {
      steps: 'Daily Steps',
      water: 'Water Intake',
      calories: 'Calories Burned',
      sleep: 'Sleep Duration',
      weight: 'Target Weight',
      custom: ''
    };
    const targets = {
      steps: 10000,
      water: 3,
      calories: 2200,
      sleep: 8,
      weight: 70,
      custom: 100
    };
    setFormData({
      ...formData,
      type,
      title: goal ? formData.title : titles[type],
      target: goal ? formData.target : targets[type],
      unit: defaultGoalUnits[type]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, goal?._id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">
            {goal ? 'Edit Goal' : 'Create New Goal'}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Goal Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Goal Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['steps', 'water', 'calories', 'sleep', 'weight', 'custom'].map((type) => {
                const Icon = goalIcons[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                      formData.type === type 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon size={20} className={formData.type === type ? 'text-primary-600' : 'text-slate-500'} />
                    <span className="text-xs capitalize">{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Goal Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
              placeholder="Enter goal title"
              required
            />
          </div>

          {/* Current & Target */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current</label>
              <input
                type="number"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target</label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                min="1"
                step="0.1"
                required
              />
            </div>
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Unit</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
              placeholder="e.g., steps, L, kcal"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Target Date (Optional)</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 size={18} className="mr-2 animate-spin" /> Saving...</>
            ) : (
              <>{goal ? 'Update Goal' : 'Create Goal'}</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

// Log Progress Modal
const LogProgressModal = ({ isOpen, onClose, goal, onSave, isLoading }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (goal) setValue(goal.current);
  }, [goal, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(goal._id, value);
  };

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Log Progress</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{goal.title}</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-center"
                step="0.1"
                required
              />
              <span className="text-slate-500 font-medium">{goal.unit}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Target: {goal.target} {goal.unit}
            </p>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex gap-2 justify-center">
            {[10, 50, 100, 500].map((increment) => (
              <button
                key={increment}
                type="button"
                onClick={() => setValue(prev => prev + increment)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
              >
                +{increment}
              </button>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 size={18} className="mr-2 animate-spin" /> Saving...</>
            ) : (
              'Save Progress'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

const ReversePlanner = () => {
  const { fetchHealthData } = useHealthData();
  
  const [goals, setGoals] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Fetch goals
  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('healance_token');
      const response = await axios.get(`${API_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setGoals(response.data.goals);
      }
    } catch (err) {
      setError('Failed to load goals');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch AI suggestions
  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('healance_token');
      const response = await axios.get(`${API_URL}/goals/suggestions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSuggestions(response.data.suggestions);
      }
    } catch (err) {
      // Generate default suggestions based on goals
      generateLocalSuggestions();
    }
  };

  // Generate suggestions locally if API fails
  const generateLocalSuggestions = () => {
    const localSuggestions = [];
    goals.forEach(goal => {
      const progress = (goal.current / goal.target) * 100;
      if (progress < 50) {
        localSuggestions.push({
          text: `Increase your ${goal.title.toLowerCase()} by ${Math.round((goal.target - goal.current) / 2)} ${goal.unit}`,
          priority: 'high'
        });
      } else if (progress < 80) {
        localSuggestions.push({
          text: `You're close! ${Math.round(goal.target - goal.current)} ${goal.unit} more to reach your ${goal.title.toLowerCase()} goal`,
          priority: 'medium'
        });
      }
    });
    
    if (localSuggestions.length === 0) {
      localSuggestions.push(
        { text: 'Great progress! Keep maintaining your current routine', priority: 'low' },
        { text: 'Consider setting a new challenging goal', priority: 'low' }
      );
    }
    
    setSuggestions(localSuggestions.slice(0, 4));
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (goals.length > 0) {
      fetchSuggestions();
    }
  }, [goals]);

  // Create/Update goal
  const handleSaveGoal = async (data, goalId) => {
    setIsSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('healance_token');
      let response;
      
      if (goalId) {
        response = await axios.put(`${API_URL}/goals/${goalId}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post(`${API_URL}/goals`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      if (response.data.success) {
        setSuccess(goalId ? 'Goal updated successfully!' : 'Goal created successfully!');
        fetchGoals();
        fetchHealthData(); // Sync with global health data
        setIsGoalModalOpen(false);
        setSelectedGoal(null);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete goal
  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const token = localStorage.getItem('healance_token');
      await axios.delete(`${API_URL}/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Goal deleted successfully!');
      fetchGoals();
      fetchHealthData(); // Sync with global health data
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete goal');
    }
  };

  // Log progress
  const handleLogProgress = async (goalId, value) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('healance_token');
      const response = await axios.post(`${API_URL}/goals/${goalId}/progress`, 
        { value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setSuccess('Progress logged successfully!');
        fetchGoals();
        fetchHealthData(); // Sync with global health data
        setIsLogModalOpen(false);
        setSelectedGoal(null);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to log progress');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate weekly data for chart
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    // Create ordered days starting from today - 6
    const orderedDays = [];
    for (let i = 6; i >= 0; i--) {
      orderedDays.push(days[(today - i + 7) % 7]);
    }
    
    // Calculate average progress for each day
    return orderedDays.map(day => {
      let totalProgress = 0;
      let count = 0;
      
      goals.forEach(goal => {
        const dayData = goal.weeklyProgress?.find(p => p.day === day);
        if (dayData) {
          totalProgress += (dayData.value / goal.target) * 100;
          count++;
        } else if (day === days[today]) {
          // Today's progress
          totalProgress += (goal.current / goal.target) * 100;
          count++;
        }
      });
      
      return {
        name: day,
        progress: count > 0 ? Math.min(Math.round(totalProgress / count), 100) : 0
      };
    });
  };

  // Calculate estimated completion
  const getEstimatedCompletion = () => {
    if (goals.length === 0) return null;
    
    const activeGoals = goals.filter(g => !g.isCompleted);
    if (activeGoals.length === 0) return { date: 'Completed!', progress: 100 };
    
    let totalProgress = 0;
    let avgDailyProgress = 0;
    
    activeGoals.forEach(goal => {
      totalProgress += (goal.current / goal.target) * 100;
      // Estimate daily progress based on current/days since start
      const daysSinceStart = Math.max(1, Math.ceil((new Date() - new Date(goal.startDate)) / (1000 * 60 * 60 * 24)));
      avgDailyProgress += (goal.current / daysSinceStart) / goal.target * 100;
    });
    
    totalProgress = Math.round(totalProgress / activeGoals.length);
    avgDailyProgress = avgDailyProgress / activeGoals.length;
    
    if (avgDailyProgress <= 0) avgDailyProgress = 1;
    
    const daysToComplete = Math.ceil((100 - totalProgress) / avgDailyProgress);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysToComplete);
    
    return {
      date: completionDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      progress: totalProgress
    };
  };

  const weeklyData = getWeeklyData();
  const estimatedCompletion = getEstimatedCompletion();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={40} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Reverse Health Planner</h2>
          <p className="text-sm sm:text-base text-slate-600">Set your goals and let AI guide you backwards to achieve them.</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => { setSelectedGoal(null); setIsGoalModalOpen(true); }}>
          <Plus size={18} className="mr-2" /> Add Goal
        </Button>
      </div>

      {/* Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle size={20} className="text-green-500" />
          <p className="text-green-700">{success}</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500" />
          <p className="text-red-700">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X size={18} className="text-red-500" />
          </button>
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
          <Target size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">No goals yet</h3>
          <p className="text-slate-500 mb-4">Create your first health goal to start tracking your progress.</p>
          <Button onClick={() => setIsGoalModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Create First Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {goals.map(goal => (
            <GoalCard 
              key={goal._id}
              goal={goal}
              onEdit={(g) => { setSelectedGoal(g); setIsGoalModalOpen(true); }}
              onDelete={handleDeleteGoal}
              onLogProgress={(g) => { setSelectedGoal(g); setIsLogModalOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* Charts & Suggestions */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Weekly Chart */}
          <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <TrendingUp size={18} className="text-primary-500" />
              <h3 className="font-bold text-sm sm:text-base text-slate-800">Weekly Goal Completion</h3>
            </div>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%" minHeight={192}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => [`${value}%`, 'Progress']}
                  />
                  <Bar dataKey="progress" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="font-bold text-sm sm:text-base text-slate-800">AI Suggestions</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle size={16} className={
                      suggestion.priority === 'high' ? 'text-red-500' :
                      suggestion.priority === 'medium' ? 'text-amber-500' : 'text-green-500'
                    } />
                  </div>
                  <p className="text-sm text-slate-700">{suggestion.text}</p>
                </div>
              ))}
              
              {suggestions.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  Complete some progress to get personalized suggestions!
                </p>
              )}
            </div>
            
            {/* Estimated Completion */}
            {estimatedCompletion && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-slate-500" />
                  <span className="text-sm text-slate-600">Estimated Completion</span>
                </div>
                <span className="text-lg font-bold text-primary-600">{estimatedCompletion.date}</span>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-3">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${estimatedCompletion.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Overall progress: {estimatedCompletion.progress}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => { setIsGoalModalOpen(false); setSelectedGoal(null); }}
        goal={selectedGoal}
        onSave={handleSaveGoal}
        isLoading={isSaving}
      />

      <LogProgressModal
        isOpen={isLogModalOpen}
        onClose={() => { setIsLogModalOpen(false); setSelectedGoal(null); }}
        goal={selectedGoal}
        onSave={handleLogProgress}
        isLoading={isSaving}
      />
    </div>
  );
};

export default ReversePlanner;
