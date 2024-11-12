import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import './App.css'; // Import CSS for styling

const App = () => {
  const [cityName, setCityName] = useState('');
  const [data, setData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const [airQuality, setAirQuality] = useState(null);
  const [healthTip, setHealthTip] = useState('');
  const [customAlert, setCustomAlert] = useState('');
  const [alertTriggered, setAlertTriggered] = useState(false);

  // Function to fetch air quality data
  useEffect(() => {
    const fetchAirQuality = async () => {
      try {
        const response = await axios.get('YOUR_AIR_QUALITY_API_URL');
        setAirQuality(response.data);
        // Basic condition for health tips based on air quality index (AQI)
        if (response.data.aqi > 100) {
          setHealthTip("Today's air quality is poor. Consider wearing a mask if going outside.");
        } else {
          setHealthTip("The air quality is good today! Enjoy the fresh air.");
        }
      } catch (error) {
        console.error("Error fetching air quality data:", error);
      }
    };
    fetchAirQuality();
  }, []);

  // Function to fetch weather data for customized alerts
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=9063a3e3bd8e02ae19b2da7928eb91b1&units=metric`
        );
        setCurrentWeather(response.data);

        // Example alert condition (customize as needed)
        const weatherCondition = response.data.weather[0].main;
        const temperature = response.data.main.temp;

        if (weatherCondition === 'Rain' || temperature < 10) {
          setCustomAlert("Alert! High chance of rain or low temperature expected. Drive safely on roads.");
          setAlertTriggered(true);
          setHealthTip("Be careful to avoid fungal infections. Avoid staying outdoors unless necessary.");
        } else if (weatherCondition === 'Clouds') {
          setCustomAlert("It’s a cloudy day, carry an umbrella just in case.");
          setAlertTriggered(true);
          setHealthTip("Cloudy days can be a bit chilly, so dress warmly.");
        } else if (weatherCondition === 'Clear') {
          setCustomAlert("It’s a bright sunny day. Stay hydrated and enjoy the weather!");
          setAlertTriggered(true);
          setHealthTip("Be cautious of sunburn, and wear sunscreen if you’re going outdoors.");
        } else {
          setCustomAlert("Enjoy the weather today! No major alerts.");
          setAlertTriggered(false);
          setHealthTip("The weather is neutral today, but always be prepared.");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeatherData();
  }, [cityName]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message before each fetch attempt

    try {
      // Fetch current weather data
      const currentResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=9063a3e3bd8e02ae19b2da7928eb91b1&units=metric`
      );
      setCurrentWeather(currentResponse.data);

      // Fetch 5-day forecast data
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=9063a3e3bd8e02ae19b2da7928eb91b1&units=metric`
      );
      setData(forecastResponse.data.list);
    } catch (error) {
      setErrorMessage('Error fetching weather data. Please try again.');
      console.error('Error fetching weather data:', error);

      // Hide the error message after 6 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 6000); // 6000 ms = 6 seconds
    }
  };
  const getHourlyForecast = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const upcomingHours = [];
  
    // Loop through the forecast data to find the next 5 distinct hours
    for (let i = 0; i < data.length && upcomingHours.length < 5; i++) {
      const forecastDate = new Date(data[i].dt_txt);
      const forecastHour = forecastDate.getHours();
  
      // If forecast time is after the current time or into the next day, add to upcoming hours
      if (
        (forecastDate.getDate() === currentDate.getDate() && forecastHour > currentHour) ||
        forecastDate.getDate() > currentDate.getDate()
      ) {
        upcomingHours.push(data[i]);
      }
    }
  
    return upcomingHours;
  };
  
  // Function to get a 5-day forecast for midday temperatures
  const get5DayForecast = () => {
    const forecast = [];
    let dayCount = 0;

    for (let i = 0; i < data.length; i++) {
      if (dayCount < 5 && data[i].dt_txt.includes("12:00:00")) {
        forecast.push(data[i]);
        dayCount++;
      }
    }
    return forecast;
  };

  return (
    <div className="app-container">
      {/* "Hey! Jaime" Text at Top Right */}
      <div className="hey-jaime">
        Hey! Jaime
      </div>

      {/* Error Message Display */}
      <div className={`error-message ${errorMessage ? 'show' : ''}`}>
        {errorMessage}
      </div>

      <form onSubmit={submitHandler} className="form">
        <h1 className="heading">Weather App</h1>
        <input
          type="text"
          required
          placeholder="Enter City Name"
          onChange={(e) => setCityName(e.target.value)}
          className="input"
        />
        <button type="submit" className="submit-button">Get Weather</button>
      </form>

      {currentWeather && (
        <div className="current-weather">
          <div className="cards-container">
            {/* Health Tips Card */}
            <div className="health-tips-card">
              <h3>Health Tip</h3>
              <div className="card-content">
                <p>{healthTip}</p>
              </div>
            </div>

            {/* Custom Alerts Card */}
            <div className="custom-alert-card">
              <h3>Weather Alert</h3>
              <div className="card-content">
                <p>{customAlert}</p>
              </div>
            </div>
          </div>

          <div className="current-info">
            <h2>{currentWeather.name}</h2>
            <p>{new Date().toLocaleDateString()}</p>
            <p className="temperature">{currentWeather.main.temp}°C</p>
            <img
              src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="weather-icon"
            />
            <p className="air-quality">Air Quality: {currentWeather.weather[0].description}</p>
          </div>

          {/* Hourly Forecast Cards */}
          <div className="hourly-forecast">
            <h3>Next Hours Forecast</h3>
            <div className="forecast-cards scrollable">
              {getHourlyForecast().map((forecast, index) => (
                <WeatherCard
                  key={index}
                  date={forecast.dt_txt}
                  temp={forecast.main.temp}
                  min={forecast.main.temp_min}
                  max={forecast.main.temp_max}
                  icon={forecast.weather[0].icon}
                  description={forecast.weather[0].description}
                />
              ))}
            </div>
          </div>

          {/* 5-Day Forecast Cards */}
          <div className="five-day-forecast">
            <h3>5-Day Forecast</h3>
            <div className="forecast-cards">
              {get5DayForecast().map((forecast, index) => (
                <div className="forecast-card" key={index}>
                  <p className="date">{new Date(forecast.dt_txt).toLocaleDateString()}</p>
                  <p className="day">{new Date(forecast.dt_txt).toLocaleString('en-US', { weekday: 'long' })}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt="weather icon"
                    className="forecast-icon"
                  />
                  <p className="temp-range">
                    {forecast.main.temp_min}°C / {forecast.main.temp_max}°C
                  </p>
                  <p className="description">{forecast.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
