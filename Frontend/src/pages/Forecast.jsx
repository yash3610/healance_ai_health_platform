import React from 'react';
import { CloudSun, Wind, Droplets, Thermometer } from 'lucide-react';

const Forecast = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-1">Health Weather Forecast</h2>
            <p className="text-blue-100">Plan your outdoor activities based on air quality and weather.</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">24°C</p>
            <p className="text-blue-100">Sunny</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-blue-100">
              <Wind size={18} /> Air Quality
            </div>
            <p className="text-xl font-bold">Good (45)</p>
            <p className="text-xs text-blue-200">Safe for outdoor run</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-blue-100">
              <Droplets size={18} /> Humidity
            </div>
            <p className="text-xl font-bold">65%</p>
            <p className="text-xs text-blue-200">Stay hydrated</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-blue-100">
              <CloudSun size={18} /> UV Index
            </div>
            <p className="text-xl font-bold">Moderate (4)</p>
            <p className="text-xs text-blue-200">Wear sunscreen</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-blue-100">
              <Thermometer size={18} /> Pollen
            </div>
            <p className="text-xl font-bold">Low</p>
            <p className="text-xs text-blue-200">No allergies detected</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Activity Suitability</h3>
        <div className="space-y-4">
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
