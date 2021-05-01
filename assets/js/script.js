//VARIABLE DECLARATIONS

//FUNCTIONS

//fetch api function

//EVENT HANDLERS

//listen for click from search button
$("#searchBtn").on("click", function () {
  var cityInput = $("#citySearch").val();
  console.log(cityInput);
  //clear input field
  $("#citySearch").val("");
  //create a variable that combines api url with city + key
  var weatherKey = "5255530bf1f1204d64609824d51b20e5";
  var requestUrl = [
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityInput +
      "&units=imperial&appid=" +
      weatherKey,
  ];
  console.log(requestUrl);

  $.ajax({
    url: requestUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    //parse the object to glean relevant data
    var cityName = response.name;
    var temp = response.main.temp;
    var wind = response.wind.speed;
    var humidity = response.main.humidity;

    //select containers to generate data elements
    var saved = $("#savedCities");
    var current = $("#currentDisplay");
    var forecast = $("#forecastDisplay");

    //display the saved city search

    //display current weather data with dynamically generated elements
    var cityShow = $("<h1>");
    cityShow.text(cityName);
    current.append(cityShow);

    //display the 5 day forecast
  });
});

//add city name to local storage so we can create a button for future searches
