import React from 'react';
import { CloudSun, Wind, Droplets, Thermometer } from 'lucide-react';

const Forecast = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Health Weather Forecast</h2>
            <p className="text-sm sm:text-base text-blue-100">Plan your outdoor activities based on air quality and weather.</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl sm:text-4xl font-bold">24°C</p>
            <p className="text-blue-100">Sunny</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 text-blue-100 text-xs sm:text-sm">
              <Wind size={16} className="flex-shrink-0" /> Air Quality
            </div>
            <p className="text-lg sm:text-xl font-bold">Good (45)</p>
            <p className="text-[10px] sm:text-xs text-blue-200">Safe for outdoor run</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 text-blue-100 text-xs sm:text-sm">
              <Droplets size={16} className="flex-shrink-0" /> Humidity
            </div>
            <p className="text-lg sm:text-xl font-bold">65%</p>
            <p className="text-[10px] sm:text-xs text-blue-200">Stay hydrated</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 text-blue-100 text-xs sm:text-sm">
              <CloudSun size={16} className="flex-shrink-0" /> UV Index
            </div>
            <p className="text-lg sm:text-xl font-bold">Moderate (4)</p>
            <p className="text-[10px] sm:text-xs text-blue-200">Wear sunscreen</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 text-blue-100 text-xs sm:text-sm">
              <Thermometer size={16} className="flex-shrink-0" /> Pollen
            </div>
            <p className="text-lg sm:text-xl font-bold">Low</p>
            <p className="text-[10px] sm:text-xs text-blue-200">No allergies detected</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 text-sm sm:text-base">Activity Suitability</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
            <span className="font-medium text-slate-800">Morning Run</span>
            <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">Excellent</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <span className="font-medium text-slate-800">Afternoon Cycling</span>
            <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold">Moderate</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
            <span className="font-medium text-slate-800">Evening Yoga</span>
            <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold">Perfect</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
