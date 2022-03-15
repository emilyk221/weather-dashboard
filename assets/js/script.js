let searchFormEl = document.querySelector("#search-form");
let searchHistoryEl = document.querySelector(".search-history");
let cityInputEl = document.querySelector("#city");

let formSubmitHandler = function(event) {
  event.preventDefault();
  // get value from input element
  let city = cityInputEl.value.trim();

  // if value is valid, send to getCoordinates and clear form input
  if (city) {
    getCoordinates(city);
    cityInputEl.value = "";
  }
  // if value is not valid, send alert
  else {
    alert("Please enter a name of a city");
  }
};

let getCoordinates = function(city) {
  console.log(city);
}

searchFormEl = addEventListener("submit", formSubmitHandler);