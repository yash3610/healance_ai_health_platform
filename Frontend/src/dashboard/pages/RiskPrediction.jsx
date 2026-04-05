import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Star, MapPin, Calendar, CheckCircle, Utensils, Dumbbell } from 'lucide-react';
import Button from '../../shared/ui/Button';

const DoctorCard = ({ name, specialty, distance, rating, image }) => (
  <div className="dash-card flex items-center gap-4">
    <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />
    <div className="flex-1">
      <h4 className="font-bold text-[#0b1030]">{name}</h4>
      <p className="text-xs text-[#506cd7] font-medium">{specialty}</p>
      <div className="flex items-center gap-3 mt-1 text-xs text-[#5f697a]">
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
    <div className="space-y-6 sm:space-y-8">
      <div className="dash-card-static">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0b1030]">AI Health Risk Prediction</h2>
          <p className="text-sm sm:text-base text-[#5f697a]">Enter your vitals to get a comprehensive health analysis.</p>
        </div>

        <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-[#0b1030] mb-2">Age</label>
            <input type="number" className="dash-input" placeholder="25" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0b1030] mb-2">Gender</label>
            <select className="dash-input">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0b1030] mb-2">Blood Pressure</label>
            <input type="text" className="dash-input" placeholder="120/80" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0b1030] mb-2">Cholesterol Level</label>
            <input type="number" className="dash-input" placeholder="180" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0b1030] mb-2">Blood Sugar</label>
            <input type="number" className="dash-input" placeholder="90" />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={(e) => { e.preventDefault(); setShowResults(true); }}>
              Analyze Health Risk
            </Button>
          </div>
        </form>
      </div>

      {showResults && (
        <motion.div
          className="space-y-6 sm:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Results Summary */}
          <div className="bg-green-50 border border-green-100 p-4 sm:p-6 rounded-[20px] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="dash-icon-badge bg-green-500">
              <CheckCircle size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-green-800">Low Risk Detected</h3>
              <p className="text-sm sm:text-base text-green-700">Your vitals are within the healthy range. Keep up the good work!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Recommendations */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-[#0b1030]">Recommended Doctors</h3>
              <DoctorCard
                name="Dr. Emily White"
                specialty="Cardiologist"
                distance="2.5 km"
                rating="4.9"
                image="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200"
              />
              <DoctorCard
                name="Dr. Raj Patel"
                specialty="General Physician"
                distance="4.1 km"
                rating="4.7"
                image="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200"
              />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-[#0b1030]">Personalized Plans</h3>

              {/* Diet Plan */}
              <div className="dash-card-static">
                <div className="flex items-center gap-2 mb-4">
                  <div className="dash-icon-badge bg-orange-500">
                    <Utensils size={20} className="text-white" />
                  </div>
                  <h4 className="dash-heading text-sm sm:text-base">Indian Diet Plan</h4>
                </div>
                <ul className="space-y-3 text-sm text-[#5f697a]">
                  <li className="flex justify-between border-b border-[#f0f1fc] pb-2">
                    <span>Breakfast</span>
                    <span className="font-medium text-[#0b1030]">Oats Upma + Green Tea</span>
                  </li>
                  <li className="flex justify-between border-b border-[#f0f1fc] pb-2">
                    <span>Lunch</span>
                    <span className="font-medium text-[#0b1030]">2 Roti + Dal + Sabzi</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dinner</span>
                    <span className="font-medium text-[#0b1030]">Grilled Paneer Salad</span>
                  </li>
                </ul>
              </div>

              {/* Workout Plan */}
              <div className="dash-card-static">
                <div className="flex items-center gap-2 mb-4">
                  <div className="dash-icon-badge bg-blue-500">
                    <Dumbbell size={20} className="text-white" />
                  </div>
                  <h4 className="dash-heading text-sm sm:text-base">Weekly Workout</h4>
                </div>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                    <div key={day} className="min-w-[80px] bg-[#f0f1fc] p-3 rounded-xl text-center border border-[#e8eaf9]">
                      <p className="text-xs font-bold text-[#6a7283] mb-1">{day}</p>
                      <p className="text-sm font-bold text-[#506cd7]">Cardio</p>
                      <p className="text-[10px] text-[#5f697a]">30 mins</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RiskPrediction;
