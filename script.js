// Variables for UI elements
const button = document.getElementById("search-button");
const input = document.getElementById("city-input");

// Weather info elements
const cityNameElem = document.getElementById("city-loc");
const cityTimeElem = document.getElementById("city-time");
const cityTempElem = document.getElementById("city-temp");
const weatherConditionElem = document.getElementById("weather-condition");
const windSpeedElem = document.getElementById("wind-speed");
const humidityElem = document.getElementById("humidity");
const pressureElem = document.getElementById("pressure");
const uvIndexElem = document.getElementById("uv-index");
const feelsLikeElem = document.getElementById("feels-like");
const sunriseElem = document.getElementById("sunrise");
const sunsetElem = document.getElementById("sunset");
const weatherEmojiElem = document.getElementById("weather-emoji");

// UI sections for displaying weather data or error
const weatherInfo = document.getElementById("weather-info");
const errorMessage = document.getElementById("error-message");

// State variables for temperature unit (Celsius/Fahrenheit)
let tempUnit = 'C'; // default to Celsius

// Function to fetch weather data from the API
async function getWeatherData(city) {
    const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=1316decc8a654820972162314251703&q=${city}&aqi=yes`
    );
    const data = await response.json();
    return data;
}

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

// Function to update UI with fetched weather data
function updateWeatherData(data) {
    cityNameElem.innerText = `${data.location.name}, ${data.location.region} - ${data.location.country}`;
    cityTimeElem.innerText = `Local time: ${data.location.localtime}`;
    
    let tempInCelsius = data.current.temp_c;
    let feelsLikeInCelsius = data.current.feelslike_c;

    // Display temperature in the selected unit (Celsius/Fahrenheit)
    if (tempUnit === 'F') {
        cityTempElem.innerText = `${celsiusToFahrenheit(tempInCelsius).toFixed(1)}°F`;
        feelsLikeElem.innerText = `${celsiusToFahrenheit(feelsLikeInCelsius).toFixed(1)}°F`;
    } else {
        cityTempElem.innerText = `${tempInCelsius}°C`;
        feelsLikeElem.innerText = `${feelsLikeInCelsius}°C`;
    }

    weatherConditionElem.innerText = data.current.condition.text;
    windSpeedElem.innerText = `${data.current.wind_kph} km/h`;
    humidityElem.innerText = `${data.current.humidity}%`;
    pressureElem.innerText = `${data.current.pressure_mb} hPa`;
    uvIndexElem.innerText = data.current.uv;
    sunriseElem.innerText = data.forecast.forecastday[0].astro.sunrise;
    sunsetElem.innerText = data.forecast.forecastday[0].astro.sunset;

    const weatherCondition = data.current.condition.text.toLowerCase();
    if (weatherCondition.includes('clear')) {
        weatherEmojiElem.innerText = '☀️';
    } else if (weatherCondition.includes('cloud')) {
        weatherEmojiElem.innerText = '☁️';
    } else if (weatherCondition.includes('rain')) {
        weatherEmojiElem.innerText = '🌧️';
    } else if (weatherCondition.includes('snow')) {
        weatherEmojiElem.innerText = '❄️';
    } else {
        weatherEmojiElem.innerText = '🌈';
    }
}

// Button click event handler for searching city weather
button.addEventListener("click", async () => {
    const city = input.value.trim();
    if (!city) {
        errorMessage.classList.remove("hidden");
        weatherInfo.classList.add("hidden");
        return;
    }

    const result = await getWeatherData(city);

    if (result.error) {
        errorMessage.classList.remove("hidden");
        weatherInfo.classList.add("hidden");
    } else {
        errorMessage.classList.add("hidden");
        weatherInfo.classList.remove("hidden");
        updateWeatherData(result);
    }
});

// Button event listeners for Celsius/Fahrenheit toggling
document.getElementById("celsius-btn").addEventListener("click", () => {
    tempUnit = 'C';
    const currentCity = cityNameElem.innerText.split(",")[0].trim();
    if (currentCity) {
        getWeatherData(currentCity).then(updateWeatherData);
    }
});

document.getElementById("fahrenheit-btn").addEventListener("click", () => {
    tempUnit = 'F';
    const currentCity = cityNameElem.innerText.split(",")[0].trim();
    if (currentCity) {
        getWeatherData(currentCity).then(updateWeatherData);
    }
});
