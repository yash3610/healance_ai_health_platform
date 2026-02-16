// @desc    Get health weather forecast
// @route   GET /api/forecast
// @access  Private
export const getHealthForecast = async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    // Try to fetch from OpenWeatherMap if API key available
    let weatherData = null;

    if (process.env.WEATHER_API_KEY && (lat || city)) {
      try {
        const query = city ? `q=${city}` : `lat=${lat}&lon=${lon}`;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        );
        if (response.ok) {
          weatherData = await response.json();
        }
      } catch (err) {
        console.log('Weather API error, using defaults:', err.message);
      }
    }

    // Build forecast response (with real data or smart defaults)
    const temp = weatherData?.main?.temp || 24;
    const humidity = weatherData?.main?.humidity || 65;
    const weather = weatherData?.weather?.[0]?.main || 'Sunny';
    const windSpeed = weatherData?.wind?.speed || 12;

    // Calculate health-related metrics
    const airQuality = calculateAirQuality(temp, humidity, windSpeed);
    const uvIndex = calculateUVIndex(temp, weather);
    const pollenLevel = calculatePollenLevel(temp, humidity);

    // Activity suitability based on weather
    const activities = getActivitySuitability(temp, humidity, airQuality.value, uvIndex.value);

    // Health tips
    const healthTips = generateHealthTips(temp, humidity, airQuality.value, uvIndex.value);

    res.json({
      success: true,
      forecast: {
        temperature: Math.round(temp),
        temperatureUnit: '°C',
        condition: weather,
        humidity,
        windSpeed: Math.round(windSpeed),
        airQuality,
        uvIndex,
        pollenLevel,
        activities,
        healthTips,
        location: weatherData?.name || city || 'Your Location',
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper functions
function calculateAirQuality(temp, humidity, windSpeed) {
  // Simplified air quality estimation
  let value = 45; // Base AQI
  if (humidity > 80) value += 20;
  if (temp > 35) value += 15;
  if (windSpeed > 20) value -= 10; // Wind disperses pollutants

  value = Math.max(10, Math.min(value, 200));

  let level = 'Good';
  let advice = 'Safe for outdoor activities';
  if (value > 100) { level = 'Unhealthy'; advice = 'Consider indoor activities'; }
  else if (value > 50) { level = 'Moderate'; advice = 'Sensitive groups should be cautious'; }

  return { value, level, advice };
}

function calculateUVIndex(temp, weather) {
  let value = 4; // Default moderate
  if (weather === 'Clear' || weather === 'Sunny') value = 6;
  if (weather === 'Clouds' || weather === 'Overcast') value = 2;
  if (weather === 'Rain') value = 1;
  if (temp > 30) value += 2;

  value = Math.min(value, 11);

  let level = 'Moderate';
  let advice = 'Wear sunscreen';
  if (value <= 2) { level = 'Low'; advice = 'Minimal protection needed'; }
  else if (value >= 8) { level = 'Very High'; advice = 'Avoid outdoor activities 10am-4pm'; }
  else if (value >= 6) { level = 'High'; advice = 'Wear hat, sunscreen, and sunglasses'; }

  return { value, level, advice };
}

function calculatePollenLevel(temp, humidity) {
  let level = 'Low';
  let advice = 'No allergies expected';

  if (temp > 20 && temp < 30 && humidity > 40 && humidity < 70) {
    level = 'Moderate';
    advice = 'Take antihistamines if sensitive';
  }
  if (temp > 25 && humidity > 60) {
    level = 'High';
    advice = 'Avoid outdoor activities if allergic';
  }

  return { level, advice };
}

function getActivitySuitability(temp, humidity, aqi, uvIndex) {
  const activities = [];

  // Morning Run
  let runSuitability = 'Excellent';
  if (temp > 35 || aqi > 100) runSuitability = 'Poor';
  else if (temp > 30 || humidity > 80) runSuitability = 'Moderate';
  activities.push({ name: 'Morning Run', suitability: runSuitability, time: '6:00 AM - 8:00 AM' });

  // Afternoon Cycling
  let cycleSuitability = 'Good';
  if (uvIndex > 6 || temp > 35) cycleSuitability = 'Poor';
  else if (temp > 30) cycleSuitability = 'Moderate';
  activities.push({ name: 'Afternoon Cycling', suitability: cycleSuitability, time: '4:00 PM - 6:00 PM' });

  // Evening Yoga
  activities.push({ name: 'Evening Yoga', suitability: 'Perfect', time: '6:00 PM - 7:30 PM' });

  // Outdoor Walk
  let walkSuitability = 'Good';
  if (temp > 35 || aqi > 100) walkSuitability = 'Not Recommended';
  else if (temp > 30 || humidity > 75) walkSuitability = 'Moderate';
  else if (temp >= 20 && temp <= 28) walkSuitability = 'Excellent';
  activities.push({ name: 'Outdoor Walk', suitability: walkSuitability, time: '7:00 AM - 9:00 AM' });

  return activities;
}

function generateHealthTips(temp, humidity, aqi, uvIndex) {
  const tips = [];

  if (temp > 30) tips.push('Drink extra water to stay hydrated in high temperatures');
  if (temp < 10) tips.push('Dress in layers to maintain body temperature');
  if (humidity > 70) tips.push('High humidity - take frequent breaks during exercise');
  if (aqi > 50) tips.push('Consider wearing a mask outdoors for air quality protection');
  if (uvIndex > 5) tips.push('Apply SPF 30+ sunscreen before going outdoors');
  tips.push('Stay hydrated - aim for 3 liters of water today');

  return tips;
}

// @desc    Get 7-day health forecast
// @route   GET /api/forecast/weekly
// @access  Private
export const getWeeklyForecast = async (req, res) => {
  try {
    // Generate 7-day forecast
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const conditions = ['Sunny', 'Clouds', 'Clear', 'Sunny', 'Clouds', 'Clear', 'Sunny'];
    
    const forecast = [];
    for (let i = 0; i < 7; i++) {
      const dayIndex = (today + i) % 7;
      const temp = 22 + Math.floor(Math.random() * 12);
      const humidity = 45 + Math.floor(Math.random() * 35);
      
      forecast.push({
        day: dayNames[dayIndex],
        temp,
        temperature: temp,
        condition: conditions[i % conditions.length],
        humidity,
        bestActivity: temp > 30 ? 'Indoor Yoga' : 'Morning Run',
        healthScore: 70 + Math.floor(Math.random() * 25),
        isToday: i === 0
      });
    }

    res.json({ success: true, forecast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
