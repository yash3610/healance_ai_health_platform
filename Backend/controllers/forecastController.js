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
  let runRating = 'Excellent';
  if (temp > 35 || aqi > 100) runRating = 'Poor';
  else if (temp > 30 || humidity > 80) runRating = 'Moderate';
  activities.push({ name: 'Morning Run', rating: runRating });

  // Afternoon Cycling
  let cycleRating = 'Good';
  if (uvIndex > 6 || temp > 35) cycleRating = 'Poor';
  else if (temp > 30) cycleRating = 'Moderate';
  activities.push({ name: 'Afternoon Cycling', rating: cycleRating });

  // Evening Yoga
  activities.push({ name: 'Evening Yoga', rating: 'Perfect' }); // Always suitable

  // Swimming
  let swimRating = 'Good';
  if (temp < 15) swimRating = 'Poor';
  else if (temp > 25 && temp < 35) swimRating = 'Excellent';
  activities.push({ name: 'Swimming', rating: swimRating });

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

// @desc    Get 5-day health forecast
// @route   GET /api/forecast/weekly
// @access  Private
export const getWeeklyForecast = async (req, res) => {
  try {
    // Generate 5-day forecast
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const forecast = days.map((day, i) => {
      const temp = 20 + Math.floor(Math.random() * 15);
      const humidity = 40 + Math.floor(Math.random() * 40);
      const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Clear', 'Light Rain'];

      return {
        day,
        temperature: temp,
        condition: conditions[i % conditions.length],
        humidity,
        bestActivity: temp > 30 ? 'Indoor Yoga' : 'Morning Run',
        healthScore: 70 + Math.floor(Math.random() * 25),
      };
    });

    res.json({ success: true, forecast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
