let searchFormEl = document.querySelector("#search-form");
let searchHistoryEl = document.querySelector(".search-history");
let cityInputEl = document.querySelector("#city");

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

  // populate current weather container with city, current date, and weather icon
  let cityTitleEl = document.querySelector(".city-title");
  cityTitleEl.textContent = city + " (" + dt + ") ";
  cityTitleEl.appendChild(iconEl);
  
}

//searchFormEl = addEventListener("submit", formSubmitHandler);

getCoordinates("Columbus");