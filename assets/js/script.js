//VARIABLE DECLARATIONS

//FUNCTIONS

//EVENT HANDLERS

//display the saved city searches in buttons upon page load
for (var i = 0; i < localStorage.length; i++) {
  var savedCityList = localStorage.getItem(localStorage.key(i));

  console.log(savedCityList);
}

var savedContainer = $("#savedCities");
var savedCityBut = $("<button>");
savedCityBut
  .text(savedCityList)
  .addClass("btn btn-secondary col-12 mt-3")
  .attr("id", "searchCity");
savedContainer.append(savedCityBut);

//listen for click from search button
$("#searchBtn").on("click", function () {
  var cityInput = $("#citySearch").val();

  //clear input field
  $("#citySearch").val("");

  //clear previously called data
  $("#currentDisplay").empty();
  $("#forecastDisplay").empty();

  //save city to local storage and create a button with saved city name
  localStorage.setItem(cityInput, cityInput);
  var savedCity = localStorage.getItem(cityInput);
  var savedContainer = $("#savedCities");
  var savedCityBut = $("<button>");
  savedCityBut.text(savedCity).addClass("btn btn-secondary col-12 mt-3");
  // .setAttr();
  savedContainer.append(savedCityBut);

  //create a variable that combines api url with city + key
  var weatherKey = "5255530bf1f1204d64609824d51b20e5";
  var requestUrl = [
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityInput +
      "&units=imperial&appid=" +
      weatherKey,
  ];

  $.ajax({
    url: requestUrl,
    method: "GET",
  }).then(function (response) {
    //parse the object to glean current weather and location data
    var cityName = response.name;
    var tempData = response.main.temp;
    var windData = response.wind.speed;
    var humData = response.main.humidity;
    var lon = response.coord.lon;
    var lat = response.coord.lat;

    //display current weather data with dynamically generated elements

    //display city name
    var current = $("#currentDisplay");
    var cityShow = $("<h1>");
    cityShow.text(cityName).addClass("h1");
    current.append(cityShow);

    //display temp
    var tempShow = $("<h3>");
    tempShow.text("Temp: " + tempData + " °F").addClass("h3 clear");
    current.append(tempShow);

    //display wind
    var windShow = $("<h3>");
    windShow.text("Wind: " + windData + " MPH").addClass("h3 clear");
    current.append(windShow);

    //display humidity
    var humShow = $("<h3>");
    humShow.text("Humidity: " + humData + "%").addClass("h3 clear");
    current.append(humShow);

    //display UV index (color)

    //create a variable that combines 5day api url with city + key
    var requestUrlOneCall = [
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" +
        weatherKey,
    ];
    //fetch the 5 day forecast and current uvi data
    $.ajax({
      url: requestUrlOneCall,
      method: "GET",
    }).then(function (responseOneCall) {
      console.log(responseOneCall);
      //-----------------------UVI------------------
      //parse uvi value
      var uviData = responseOneCall.daily[0].uvi;
      console.log(uviData);

      var uviShow = $("<h3>");
      uviShow.text("UV Index: " + uviData).addClass("h3");
      current.append(uviShow);

      //if else (uvi < 2) = favorable \\ 3-5 yellow// 6,7 orange \\ 8-10 red \\ 11+ purple

      //------------------5 day---------------------
      var daily = responseOneCall.daily;

      console.log(daily);

      var forecast = $("#forecastDisplay");

      //generate elements for [date, icon, temp, wind, humidity]
      //   for (var i = 1; i < 5; i++) {
      //     var dateFive = $("<h3>");
      //     var iconFive = $("");
      //     var tempFive = $("<h4>");
      //     var windFive = $("<h4>");
      //     var humFive = $("<h4>");

      //     dateFive.text();
      //     iconFive.text();
      //     tempFive
      //       .text("Temp: " + responseOneCall.daily[i].temp.max + " °F")
      //       .addClass("h4");
      //     forecast.append(tempFive);
      //   }

      //display the 5 day forecast
    });
  });
});

//add city name to local storage so we can create a button for future searches
