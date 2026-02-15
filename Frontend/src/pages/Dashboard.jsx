import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, Heart, TrendingUp, AlertCircle, Brain, Footprints, Droplets, Target, Coins, Calendar
} from 'lucide-react';
import Button from '../components/ui/Button';

const data = [
  { name: 'Mon', score: 65, heart: 72 },
  { name: 'Tue', score: 70, heart: 75 },
  { name: 'Wed', score: 68, heart: 71 },
  { name: 'Thu', score: 74, heart: 78 },
  { name: 'Fri', score: 78, heart: 74 },
  { name: 'Sat', score: 85, heart: 70 },
  { name: 'Sun', score: 82, heart: 72 },
];

const StatCard = ({ title, value, unit, change, icon: Icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">
          {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    {subtext ? (
      <div className="text-sm text-slate-500">
        {subtext}
      </div>
    ) : (
      <div className="flex items-center text-sm">
        <span className="text-green-500 font-medium flex items-center">
          <TrendingUp size={14} className="mr-1" /> {change}
        </span>
        <span className="text-slate-400 ml-2">vs last week</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Steps" 
          value="6,240" 
          unit="/ 10k" 
          change="+12%" 
          icon={Footprints} 
          color="bg-orange-500" 
          subtext="62% of daily goal"
        />
        <StatCard 
          title="Water Intake" 
          value="1.2" 
          unit="L" 
          change="-5%" 
          icon={Droplets} 
          color="bg-blue-500" 
          subtext="4 glasses remaining"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Weekly Health Trends</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 text-slate-600 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-80">
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Calendar size={20} className="text-primary-600" />
            </div>
            <h3 className="font-bold text-slate-800">Today's Schedule</h3>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-lg">
                <Activity size={20} className="text-red-600" />
              </div>
              <h3 className="font-bold text-slate-800">Latest Risk Prediction</h3>
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

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
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
    </div>
  );
};

export default Dashboard;
