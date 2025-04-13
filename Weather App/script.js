
document.getElementById('submitBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

async function fetchWeather(city) {
    const apiKey = '8b12323b4d4c104ee19140457f240db1'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === '404') {
            alert('City not found.');
            return;
        }

        document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
        document.getElementById('temperature-fells').textContent = `Temperature-fells like: ${data.main.feels_like}°C`;
        document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
        document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById('wind').textContent = `Wind Speed: ${data.wind.speed} m/s`;

        const iconCode = data.weather[0].icon;
        // document.getElementById('weatherIcon').src = `http://openweathermap.org/img/w/${iconCode}.png`;
        document.getElementById('weatherIcon').src = `icons/${iconCode}.png`;

    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Failed to fetch weather data.');
    }
}
document.getElementById('cityInput').addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        const city = document.getElementById('cityInput').value;
        if (city) {
            fetchWeather(city);
        } else {
            alert('Please enter a city name.');
        }
    }
});



// byy location using 
function getLocation() {
    navigator.geolocation.getCurrentPosition(suses, error)
    
}

function suses(cp) {
    const lat = cp.coords.latitude;
    const lon = cp.coords.longitude;
    fetchWeatherByLL(lat, lon);
}
function error() {
    alert("Error gatting fail")
}
async function fetchWeatherByLL(lat, lon) {
    const apiKey = '8b12323b4d4c104ee19140457f240db1';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === '404') {
            alert('City not found.');
            return;
        }

        document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
        document.getElementById('temperature-fells').textContent = `Temperature-fells like: ${data.main.feels_like}°C`;
        document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
        document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById('wind').textContent = `Wind Speed: ${data.wind.speed} m/s`;

        const iconCode = data.weather[0].icon;
        // document.getElementById('weatherIcon').src = `http://openweathermap.org/img/w/${iconCode}.png`;
        document.getElementById('weatherIcon').src = `icons/${iconCode}.png`;

    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Failed to fetch weather data.');
    }
}

// allwyas call
getLocation()




