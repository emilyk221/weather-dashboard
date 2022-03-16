let searchFormEl = document.querySelector("#search-form");
let searchHistoryEl = document.querySelector(".search-history");
let cityInputEl = document.querySelector("#city");
let currWeatherListEl = document.querySelector("#current-weather-list");

// let formSubmitHandler = function(event) {
//   event.preventDefault();
//   // get value from input element
//   let city = cityInputEl.value.trim();

//   // if value is valid, send to getCoordinates and clear form input
//   if (city) {
//     getCoordinates(city);
//     cityInputEl.value = "";
//   }
//   // if value is not valid, send alert
//   else {
//     alert("Please enter a name of a city");
//   }
// };

let getCoordinates = function(city) {
  // format open weather geocoding api url
  let apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=${weatherApiKey}";

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
}

let getWeather = function(lat, long, city) {
  // format the open weather api url
  let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}";
  
  // make a request to the url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          console.log(data);
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
    let condEl = document.createElement("li");
    condEl.id = conditions[i];
    condEl.textContent = conditions[i] + ": ";

    currWeatherListEl.appendChild(condEl);
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
  uvi.textContent += data.current.uvi;
  
  // create a title for forecast container
  let forecastTitleContEl = document.querySelector(".forecast-title-container")
  let forecastTitleEl = document.createElement("h3");
  forecastTitleEl.classList = "forecast-title";
  forecastTitleEl.textContent = "5-day forecast:";
  forecastTitleContEl.appendChild(forecastTitleEl);

  // add date and weather icon and data to each of the forecast cards
  for (let i = 0; i < 5; i++) {
    let forecastCardEl = document.querySelector("#day" + (i+1));
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

//searchFormEl = addEventListener("submit", formSubmitHandler);

getCoordinates("Columbus");