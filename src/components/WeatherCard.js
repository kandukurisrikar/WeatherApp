import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ date, temp, min, max, icon, description, cityImage }) => {

  // Function to get the weather emoji or icon based on the description
  const getIcon = (desc) => {
    const normalizedDesc = desc.toLowerCase(); // Normalize the description to lowercase

    switch (normalizedDesc) { case 'clear sky':
      return <img 
        src="https://clipart-library.com/images/BTarbXy5c.jpg" 
        alt="Clear Sky" 
        className="weather-icon" 
        style={{ width: '15px', height: '15px' }}  // Set width and height to match emoji size
      />;
      case 'few clouds':
        return '🌤️';
      case 'scattered clouds':
        return '⛅';
      case 'rain':
      case 'light rain':
        return '🌧️';
      case 'thunderstorm':
        return '⛈️';
      case 'snow':
        return '❄️';
      case 'mist':
      case 'fog':
        return '🌫️';
      default:
        return '🌥️';
    }
  };

  // Function to determine the temperature color class
  const getTemperatureColor = (temperature) => {
    if (temperature >= 30) {
      return 'hot';
    } else if (temperature >= 20) {
      return 'warm';
    } else if (temperature >= 10) {
      return 'cool';
    } else {
      return 'cold';
    }
  };

  return (
    <div className="weather-card">
      <p className="date">{new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      
      {/* Weather Icon (Updated with better icon for clear sky and others are emojis) */}
      {getIcon(description)}

      {/* Temperature with color and description */}
      <p className={`temp ${getTemperatureColor(temp)}`}>
        {temp}°C
      </p>

      {/* Min and Max temperature */}
      <p className={`temp-range ${getTemperatureColor(min)}`}>Min: {min}°C</p>
      <p className={`temp-range ${getTemperatureColor(max)}`}>Max: {max}°C</p>

      {/* Weather Description */}
      <p className="description">{description}</p>
      
      {/* City Image (if provided) */}
      {cityImage && (
        <img src={cityImage} alt="city view" className="city-image" />
      )}
    </div>
  );
};

export default WeatherCard;
