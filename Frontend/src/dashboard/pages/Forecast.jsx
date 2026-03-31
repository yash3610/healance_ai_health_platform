import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, Thermometer, MapPin, RefreshCw, Loader2, AlertCircle, Sun, Cloud, CloudRain, CloudSnow, Sunrise, Sunset, TrendingUp, Heart, Activity, Bike, PersonStanding } from 'lucide-react';
import axios from 'axios';
import Button from '../../shared/ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const weatherIcons = {
  Sunny: Sun,
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Snow: CloudSnow,
  default: CloudSun
};

const activityIcons = {
  'Morning Run': Activity,
  'Afternoon Cycling': Bike,
  'Evening Yoga': PersonStanding,
  'Outdoor Walk': Activity,
  'Swimming': Droplets,
  default: Activity
};

const suitabilityColors = {
  Excellent: 'bg-green-50 border-green-100',
  Perfect: 'bg-blue-50 border-blue-100',
  Good: 'bg-emerald-50 border-emerald-100',
  Moderate: 'bg-yellow-50 border-yellow-100',
  Poor: 'bg-orange-50 border-orange-100',
  'Not Recommended': 'bg-red-50 border-red-100'
};

const suitabilityBadgeColors = {
  Excellent: 'bg-green-200 text-green-800',
  Perfect: 'bg-blue-200 text-blue-800',
  Good: 'bg-emerald-200 text-emerald-800',
  Moderate: 'bg-yellow-200 text-yellow-800',
  Poor: 'bg-orange-200 text-orange-800',
  'Not Recommended': 'bg-red-200 text-red-800'
};

const Forecast = () => {
  const [forecast, setForecast] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState({ city: 'Mumbai' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          // Default to Mumbai if location denied
          setLocation({ city: 'Mumbai' });
        }
      );
    }
  };

  // Fetch forecast data
  const fetchForecast = async () => {
    try {
      setIsRefreshing(true);
      const token = localStorage.getItem('healance_token');
      const params = location.lat 
        ? `lat=${location.lat}&lon=${location.lon}` 
        : `city=${location.city}`;
      
      const response = await axios.get(`${API_URL}/forecast?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setForecast(response.data.forecast);
      }
    } catch (err) {
      // Use default data if API fails
      setForecast({
        temperature: 28,
        temperatureUnit: '°C',
        condition: 'Sunny',
        humidity: 65,
        windSpeed: 12,
        airQuality: { value: 45, level: 'Good', advice: 'Safe for outdoor activities' },
        uvIndex: { value: 4, level: 'Moderate', advice: 'Wear sunscreen' },
        pollenLevel: { level: 'Low', advice: 'No allergies expected' },
        activities: [
          { name: 'Morning Run', suitability: 'Excellent', time: '6:00 AM - 8:00 AM' },
          { name: 'Afternoon Cycling', suitability: 'Moderate', time: '4:00 PM - 6:00 PM' },
          { name: 'Evening Yoga', suitability: 'Perfect', time: '6:00 PM - 7:00 PM' }
        ],
        healthTips: [
          'Stay hydrated - drink at least 3L of water today',
          'Best time for outdoor exercise: Early morning',
          'Apply SPF 30+ sunscreen before going out'
        ],
        location: 'Mumbai'
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch weekly forecast
  const fetchWeeklyForecast = async () => {
    try {
      const token = localStorage.getItem('healance_token');
      const params = location.lat 
        ? `lat=${location.lat}&lon=${location.lon}` 
        : `city=${location.city}`;
      
      const response = await axios.get(`${API_URL}/forecast/weekly?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setWeeklyForecast(response.data.forecast);
      }
    } catch (err) {
      // Generate default weekly forecast
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const today = new Date().getDay();
      setWeeklyForecast(days.map((day, i) => ({
        day,
        temp: Math.round(25 + Math.random() * 8),
        condition: ['Sunny', 'Clouds', 'Clear', 'Sunny', 'Clouds', 'Clear', 'Sunny'][i],
        humidity: Math.round(50 + Math.random() * 30),
        isToday: i === (today === 0 ? 6 : today - 1)
      })));
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    fetchForecast();
    fetchWeeklyForecast();
  }, [location]);

  const handleRefresh = () => {
    fetchForecast();
    fetchWeeklyForecast();
  };

  const handleCityChange = (city) => {
    setLocation({ city });
  };

  const WeatherIcon = forecast ? (weatherIcons[forecast.condition] || weatherIcons.default) : CloudSun;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={40} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Main Weather Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-white blur-2xl"></div>
        </div>
        
        <div className="relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">Health Weather Forecast</h2>
              <p className="text-sm sm:text-base text-blue-100">Plan your outdoor activities based on air quality and weather.</p>
              <div className="flex items-center gap-2 mt-2">
                <MapPin size={16} className="text-blue-200" />
                <span className="text-blue-100">{forecast?.location || 'Mumbai'}</span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-left sm:text-right">
                <div className="flex items-center gap-3 justify-end">
                  <WeatherIcon size={40} className="text-yellow-300" />
                  <p className="text-4xl sm:text-5xl font-bold">{forecast?.temperature || 28}{forecast?.temperatureUnit || '°C'}</p>
                </div>
                <p className="text-blue-100 text-lg">{forecast?.condition || 'Sunny'}</p>
              </div>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Weather Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 text-blue-100 text-xs sm:text-sm">
                <Wind size={16} className="flex-shrink-0" /> Air Quality
              </div>
              <p className="text-lg sm:text-xl font-bold">{forecast?.airQuality?.level || 'Good'} ({forecast?.airQuality?.value || 45})</p>
              <p className="text-[10px] sm:text-xs text-blue-200">{forecast?.airQuality?.advice || 'Safe for outdoor run'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 text-blue-100 text-xs sm:text-sm">
                <Droplets size={16} className="flex-shrink-0" /> Humidity
              </div>
              <p className="text-lg sm:text-xl font-bold">{forecast?.humidity || 65}%</p>
              <p className="text-[10px] sm:text-xs text-blue-200">{forecast?.humidity > 70 ? 'High humidity' : 'Stay hydrated'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 text-blue-100 text-xs sm:text-sm">
                <CloudSun size={16} className="flex-shrink-0" /> UV Index
              </div>
              <p className="text-lg sm:text-xl font-bold">{forecast?.uvIndex?.level || 'Moderate'} ({forecast?.uvIndex?.value || 4})</p>
              <p className="text-[10px] sm:text-xs text-blue-200">{forecast?.uvIndex?.advice || 'Wear sunscreen'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 text-blue-100 text-xs sm:text-sm">
                <Thermometer size={16} className="flex-shrink-0" /> Pollen
              </div>
              <p className="text-lg sm:text-xl font-bold">{forecast?.pollenLevel?.level || 'Low'}</p>
              <p className="text-[10px] sm:text-xs text-blue-200">{forecast?.pollenLevel?.advice || 'No allergies expected'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Forecast */}
      {weeklyForecast.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm sm:text-base flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-500" /> 7-Day Forecast
          </h3>
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {weeklyForecast.map((day, index) => {
              const DayIcon = weatherIcons[day.condition] || weatherIcons.default;
              return (
                <div 
                  key={index}
                  className={`text-center p-2 sm:p-3 rounded-xl transition-all ${
                    day.isToday ? 'bg-primary-50 border-2 border-primary-200' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <p className={`text-xs sm:text-sm font-semibold ${day.isToday ? 'text-primary-600' : 'text-slate-600'}`}>
                    {day.day}
                  </p>
                  <DayIcon size={20} className={`mx-auto my-2 ${
                    day.condition === 'Sunny' || day.condition === 'Clear' ? 'text-yellow-500' :
                    day.condition === 'Rain' ? 'text-blue-500' : 'text-slate-400'
                  }`} />
                  <p className="text-sm sm:text-lg font-bold text-slate-800">{day.temp}°</p>
                  <p className="text-[10px] text-slate-500">{day.humidity}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Suitability */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm sm:text-base flex items-center gap-2">
            <Activity size={18} className="text-green-500" /> Activity Suitability
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {(forecast?.activities || [
              { name: 'Morning Run', suitability: 'Excellent', time: '6:00 AM - 8:00 AM' },
              { name: 'Afternoon Cycling', suitability: 'Moderate', time: '4:00 PM - 6:00 PM' },
              { name: 'Evening Yoga', suitability: 'Perfect', time: '6:00 PM - 7:00 PM' }
            ]).map((activity, index) => {
              const ActivityIcon = activityIcons[activity.name] || activityIcons.default;
              return (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    suitabilityColors[activity.suitability] || 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ActivityIcon size={20} className="text-slate-600" />
                    <div>
                      <span className="font-medium text-slate-800">{activity.name}</span>
                      {activity.time && (
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    suitabilityBadgeColors[activity.suitability] || 'bg-slate-200 text-slate-800'
                  }`}>
                    {activity.suitability}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Health Tips */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm sm:text-base flex items-center gap-2">
            <Heart size={18} className="text-red-500" /> Health Tips for Today
          </h3>
          <div className="space-y-3">
            {(forecast?.healthTips || [
              'Stay hydrated - drink at least 3L of water today',
              'Best time for outdoor exercise: Early morning',
              'Apply SPF 30+ sunscreen before going out'
            ]).map((tip, index) => (
              <div key={index} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 text-sm sm:text-base flex items-center gap-2">
          <MapPin size={18} className="text-primary-500" /> Quick Location Select
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata'].map((city) => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                location.city === city 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forecast;
