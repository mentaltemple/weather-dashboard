//VARIABLE DECLARATIONS

//FUNCTIONS

//EVENT HANDLERS

//display the saved city searches in buttons upon page load
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

//____________________________________________________________________
//----------------------SEARCH BUTTON----------------------------------
//____________________________________________________________________

//event listener for click from search button
$("#searchBtn").on("click", function () {
  var emptyCheck = $("#citySearch").val();

  if (emptyCheck === "") {
    alert("Please enter a city");
  } else {
    var cityInput = $("#citySearch").val();

    //clear input field
    $("#citySearch").val("");

    //clear displayed data
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
    //fetch api promise object
    $.ajax({
      url: requestUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      var check1 = response.hasOwnProperty("name"); // => true
      var check2 = response.visibility;
      var check3 = "undefined";
      var check4 = check2 == check3;

      console.log(check1);
      console.log(check2);
      console.log(check3);
      console.log(check4);

      if (check2 > 0.1) {
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

        //select the currentDisplay section
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

        //display icon
        var iconShow = $("<img>");
        iconShow
          .attr(
            "src",
            "http://openweathermap.org/img/wn/" + iconData + "@2x.png"
          )
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

        //save city to local storage and create a button with saved city name

        //****NEED TO COMPARE WITH LOCAL STORAGE TO PREVENT DUP BUTTONS */
        localStorage.setItem(cityName, cityName);
        var savedCity = localStorage.getItem(cityInput);
        var savedContainer = $("#search");
        var savedCityBut = $("<button>");
        savedCityBut
          .text(cityName)
          .addClass("btn btn-secondary col-12 mb-3")
          .attr("id", "searchCityBtn");
        // .setAttr();
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
          //parse uvi value
          var uviData = responseOneCall.daily[0].uvi;

          var uviShow = $("<h3>");
          uviShow
            .text("UV Index: " + uviData)
            .addClass("h3 border rounded text-white fit-content p-2");

          //display UV index (color)
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

          //if else uvi < 2 = favorable
          // 3-5 yellow
          // 6,7 orange
          // 8-10 red
          // 11+ purple
          dayCard.append(uviShow);

          //------------------5 day---------------------
          var daily = responseOneCall.daily;

          dailySliced = daily.slice(1, 6);

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
              "card bg-dark rounded border-info text-white m-2 p-2 col-lg-2"
            );
            forecast.append(fiveDayCard);

            //display date
            var dateShowFive = $("<h1>");
            dateShowFive.text(dateDataFive).addClass("h4");
            fiveDayCard.append(dateShowFive);

            //display icon
            var iconShowFive = $("<img>");
            iconShowFive
              .attr(
                "src",
                "http://openweathermap.org/img/wn/" + iconDataFive + "@2x.png"
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

            //display wind
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

          //display current weather data with dynamically generated elements

          //----------------------
        });
      } else {
        alert("Please enter a valid city");
      }
    });
  }
});

//-----------------SAVED BUTTON--------------------

// click listener event on buttons from previously saved cities
$(document).on("click", "#searchCityBtn", function () {
  //clear input field
  $("#citySearch").val("");

  //clear displayed data
  $("#currentDisplay").empty();
  $("#forecastDisplay").empty();

  var savedCityName = $(this).text();
  console.log(savedCityName);

  var weatherKey = "5255530bf1f1204d64609824d51b20e5";
  var requestUrl = [
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      savedCityName +
      "&units=imperial&appid=" +
      weatherKey,
  ];

  $.ajax({
    url: requestUrl,
    method: "GET",
  }).then(function (response2) {
    var cityName = response2.name;
    var dateData = moment().format("l");
    //show weather icon
    var iconData = response2.weather[0].icon;
    var tempData = response2.main.temp;
    var windData = response2.wind.speed;
    var humData = response2.main.humidity;
    var lon = response2.coord.lon;
    var lat = response2.coord.lat;

    var current = $("#currentDisplay");

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

    //display icon
    var iconShow = $("<img>");
    iconShow
      .attr("src", "http://openweathermap.org/img/wn/" + iconData + "@2x.png")
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

    console.log(response2);

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
          "card bg-dark rounded border-info text-white m-2 p-2 col-lg-2"
        );
        forecast.append(fiveDayCard);

        //display date
        var dateShowFive = $("<h1>");
        dateShowFive.text(dateDataFive).addClass("h4");
        fiveDayCard.append(dateShowFive);

        //display icon
        var iconShowFive = $("<img>");
        iconShowFive
          .attr(
            "src",
            "http://openweathermap.org/img/wn/" + iconDataFive + "@2x.png"
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

      console.log(tempData);
      //display current weather data with dynamically generated elements

      //----------------------
    });
  });
});
