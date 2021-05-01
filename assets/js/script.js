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

  //display the saved city search
  //**need to connect to local storage for saving and retrieval**
  var savedContainer = $("#savedCities");
  var savedCity = $("<button>");
  savedCity.text(cityInput).addClass("btn btn-secondary col-12 mt-3");
  savedContainer.append(savedCity);

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
    var tempData = response.main.temp;
    var windData = response.wind.speed;
    var humData = response.main.humidity;

    //display current weather data with dynamically generated elements

    //display city name
    var current = $("#currentDisplay");
    var cityShow = $("<h1>");
    cityShow.text(cityName).addClass("h1");
    current.append(cityShow);

    //display temp
    var tempShow = $("<h2>");
    tempShow.text("Temp: " + tempData + " °F").addClass("h3");
    current.append(tempShow);

    //display wind
    var windShow = $("<h2>");
    windShow.text("Wind: " + windData + " MPH").addClass("h3");
    current.append(windShow);

    //display humidity
    var humShow = $("<h2>");
    humShow.text("Humidity: " + humData + "%").addClass("h3");
    current.append(humShow);

    //display UV index (color)

    //display the 5 day forecast
    var forecast = $("#forecastDisplay");
  });
});

//add city name to local storage so we can create a button for future searches
