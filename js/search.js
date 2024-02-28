
const SearchHistoryManager = (() => {
    const storageKey = 'searchHistory';
    const searchHistoryList = document.getElementById('search-history-list');
    const searchBtn = document.querySelector("#searchBtn");

    const loadSearchHistory = () => {
        const searches = JSON.parse(localStorage.getItem(storageKey)) || [];
        searchHistoryList.innerHTML = ''; // Clear current list
        searches.forEach(city => {
            const listItem = document.createElement('li');
            listItem.textContent = city;
            listItem.addEventListener('click', () => removeCityFromHistory(city));
            searchHistoryList.appendChild(listItem);
        });
    };

    const saveSearchToHistory = (city) => {
        let searches = JSON.parse(localStorage.getItem(storageKey)) || [];
        if (!searches.includes(city)) {
            searches.push(city);
            localStorage.setItem(storageKey, JSON.stringify(searches));
        }
        loadSearchHistory(); // Refresh the list
    };

    const removeCityFromHistory = (cityToRemove) => {
        let searches = JSON.parse(localStorage.getItem(storageKey)) || [];
        searches = searches.filter(city => city !== cityToRemove);
        localStorage.setItem(storageKey, JSON.stringify(searches));
        loadSearchHistory(); // Update UI
    };

    // Initial load of search history on DOMContentLoaded or module initialization
    document.addEventListener('DOMContentLoaded', loadSearchHistory);

    return { loadSearchHistory, saveSearchToHistory, removeCityFromHistory };
    
})(); 




// This assumes the weatherAPI and uiHandler modules have already been included in the HTML before this script
document.addEventListener('DOMContentLoaded', () => {
    // Load search history when the DOM is ready
    SearchHistoryManager.loadSearchHistory();

    

    const searchBox = document.querySelector(".search input");
    const searchBtn = document.querySelector("#searchBtn");

    // Function to handle the search and update the UI
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

    // Attach the event listener to the search button
    searchBtn.addEventListener('click', handleSearch);

    // Optionally, set up an event listener for the enter key in the search box
    searchBox.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });


    let currentCityIndex = 0;
    const cities = JSON.parse(localStorage.getItem('searchHistory')) || [];

    const displayWeatherForCity = async (index) => {
        const city = cities[index];
        try {
            const data = await weatherAPI.fetchWeather(city);
            uiHandler.updateWeatherUI(data);
        } catch (error) {
            uiHandler.showError(error.message);
        }
    }; 

  



   
    document.getElementById('prev-city').addEventListener('click', () => {
        if (cities.length > 0) {
            currentCityIndex = (currentCityIndex - 1 + cities.length) % cities.length;
            displayWeatherForCity(currentCityIndex);
        }
    });

    document.getElementById('next-city').addEventListener('click', () => {
        if (cities.length > 0) {
            currentCityIndex = (currentCityIndex + 1) % cities.length;
            displayWeatherForCity(currentCityIndex);
        }
    });




    // Optionally, to toggle navigation buttons based on search input focus
    const search = document.querySelector(".search input");
    searchBox.addEventListener('focus', () => {
        // Hide the navigation buttons
        document.getElementById('prev-city').style.display = 'none';
        document.getElementById('next-city').style.display = 'none';
    });

    search.addEventListener('blur', () => {
        // Show the navigation buttons if there are cities in history
        if (cities.length > 0) {
            document.getElementById('prev-city').style.display = 'block';
            document.getElementById('next-city').style.display = 'block';
        }
    });

});