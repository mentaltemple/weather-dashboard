//FUNCTIONS
//display the saved city searches in buttons upon page load
function renderButtons() {
  $("#search").empty();
  for (var i = 0; i < localStorage.length; i++) {
    var savedCityList = localStorage.getItem(localStorage.key(i));

    var savedContainer = $("#search");
    var savedCityBut = $("<button>");
    savedCityBut
      .text(savedCityList)
      .addClass("btn btn-secondary col-12 mb-3")
      .attr("id", "searchCityBtn");
    savedContainer.append(savedCityBut);
  }
}
renderButtons();

$(document).ajaxError(function (event, request, settings) {
  alert("Please enter a valid city");
});

//EVENT HANDLERS

//----------------------SEARCH BUTTON----------------------------------

//event listener for click from search button
$("#searchBtn").on("click", function () {
  var emptyCheck = $("#citySearch").val();

  //check for empty input field
  if (emptyCheck === "") {
    alert("Please enter a city");
  } else {
    var cityInput = $("#citySearch").val();

    //clear input field after submission
    $("#citySearch").val("");

    //clear previously displayed data
    $("#currentDisplay").empty();
    $("#forecastDisplay").empty();

    //create a variable that combines api url with city name input + key
    var weatherKey = "5255530bf1f1204d64609824d51b20e5";
    var requestUrl = [
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityInput +
        "&units=imperial&appid=" +
        weatherKey,
    ];

    //fetch api promise object using jQuery ajax method
    $.ajax({
      url: requestUrl,
      method: "GET",
    }).then(function (response) {
      //parse the returned object to glean current weather and location data
      var cityName = response.name;
      var dateData = moment().format("l");
      var iconData = response.weather[0].icon;
      var tempData = Math.round(response.main.temp);
      var windData = Math.round(response.wind.speed);
      var humData = response.main.humidity;
      var lon = response.coord.lon;
      var lat = response.coord.lat;

      //display current weather data with dynamically generated elements

      //select the currentDisplay section using jQuery
      var current = $("#currentDisplay");

      //create card for current display
      var dayCard = $("<div>").addClass("card-body border mt-3");
      current.append(dayCard);

      //display city name
      var cityShow = $("<h1>");
      cityShow.text(cityName).addClass("h1");
      dayCard.append(cityShow);

      //display date
      var dateShow = $("<h1>");
      dateShow.text(dateData).addClass("h3");
      dayCard.append(dateShow);

      //display weather icon
      var iconShow = $("<img>");
      iconShow
        .attr(
          "src",
          "https://openweathermap.org/img/wn/" + iconData + "@2x.png"
        )
        .addClass("");
      dayCard.append(iconShow);

      //display temp
      var tempShow = $("<h3>");
      tempShow.text("Temp: " + tempData + " °F").addClass("h3 clear");
      dayCard.append(tempShow);

      //display wind speed
      var windShow = $("<h3>");
      windShow.text("Wind: " + windData + " MPH").addClass("h3 clear");
      dayCard.append(windShow);

      //display humidity
      var humShow = $("<h3>");
      humShow.text("Humidity: " + humData + "%").addClass("h3 clear");
      dayCard.append(humShow);

      //save city to local storage

      //****NEED TO COMPARE WITH LOCAL STORAGE TO PREVENT DUP BUTTONS */
      localStorage.setItem(cityName, cityName);

      renderButtons();

      //create a button with saved city name
      // var savedContainer = $("#search");
      // var savedCityBut = $("<button>");
      // savedCityBut
      //   .text(cityName)
      //   .addClass("btn btn-secondary col-12 mb-3")
      //   .attr("id", "searchCityBtn");

      savedContainer.append(savedCityBut);

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
        //-----------------------UVI------------------
        //get uvi value
        var uviData = responseOneCall.daily[0].uvi;

        //create UVI element
        var uviShow = $("<h3>");
        uviShow
          .text("UV Index: " + uviData)
          .addClass("h3 border rounded text-white fit-content p-2");

        //display UV index with color
        if (uviData <= 2) {
          uviShow.addClass("bg-success");
        } else if (uviData >= 3 && uviData < 6) {
          uviShow.addClass("bg-yellow text-dark");
        } else if (uviData >= 6 && uviData < 8) {
          uviShow.addClass("bg-orange");
        } else if (uviData >= 8 && uviData < 11) {
          uviShow.addClass("bg-danger");
        } else if (uviData >= 11) {
          uviShow.addClass("bg-purple");
        }

        dayCard.append(uviShow);

        //------------------5 DAY FORECAST---------------------
        //store forecast data in variable, currently 8 days
        var daily = responseOneCall.daily;

        //slice next 5 days from array
        dailySliced = daily.slice(1, 6);

        //store data in variables for 5day
        for (var i = 0; i < dailySliced.length; i++) {
          var dateDataFive = moment.unix(dailySliced[i].dt).format("l");
          var iconDataFive = dailySliced[i].weather[0].icon;
          var tempDataFive = Math.round(dailySliced[i].temp.max);
          var windDataFive = Math.round(dailySliced[i].wind_speed);
          var humDataFive = dailySliced[i].humidity;
          var forecast = $("#forecastDisplay");

          //create card to nest below 5 day elements
          var fiveDayCard = $("<div>").addClass(
            "card bg-dark rounded border-info text-white m-2 p-2 col-lg-2"
          );
          forecast.append(fiveDayCard);

          //display date
          var dateShowFive = $("<h1>");
          dateShowFive.text(dateDataFive).addClass("h4");
          fiveDayCard.append(dateShowFive);

          //display weather icon
          var iconShowFive = $("<img>");
          iconShowFive
            .attr(
              "src",
              "https://openweathermap.org/img/wn/" + iconDataFive + "@2x.png"
            )
            .attr("height", "100px")
            .attr("width", "100px");
          fiveDayCard.append(iconShowFive);

          //display temp
          var tempShowFive = $("<h3>");
          tempShowFive
            .text("Temp: " + tempDataFive + " °F")
            .addClass("h6 clear");
          fiveDayCard.append(tempShowFive);

          //display wind speed
          var windShowFive = $("<h3>");
          windShowFive
            .text("Wind: " + windDataFive + " MPH")
            .addClass("h6 clear");
          fiveDayCard.append(windShowFive);

          //display humidity
          var humShowFive = $("<h3>");
          humShowFive
            .text("Humidity: " + humDataFive + "%")
            .addClass("h6 clear");
          fiveDayCard.append(humShowFive);
        }
      });
    });
  }
});

//-----------------SAVED BUTTONS--------------------

// click listener event on buttons from previously saved cities
$(document).on("click", "#searchCityBtn", function () {
  //clear input field
  $("#citySearch").val("");

  //clear previously displayed data
  $("#currentDisplay").empty();
  $("#forecastDisplay").empty();

  //store city name from button in variable
  var savedCityName = $(this).text();

  //combine city name with api link
  var weatherKey = "5255530bf1f1204d64609824d51b20e5";
  var requestUrl = [
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      savedCityName +
      "&units=imperial&appid=" +
      weatherKey,
  ];
  //pull api data with stored city name
  $.ajax({
    url: requestUrl,
    method: "GET",
  }).then(function (response2) {
    //store data in variables
    var cityName = response2.name;
    var dateData = moment().format("l");
    var iconData = response2.weather[0].icon;
    var tempData = Math.round(response2.main.temp);
    var windData = Math.round(response2.wind.speed);
    var humData = response2.main.humidity;
    var lon = response2.coord.lon;
    var lat = response2.coord.lat;

    var current = $("#currentDisplay");

    //create card to nest elements
    var dayCard = $("<div>").addClass("card-body border mt-3");
    current.append(dayCard);

    //display city name
    var cityShow = $("<h1>");
    cityShow.text(cityName).addClass("h1");
    dayCard.append(cityShow);

    //display date
    var dateShow = $("<h1>");
    dateShow.text(dateData).addClass("h3");
    dayCard.append(dateShow);

    //display weather icon
    var iconShow = $("<img>");
    iconShow
      .attr("src", "https://openweathermap.org/img/wn/" + iconData + "@2x.png")
      .addClass("");
    dayCard.append(iconShow);

    //display temp
    var tempShow = $("<h3>");
    tempShow.text("Temp: " + tempData + " °F").addClass("h3 clear");
    dayCard.append(tempShow);

    //display wind
    var windShow = $("<h3>");
    windShow.text("Wind: " + windData + " MPH").addClass("h3 clear");
    dayCard.append(windShow);

    //display humidity
    var humShow = $("<h3>");
    humShow.text("Humidity: " + humData + "%").addClass("h3 clear");
    dayCard.append(humShow);

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
      uviShow
        .text("UV Index: " + uviData)
        .addClass("h3 border rounded text-white fit-content p-2");

      if (uviData <= 2) {
        uviShow.addClass("bg-success");
      } else if (uviData >= 3 && uviData < 6) {
        uviShow.addClass("bg-yellow text-dark");
      } else if (uviData >= 6 && uviData < 8) {
        uviShow.addClass("bg-orange");
      } else if (uviData >= 8 && uviData < 11) {
        uviShow.addClass("bg-danger");
      } else if (uviData >= 11) {
        uviShow.addClass("bg-purple");
      }

      dayCard.append(uviShow);

      //------------------5 DAY SAVED CITIES---------------------
      var daily = responseOneCall.daily;

      dailySliced = daily.slice(1, 6);

      console.log(dailySliced);

      //for loop to store data in variables and generate cards for 5day
      for (var i = 0; i < dailySliced.length; i++) {
        var dateDataFive = moment.unix(dailySliced[i].dt).format("l");
        var iconDataFive = dailySliced[i].weather[0].icon;
        var tempDataFive = Math.round(dailySliced[i].temp.max);
        var windDataFive = Math.round(dailySliced[i].wind_speed);
        var humDataFive = dailySliced[i].humidity;
        var forecast = $("#forecastDisplay");

        console.log(iconDataFive);

        //create card to nest 5 day elements
        var fiveDayCard = $("<div>").addClass(
          "card bg-dark rounded border-info text-white m-2 p-2 col-lg-2"
        );
        forecast.append(fiveDayCard);

        //display date
        var dateShowFive = $("<h1>");
        dateShowFive.text(dateDataFive).addClass("h4");
        fiveDayCard.append(dateShowFive);

        //display weather icon
        var iconShowFive = $("<img>");
        iconShowFive
          .attr(
            "src",
            "https://openweathermap.org/img/wn/" + iconDataFive + "@2x.png"
          )
          .attr("height", "100px")
          .attr("width", "100px");
        fiveDayCard.append(iconShowFive);

        //display temp
        var tempShowFive = $("<h3>");
        tempShowFive.text("Temp: " + tempDataFive + " °F").addClass("h6 clear");
        fiveDayCard.append(tempShowFive);

        //display wind
        var windShowFive = $("<h3>");
        windShowFive
          .text("Wind: " + windDataFive + " MPH")
          .addClass("h6 clear");
        fiveDayCard.append(windShowFive);

        //display humidity
        var humShowFive = $("<h3>");
        humShowFive.text("Humidity: " + humDataFive + "%").addClass("h6 clear");
        fiveDayCard.append(humShowFive);
      }
    });
  });
});
