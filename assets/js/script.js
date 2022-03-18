let searchFormEl = document.querySelector("#search-form");
let searchHistoryContEl = document.querySelector("#search-history");
let searchHistoryListEl = document.querySelector("#search-history-list");
let cityInputEl = document.querySelector("#city");
let currWeatherContEl = document.querySelector(".current-weather");
let currWeatherListEl = document.querySelector("#current-weather-list");
let searchedCities = [];

// hide border around current weather container when page is initially loaded
currWeatherContEl.style.display = "none";

// hide forecast cards when page is loaded
for (let i = 0; i < 5; i++) {
  let forecastCardEl = document.querySelector("#day" + (i+1));
  forecastCardEl.style.display = "none";
}

// load list of cities previously searched from localStorage
let loadSearchHistory = function() {
  // get stored cities
  searchedCities = JSON.parse(localStorage.getItem("cities"));

  // if no stored cities, create empty array
  if (!searchedCities) {
    searchedCities = [];
  }
  // create a list of city buttons and append to search history list
  else {
    for (let i = 0; i < searchedCities.length; i++) {
      let cityName = searchedCities[i];
      let cityArray = cityName.split(" ");
      let cityListEl = document.createElement("li");
      cityListEl.id = cityArray[0] + cityArray[1];
      cityListEl.classList = "searched-city btn";
      cityListEl.textContent = searchedCities[i];
  
      searchHistoryListEl.appendChild(cityListEl);
    }
  }
}

let formSubmitHandler = function(event) {
  event.preventDefault();

  // get value from input element
  let city = cityInputEl.value.trim();
  // if value is valid, send to getCoordinates, clear form input, and send city to local storage if not already there
  if (city) {
    getCoordinates(city);
    cityInputEl.value = "";
    searchedCities = JSON.parse(localStorage.getItem("cities"));
    if (!searchedCities) {
      searchedCities = [];
      searchedCities.push(city);
      saveSearchedCities();
      let cityName = searchedCities[(searchedCities.length - 1)];
      let cityArray = cityName.split(" ");
      let cityListEl = document.createElement("li");
      cityListEl.id = cityArray[0] + cityArray[1];
      cityListEl.classList = "searched-city btn";
      cityListEl.textContent = searchedCities[(searchedCities.length - 1)];
  
      searchHistoryListEl.appendChild(cityListEl);
    }
    else {
      let index = searchedCities.findIndex(function(searchedCity) {
        return JSON.stringify(searchedCity) === JSON.stringify(city);
      })
      if (index === -1) {
        searchedCities.push(city);
        saveSearchedCities();
        let cityName = searchedCities[(searchedCities.length - 1)];
        let cityArray = cityName.split(" ");
        let cityListEl = document.createElement("li");
        cityListEl.id = cityArray[0] + cityArray[1];
        cityListEl.classList = "searched-city btn";
        cityListEl.textContent = searchedCities[(searchedCities.length - 1)];
  
        searchHistoryListEl.appendChild(cityListEl);
      }
    }
  }
  // if value is not valid, send alert
  else {
    alert("Please enter a name of a city");
  } 
};

// when city button in search history is clicked, get the city name and send to getCoordinates
let cityButtonHandler = function(event) {
  event.preventDefault();
  let targetEl = event.target;
  let city = targetEl.id;

  if (city) {
    for (let i = 0; i < searchedCities.length; i++) {
      let cityName = searchedCities[i];
      let cityArray = cityName.split(" ");
      if (targetEl.matches("#" + cityArray[0] + cityArray[1])) {
        city = cityArray.join(" ");
        getCoordinates(city);
      }
    }
  }
}

let getCoordinates = function(city) {
  // format open weather geocoding api url
  let apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=a4a152b1648968c8a4d183d5f5b5283f";

  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          // define latitude and longitude
          let lat = data[0].lat;
          let long = data[0].lon;

          // send latitude and longitude to getWeather function
          getWeather(lat, long, city);
        })
      }
      // request was not successful, send alert
      else {
        alert("Error: City Data Not Found");
      }
    })
    .catch(function(error) {
      alert("Unable to connect to Open Weather");
    });
}

let getWeather = function(lat, long, city) {
  // format the open weather api url
  let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&exclude=minutely,hourly&appid=a4a152b1648968c8a4d183d5f5b5283f";
  
  // make a request to the url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          displayWeather(data, city);
        });
      }
      else {
        alert("Error: City Weather Not Found");
      }
    })
    .catch(function(error) {
      alert("Unable to connect to Open Weather");
    });
}

let displayWeather = function(data, city) {
  // get the current date in human readable format
  let dt = luxon.DateTime.now().toLocaleString();

  // get current weather icon from data and create an img element to store it in
  let currIcon = data.current.weather[0].icon;
  let iconUrl = "https://openweathermap.org/img/w/" + currIcon + ".png";
  let iconEl = document.createElement("img");
  iconEl.classList = "weather-icon";
  iconEl.setAttribute("src", iconUrl);

  // populate current weather container with city, current date, and current weather icon
  let cityTitleEl = document.querySelector(".city-title");
  cityTitleEl.textContent = city + " (" + dt + ")";
  cityTitleEl.appendChild(iconEl);

  // create list for current weather conditions
  for (let i = 0; i < 4; i++) {
    let conditions = ["Temp", "Wind", "Humidity", "UV Index"];
    let condEl = document.getElementById(conditions[i]);

    if (!condEl) {
      condEl = document.createElement("li");
      condEl.id = conditions[i];
      condEl.textContent = conditions[i] + ": ";

      currWeatherListEl.appendChild(condEl);
    }
    else {
      condEl.textContent = conditions[i] + ": ";
    }
  }

  // add current temp to current conditions
  let temp = document.getElementById("Temp");
  temp.textContent += data.current.temp + "°F";

  // add current wind speed to current conditions
  let wind = document.getElementById("Wind");
  wind.textContent += data.current.wind_speed + " MPH";

  // add current humidity to current conditions
  let humid = document.getElementById("Humidity");
  humid.textContent += data.current.humidity + " %";

  // add current uv index to current conditions
  let uvi = document.getElementById("UV Index");
  // add appropriate class for green background when uvi is in favorable range
  if (data.current.uvi < 3.00) {
    uvi.innerHTML += "<span class='UV-green'>" + data.current.uvi + "</span>";
  }
  // add appropriate class for yellow background when uvi is in moderate range
  else if (data.current.uvi >= 3.00 && data.current.uvi < 7.99) {
    uvi.innerHTML += "<span class='UV-yellow'>" + data.current.uvi + "</span>";
  }
  // add appropriate class for red background when uvi is in severe range
  else if (data.current.uvi >= 8.00) {
    uvi.innerHTML += "<span class='UV-red'>" + data.current.uvi + "</span>";
  }
  
  currWeatherContEl.style.display = "block";
  
  // create a title for forecast container
  let forecastTitleContEl = document.querySelector(".forecast-title-container")
  let forecastTitleEl = document.querySelector(".forecast-title");

  if (!forecastTitleEl) {
    let forecastTitleEl = document.createElement("h3");
    forecastTitleEl.classList = "forecast-title";
    forecastTitleEl.textContent = "5-day forecast:";
    forecastTitleContEl.appendChild(forecastTitleEl);
  }

  // add date and weather icon and data to each of the forecast cards
  for (let i = 0; i < 5; i++) {
    let forecastCardEl = document.querySelector("#day" + (i+1));
    forecastCardEl.style.display = "flex";
    let forecastDate = luxon.DateTime.now().plus({ days: (i+1) }).toLocaleString();
    forecastCardEl.textContent = forecastDate;

    let forecastIcon = data.daily[i].weather[0].icon;
    let fIconUrl = "https://openweathermap.org/img/w/" + forecastIcon + ".png";
    let fIconEl = document.createElement("img");
    fIconEl.classList = "weather-icon";
    fIconEl.setAttribute("src", fIconUrl);

    forecastCardEl.appendChild(fIconEl);

    // create a list element in each forecast card to hold forecasted weather conditions
    let forecastCondListEl = document.createElement("ul");
    forecastCondListEl.classList = "forecast-conditions-list";

    forecastCardEl.appendChild(forecastCondListEl);

    // create list of conditions in each forecast card to store forecasted values
    for (let j = 0; j < 3; j++) {
      let fConditions = ["Temp", "Wind", "Humidity"];
      let fCondEl = document.createElement("li");
      fCondEl.id = fConditions[j] + i;
      fCondEl.textContent = fConditions[j] + ": ";

      forecastCondListEl.appendChild(fCondEl);
    }

    // add forecasted temp to forecast cards
    let fTemp = document.getElementById("Temp" + i);
    fTemp.textContent += data.daily[i].temp.day + "°F";

    // add forecasted wind speed to forecast cards
    let fWind = document.getElementById("Wind" + i);
    fWind.textContent += data.daily[i].wind_speed + " MPH";

    // add forecasted humidity to forecast cards
    let fHumid = document.getElementById("Humidity" + i);
    fHumid.textContent += data.daily[i].humidity + " %";
  }
}

let saveSearchedCities = function() {
  // save cities searched to localStorage
  localStorage.setItem("cities", JSON.stringify(searchedCities));
}

searchFormEl.addEventListener("submit", formSubmitHandler);
searchHistoryListEl.addEventListener("click", cityButtonHandler);

loadSearchHistory();