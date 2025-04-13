// Event listener for the submit button
document.getElementById('submitBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

// Event listener for pressing Enter in the input field
document.getElementById('cityInput').addEventListener("keydown", function (event) {
    if (event.key === "Enter") {  // Use event.key instead of keyCode (deprecated)
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            alert('Please enter a city name.');
        }
    }
});

// Function to fetch weather data by city name
async function fetchWeather(city) {
    const apiKey = '8b12323b4d4c104ee19140457f240db1'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            alert('City not found or API error.');
            return;
        }

        updateWeatherUI(data);
        // Update location name display with the city searched for
        const locationElement = document.getElementById('locationName');
        if (locationElement) {
             // Use the name from the API response for consistency (capitalization, etc.)
            locationElement.textContent = `Location: ${data.name}, ${data.sys.country}`;
        }

    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Failed to fetch weather data.');
    }
}

// Function to fetch weather data by latitude and longitude
async function fetchWeatherByLL(lat, lon) {
    const apiKey = '8b12323b4d4c104ee19140457f240db1'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            alert('Location weather data not found.');
            return;
        }

        updateWeatherUI(data);

        // Fetch and display the specific city/town name from coordinates
        getLocationNameFromCoords(lat, lon).then(locationName => {
            console.log('Location Name:', locationName);
            const locationElement = document.getElementById('locationName');
            if (locationElement) {
                // Display the extracted city/town name or fallback
                locationElement.textContent = `Location: ${locationName}`;
            }
        });

    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Failed to fetch weather data.');
    }
}

// Function to update UI with weather details
function updateWeatherUI(data) {
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('temperature-fells').textContent = `Feels like: ${data.main.feels_like}°C`;
    document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind').textContent = `Wind Speed: ${data.wind.speed} m/s`;

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Use @2x for better resolution
    document.getElementById('weatherIcon').src = iconUrl;
    document.getElementById('weatherIcon').alt = data.weather[0].description; // Add alt text
}


// Get user's location and fetch weather
function getLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, geoError, {
            enableHighAccuracy: true, // Optional: Request more accurate location
            timeout: 10000,         // Optional: Set a timeout
            maximumAge: 0           // Optional: Don't use cached location
        });
    } else {
        alert("Geolocation is not supported by this browser.");
        // Optionally fetch weather for a default city if geolocation fails
        // fetchWeather("London");
    }
}

// Success callback for geolocation
function success(cp) {
    const lat = cp.coords.latitude;
    const lon = cp.coords.longitude;
    fetchWeatherByLL(lat, lon); // This function now handles fetching name too
}

// Error callback for geolocation
function geoError(error) {
    console.error('Geolocation error:', error.code, error.message);
    let message = "Error getting location: ";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message += "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            message += "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            message += "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            message += "An unknown error occurred.";
            break;
    }
    alert(message);
     // Optionally fetch weather for a default city if geolocation fails
     // fetchWeather("London");
}

// ***** MODIFIED FUNCTION *****
// Function to get ONLY the city/town/village name from coordinates using Nominatim
function getLocationNameFromCoords(lat, lon) {
    // Use HTTPS for Nominatim
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`; // Added language preference

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Extract city, town, or village from the address object
            if (data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
                if (city) {
                    // Optionally add state or country if needed for clarity
                    const state = data.address.state || '';
                    const country = data.address.country || '';
                    // Combine city with country for context, adjust as needed
                    return `${city}${country ? ', ' + country : ''}`;
                } else {
                     // If no city/town/village, fall back to a broader category or the full name
                     return data.display_name || "Location name not found";
                }
            }
            // Fallback if address object is missing
            return data.display_name || "Location name not found";
        })
        .catch(error => {
            console.error('Error fetching location name:', error);
            return "Location lookup failed"; // More specific error message
        });
}

// Always attempt to fetch location on page load
getLocation();