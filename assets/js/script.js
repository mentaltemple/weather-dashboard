//VARIABLE DECLARATIONS

//FUNCTIONS

//fetch api function

//EVENT HANDLERS

//listen for click from search button
$("#searchBtn").on("click", function () {
  var city = $("#citySearch").val();
  console.log(city);
  //clear input field

  //create a variable that combines api url with city + key
  var weatherKey = "5255530bf1f1204d64609824d51b20e5";
  var requestUrl = [
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      weatherKey,
  ];
  console.log(requestUrl);

  $.ajax({
    url: requestUrl,
    method: "GET",
  }).then(function (response) {
    console.log("Ajax Reponse \n-------------");
    console.log(response);
  });
});

//add city name to local storage so we can create a button for future searches
