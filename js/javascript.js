class WeatherAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
    }

    fetchTemperature(city) {
        return fetch(this.apiUrl + city + '&appid=' + this.apiKey)
            .then(response => {
                if (!response.ok) throw new Error('City not found');
                return response.json();
            })
            .then(data => data.main.temp);
    }
}

class TemperatureCalculator {
    constructor(weatherAPI) {
        this.weatherAPI = weatherAPI;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('temp-difference-form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.calculateDifference();
        });
    }

    calculateDifference() {
        const city1 = document.getElementById('city1').value;
        const city2 = document.getElementById('city2').value;
        Promise.all([
            this.weatherAPI.fetchTemperature(city1),
            this.weatherAPI.fetchTemperature(city2)
        ]).then(([temp1, temp2]) => {
            const difference = Math.abs(temp1 - temp2);
            document.getElementById('result').value = difference.toFixed(2) + '°C';
        }).catch(error => {
            console.error(error);
            document.getElementById('result').value = error.message;
        });
    }
}

// Usage
const weatherAPI = new WeatherAPI('put api key');
const tempCalc = new TemperatureCalculator(weatherAPI);





