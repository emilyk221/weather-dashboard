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
  console.log(lat, long, city);
}

//searchFormEl = addEventListener("submit", formSubmitHandler);

getCoordinates("Columbus");