//VARIABLE DECLARATIONS

//FUNCTIONS

//EVENT HANDLERS

//display the saved city searches in buttons upon page load
for (var i = 0; i < localStorage.length; i++) {
  var savedCityList = localStorage.getItem(localStorage.key(i));

  console.log(savedCityList);

  var savedContainer = $("#search");
  var savedCityBut = $("<button>");
  savedCityBut
    .text(savedCityList)
    .addClass("btn btn-secondary col-12 mb-3")
    .attr("id", "searchCity");
  savedContainer.append(savedCityBut);
}

//-----------------SAVED BUTTON--------------------

//click listener event from previously saved cities
// $("#searchCity").on("click", function () {
//   //clear input field
//   $("#citySearch").val("");

//   //clear displayed data
//   $("#currentDisplay").empty();
//   $("#forecastDisplay").empty();

//   var weatherKey = "5255530bf1f1204d64609824d51b20e5";
//   var requestUrl = [
//     "https://api.openweathermap.org/data/2.5/weather?q=" +
//       savedCityName +
//       "&units=imperial&appid=" +
//       weatherKey,
//   ];

//   console.log(savedCityName);

//   $.ajax({
//     url: requestUrl,
//     method: "GET",
//   }).then(function (response2) {
//     console.log(response2);
//   });
// });

//----------------------SEARCH BUTTON----------------------------------

//event listener for click from search button
$("#searchBtn").on("click", function () {
  var cityInput = $("#citySearch").val();

  //display current weather section

  //clear input field
  $("#citySearch").val("");

  //clear displayed data
  $("#currentDisplay").empty();
  $("#forecastDisplay").empty();

  //save city to local storage and create a button with saved city name
  localStorage.setItem(cityInput, cityInput);
  var savedCity = localStorage.getItem(cityInput);
  var savedContainer = $("#search");
  var savedCityBut = $("<button>");
  savedCityBut
    .text(savedCity)
    .addClass("btn btn-secondary col-12 mb-3")
    .attr("id", "searchCity");
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
    console.log(response);
    //parse the object to glean current weather and location data
    var cityName = response.name;
    var dateData = moment().format("l");
    //show weather icon
    var iconData = response.weather[0].icon;
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

    //display date
    var dateShow = $("<h1>");
    dateShow.text(dateData).addClass("h1");
    current.append(dateShow);

    //display icon
    var iconShow = $("<img>");
    iconShow
      .attr("src", "http://openweathermap.org/img/wn/" + iconData + "@2x.png")
      .addClass("");
    current.append(iconShow);

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

      var uviShow = $("<h3>");
      uviShow.text("UV Index: " + uviData).addClass("h3");
      current.append(uviShow);

      //if else (uvi < 2) = favorable \\ 3-5 yellow// 6,7 orange \\ 8-10 red \\ 11+ purple

      //------------------5 day---------------------
      var daily = responseOneCall.daily;

      dailySliced = daily.slice(1, 6);

      console.log(dailySliced);

      //store relevant data in variables for 5day
      //   var cityName = dailySliced[i].name; pull from above**

      for (var i = 0; i < dailySliced.length; i++) {
        var dateDataFive = moment.unix(dailySliced[i].dt).format("l");
        var iconDataFive = dailySliced[i].weather[0].icon;
        var tempDataFive = dailySliced[i].temp.max;
        var windDataFive = dailySliced[i].wind_speed;
        var humDataFive = dailySliced[i].humidity;
        var forecast = $("#forecastDisplay");

        console.log(iconDataFive);

        //create card to nest below items inside of
        var fiveDayCard = $("<div>").addClass(
          "card bg-dark rounded border-info text-white m-2 p-3"
        );
        forecast.append(fiveDayCard);

        //display date
        var dateShowFive = $("<h1>");
        dateShowFive.text(dateDataFive).addClass("h2");
        fiveDayCard.append(dateShowFive);

        //display icon
        var iconShowFive = $("<img>");
        iconShowFive.attr(
          "src",
          "http://openweathermap.org/img/wn/" + iconDataFive + "@2x.png"
        );
        // .addClass("h-25 w-25");
        fiveDayCard.append(iconShowFive);

        //display temp
        var tempShowFive = $("<h3>");
        tempShowFive.text("Temp: " + tempDataFive + " °F").addClass("h4 clear");
        fiveDayCard.append(tempShowFive);

        //display wind
        var windShowFive = $("<h3>");
        windShowFive
          .text("Wind: " + windDataFive + " MPH")
          .addClass("h4 clear");
        fiveDayCard.append(windShowFive);

        //display humidity
        var humShowFive = $("<h3>");
        humShowFive.text("Humidity: " + humDataFive + "%").addClass("h4 clear");
        fiveDayCard.append(humShowFive);
      }

      console.log(tempData);
      //display current weather data with dynamically generated elements

      //----------------------
    });
  });
});
