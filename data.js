const API_KEY = "1ef55a1b4cba61f3bef60c02fd098515";
        
function handleSearch() {
    const input = document.querySelector(".search-input");
    const city = input.value;
            
    if (city === "") {
        alert("Please enter a city name");
        return;
    }
            
    getWeather(city);
    getForecast(city);
}
        
function getWeather(city) {
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=imperial";
            
    fetch(url)
        .then(response => response.json())
        .then(data => updateWeatherDisplay(data))
        .catch(error => {
            alert("City not found");
        });
}
        
function updateWeatherDisplay(data) {
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
    document.querySelector(".temperature").textContent = temperature + "°F";
    document.querySelector(".condition").textContent = condition;
    document.querySelector(".weather-icon").textContent = emoji;
}
        
function getForecast(city) {
    const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + API_KEY + "&units=imperial";
            
    fetch(url)
        .then(response => response.json())
        .then(data => updateForecastDisplay(data))
        .catch(error => {
            console.log("Forecast error:", error);
        });
}
        
function updateForecastDisplay(data) {
    const forecastList = data.list;
    const forecastCards = document.querySelectorAll(".forecast-card");
    
    // 1. Dynamically group forecasts to get exactly one per unique day
    const uniqueDays = [];
    const dailyForecasts = [];
    
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayIdentifier = date.toDateString(); // e.g., "Mon Aug 17 2026"
        
        // If we haven't added this day yet, capture it
        if (!uniqueDays.includes(dayIdentifier)) {
            uniqueDays.push(dayIdentifier);
            dailyForecasts.push(forecast);
        }
    });

    // 2. Loop through your 5 existing HTML cards and update them safely
    forecastCards.forEach((card, index) => {
        // Skip the very first entry if it matches today's date
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
        card.querySelector(".temp").textContent = temp + "°F";
    }
    });
    console.log("Forecast updated successfully!");
}


        
document.addEventListener("DOMContentLoaded", function() {
    // 1. Automatically load New York weather when the page opens
    getWeather("New York");
    getForecast("New York");

    // 2. Keep your existing Enter Key event listener for the search box
    const input = document.querySelector(".search-input");
    if (input) {
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                handleSearch();
            }
        });
    }
});
