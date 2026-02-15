import React, { useState } from 'react';
import { Activity, Star, MapPin, Calendar, CheckCircle, Utensils, Dumbbell } from 'lucide-react';
import Button from '../components/ui/Button';

const DoctorCard = ({ name, specialty, distance, rating, image }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
    <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />
    <div className="flex-1">
      <h4 className="font-bold text-slate-900">{name}</h4>
      <p className="text-xs text-primary-600 font-medium">{specialty}</p>
      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
        <span className="flex items-center"><MapPin size={12} className="mr-1" /> {distance}</span>
        <span className="flex items-center text-yellow-500"><Star size={12} className="mr-1 fill-current" /> {rating}</span>
      </div>
    </div>
    <Button size="sm" variant="secondary">Book</Button>
  </div>
);

const RiskPrediction = () => {
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">AI Health Risk Prediction</h2>
          <p className="text-slate-600">Enter your vitals to get a comprehensive health analysis.</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
            <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none" placeholder="25" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Blood Pressure</label>
            <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none" placeholder="120/80" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cholesterol Level</label>
            <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none" placeholder="180" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Blood Sugar</label>
            <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none" placeholder="90" />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={(e) => { e.preventDefault(); setShowResults(true); }}>
              Analyze Health Risk
            </Button>
          </div>
        </form>
      </div>

      {showResults && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Results Summary */}
          <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <CheckCircle size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800">Low Risk Detected</h3>
              <p className="text-green-700">Your vitals are within the healthy range. Keep up the good work!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recommendations */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Recommended Doctors</h3>
              <DoctorCard 
                name="Dr. Emily White" 
                specialty="Cardiologist" 
                distance="2.5 km" 
                rating="4.9" 
                image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
              />
              <DoctorCard 
                name="Dr. Raj Patel" 
                specialty="General Physician" 
                distance="4.1 km" 
                rating="4.7" 
                image="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Personalized Plans</h3>
              
              {/* Diet Plan */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Utensils size={20} className="text-orange-500" />
                  <h4 className="font-bold text-slate-800">Indian Diet Plan</h4>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span>Breakfast</span>
                    <span className="font-medium">Oats Upma + Green Tea</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span>Lunch</span>
                    <span className="font-medium">2 Roti + Dal + Sabzi</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dinner</span>
                    <span className="font-medium">Grilled Paneer Salad</span>
                  </li>
                </ul>
              </div>

              {/* Workout Plan */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Dumbbell size={20} className="text-blue-500" />
                  <h4 className="font-bold text-slate-800">Weekly Workout</h4>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                    <div key={day} className="min-w-[80px] bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 mb-1">{day}</p>
                      <p className="text-sm font-bold text-primary-600">Cardio</p>
                      <p className="text-[10px] text-slate-500">30 mins</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskPrediction;
