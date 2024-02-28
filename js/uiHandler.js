const uiHandler = (() => {
    const updateWeatherUI = (data) => {
        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
        document.querySelector(".Humidity").textContent = `${data.main.humidity}%`;
        document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;
        document.querySelector(".feels_like").textContent = `feels like ${Math.round(data.main.feels_like)} °C`;

        const timezoneOffset = data.timezone;
        const riseDate = new Date((data.sys.sunrise + timezoneOffset) * 1000);
        const setDate = new Date((data.sys.sunset + timezoneOffset) * 1000);
        const riseTime = riseDate.toLocaleTimeString();
        const setTime = setDate.toLocaleTimeString();
        document.getElementById('sunrise-time').textContent = riseTime;
        document.getElementById('sunset-time').textContent = setTime;


        const weatherCard = document.querySelector(".weather");
        if (weatherCard) {
            weatherCard.style.display = "block"; 
        }
    };

    const showError = (message) => {
        const errorElement = document.querySelector(".error");
        errorElement.textContent = message; 
        errorElement.style.display = "block";
    };

    const hideError = () => {
        document.querySelector(".error").style.display = "none";
    };

    const handleSearch = async () => {
        try {
            const city = searchBox.value;
            const data = await weatherAPI.fetchWeather(city);
            uiHandler.updateWeatherUI(data); 
            SearchHistoryManager.saveSearchToHistory(city);
        } catch (error) {
            uiHandler.showError(error.message); 
        }
    };

    return { updateWeatherUI, showError, hideError };
})();