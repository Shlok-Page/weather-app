let currentUnit = "imperial";
let currentCity = "New York";
let currentWeatherData = null;
let currentForecastData = null;
let fullForecastList = null;
const API_KEY = "1ef55a1b4cba61f3bef60c02fd098515";

function changeUnit() {
    const select = document.getElementById("unit-select");
    currentUnit = select.value;
    localStorage.setItem("tempUnit", currentUnit);
    
    getWeather(currentCity);
    getForecast(currentCity);
}

function handleSearch() {
    const input = document.querySelector(".search-input");
    const city = input.value;
    
    if (city === "") {
        alert("Please enter a city name");
        return;
    }
    
    currentCity = city;
    getWeather(city);
    getForecast(city);
}

function getWeather(city) {
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=" + currentUnit;
    
    fetch(url)
        .then(response => response.json())
        .then(data => updateWeatherDisplay(data))
        .catch(error => {
            alert("City not found");
        });
}

function updateWeatherDisplay(data) {
    currentWeatherData = data;
    
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const condition = data.weather[0].main;
    
    let emoji = "🌤️";
    
    if (condition.includes("Cloud")) {
        emoji = "⛅";
    } else if (condition.includes("Clear") || condition.includes("Sunny")) {
        emoji = "☀️";
    } else if (condition.includes("Rain")) {
        emoji = "🌧️";
    } else if (condition.includes("Storm")) {
        emoji = "⛈️";
    } else if (condition.includes("Snow")) {
        emoji = "❄️";
    }
    
    document.querySelector(".current-weather h1").textContent = cityName;
    const unit = currentUnit === "imperial" ? "°F" : "°C";
    document.querySelector(".temperature").textContent = temperature + unit;
    document.querySelector(".condition").textContent = condition;
    document.querySelector(".weather-icon").textContent = emoji;
}

function getForecast(city) {
    const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + API_KEY + "&units=" + currentUnit;
    
    fetch(url)
        .then(response => response.json())
        .then(data => updateForecastDisplay(data))
        .catch(error => {
            console.log("Forecast error:", error);
        });
}

function updateForecastDisplay(data) {
    currentForecastData = data;
    fullForecastList = data.list;
    const forecastList = data.list;
    const forecastCards = document.querySelectorAll(".forecast-card");
    
    const uniqueDays = [];
    const dailyForecasts = [];
    
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayIdentifier = date.toDateString();
        
        if (!uniqueDays.includes(dayIdentifier)) {
            uniqueDays.push(dayIdentifier);
            dailyForecasts.push(forecast);
        }
    });

    forecastCards.forEach((card, index) => {
        const forecastIndex = dailyForecasts.length > 5 ? index + 1 : index;
        const forecast = dailyForecasts[forecastIndex];

        if (forecast && card) {
            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dayOfMonth = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const dateString = dayName + ", " + month + " " + dayOfMonth;
            
            const temp = Math.round(forecast.main.temp);
            const condition = forecast.weather[0].main;
        
            let emoji = "🌤️";
            if (condition.includes("Cloud")) {
                emoji = "⛅";
            } else if (condition.includes("Clear") || condition.includes("Sunny")) {
                emoji = "☀️";
            } else if (condition.includes("Rain")) {
                emoji = "🌧️";
            } else if (condition.includes("Storm")) {
                emoji = "⛈️";
            } else if (condition.includes("Snow")) {
                emoji = "❄️";
            }
            
            card.querySelector(".day").textContent = dateString;
            card.querySelector(".icon").textContent = emoji;
            const unit = currentUnit === "imperial" ? "°F" : "°C";
            card.querySelector(".temp").textContent = temp + unit;
        }
    });
    console.log("Forecast updated successfully!");
}

function showHourlyDetails(cardIndex) {
    if (!fullForecastList || fullForecastList.length === 0) {
        alert("Forecast data not available");
        return;
    }
    
    const uniqueDays = [];
    const dailyForecasts = [];
    
    fullForecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayIdentifier = date.toDateString();
        
        if (!uniqueDays.includes(dayIdentifier)) {
            uniqueDays.push(dayIdentifier);
            dailyForecasts.push(forecast);
        }
    });
    
    const forecastIndex = dailyForecasts.length > 5 ? cardIndex + 1 : cardIndex;
    const selectedDay = new Date(dailyForecasts[forecastIndex].dt * 1000);
    const selectedDayString = selectedDay.toDateString();
    
    const dayEntries = fullForecastList.filter(forecast => {
        const forecastDate = new Date(forecast.dt * 1000);
        return forecastDate.toDateString() === selectedDayString;
    });
    
    let html = "";
    dayEntries.forEach(entry => {
        const time = new Date(entry.dt * 1000);
        const timeString = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const temp = Math.round(entry.main.temp);
        const condition = entry.weather[0].main;
        const unit = currentUnit === "imperial" ? "°F" : "°C";
        
        html += `
            <div class="hourly-item">
                <div class="hourly-time">${timeString}</div>
                <div class="hourly-temp">${temp}${unit}</div>
                <div class="hourly-condition">${condition}</div>
            </div>
        `;
    });
    
    const dayName = selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    document.getElementById("modal-title").textContent = dayName;
    document.getElementById("hourly-list").innerHTML = html;
    document.getElementById("hourly-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("hourly-modal").style.display = "none";
}

function showTodayHourly() {
    if (!fullForecastList || fullForecastList.length === 0) {
        alert("Forecast data not available");
        return;
    }
    
    const today = new Date();
    const todayString = today.toDateString();
    
    const todayEntries = fullForecastList.filter(forecast => {
        const forecastDate = new Date(forecast.dt * 1000);
        return forecastDate.toDateString() === todayString;
    });
    
    let entries = todayEntries;
    if (todayEntries.length === 0) {
        const firstDayDate = new Date(fullForecastList[0].dt * 1000);
        const firstDayString = firstDayDate.toDateString();
        entries = fullForecastList.filter(forecast => {
            const forecastDate = new Date(forecast.dt * 1000);
            return forecastDate.toDateString() === firstDayString;
        });
    }
    
    let html = "";
    entries.forEach(entry => {
        const time = new Date(entry.dt * 1000);
        const timeString = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const temp = Math.round(entry.main.temp);
        const condition = entry.weather[0].main;
        const unit = currentUnit === "imperial" ? "°F" : "°C";
        
        html += `
            <div class="hourly-item">
                <div class="hourly-time">${timeString}</div>
                <div class="hourly-temp">${temp}${unit}</div>
                <div class="hourly-condition">${condition}</div>
            </div>
        `;
    });
    
    const dayName = "Today - " + new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    document.getElementById("modal-title").textContent = dayName;
    document.getElementById("hourly-list").innerHTML = html;
    document.getElementById("hourly-modal").style.display = "flex";
}

function openSettings() {
    const savedCity = localStorage.getItem("defaultCity");
    if (savedCity) {
        document.getElementById("default-city").value = savedCity;
    }
    
    document.getElementById("settings-modal").style.display = "flex";
}

function closeSettings() {
    document.getElementById("settings-modal").style.display = "none";
}

function saveSettings() {
    const defaultCity = document.getElementById("default-city").value;
    
    if (defaultCity) {
        localStorage.setItem("defaultCity", defaultCity);
        alert("Preferences saved!");
    } else {
        alert("Please enter a city name");
    }
    
    closeSettings();
}

function loadSettings() {
    // Load temperature unit preference
    const savedUnit = localStorage.getItem("tempUnit");
    if (savedUnit) {
        currentUnit = savedUnit;
        const unitSelect = document.getElementById("unit-select");
        if (unitSelect) {
            unitSelect.value = savedUnit;
        }
    }
    
    // Load light mode preference
    const lightMode = localStorage.getItem("lightMode");
    if (lightMode === "true") {
        const lightToggle = document.getElementById("light-mode-toggle");
        if (lightToggle) {
            lightToggle.checked = true;
            document.body.classList.add("light-mode");
        }
    }
    
    // Load default city
    const savedCity = localStorage.getItem("defaultCity");
    
    if (savedCity) {
        currentCity = savedCity;
        getWeather(savedCity);
        getForecast(savedCity);
    } else {
        currentCity = "New York";
        getWeather("New York");
        getForecast("New York");
    }
}

function toggleLightMode() {
    const toggle = document.getElementById("light-mode-toggle");
    
    if (toggle.checked) {
        document.body.classList.add("light-mode");
        localStorage.setItem("lightMode", "true");
        console.log("Light mode ON");
    } else {
        document.body.classList.remove("light-mode");
        localStorage.setItem("lightMode", "false");
        console.log("Light mode OFF");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadSettings();
    
    const input = document.querySelector(".search-input");
    if (input) {
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                handleSearch();
            }
        });
    }
});
