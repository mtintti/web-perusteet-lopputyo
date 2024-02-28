// weatherAPI.js
const weatherAPI = (() => {
    const apiKey = "put api key";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

    const fetchWeather = async (city) => {
        try {
            const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
            if (!response.ok) throw new Error('City not found');
            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    return { fetchWeather };
})();