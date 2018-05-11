function between(x, min, max) {
  return x >= min && x <= max;
}

function getWeatherData(city) {
  var key = "d0377bd518a52af18796c75df2997b2f";
  var city = city; // My test case was "London"
  var url = "https://api.openweathermap.org/data/2.5/forecast";

  $.ajax({
    url: url, //API Call
    dataType: "json",
    type: "GET",
    data: {
      q: city,
      appid: key,
      units: "metric",
      cnt: 40
    },
    success: function(data) {
      console.log('Received data:', data) // For testing
      var wf = "";
      var arr = [];
      var iter = 0;
      $.each(data.list, function(index, val) {
        if (index == 0 || index == 8 || index == 16 || index == 24 || index == 32) {
          var pressure = val.main.pressure;
          if (val.rain) {
            var rain = val.rain["3h"];
          }else {
            var rain = null;
          }
          var temp = val.main.temp;
          var clouds = val.clouds.all;
          var wind = val.wind.speed;
          var totalVal = 0;

          if (pressure <= 1000) {
            totalVal += 15;
          } else if (between(pressure, 1000, 1005)) {
            totalVal += 5;
          } else if (between(pressure, 1005, 1010)) {
            totalVal += 2;
          } else if (between(pressure, 1010, 1015)) {
            totalVal = totalVal;
          } else if (between(pressure, 1015, 1020)) {
            totalVal = totalVal - 5;
          } else if (pressure > 1020) {
            totalVal = totalVal - 20;
          }

          if (clouds == null || clouds == 0) {
            totalVal = totalVal - 10;
          } else if (between(clouds, 0, 10)) {
            totalVal = totalVal - 10;
          } else if (between(clouds, 10, 20)) {
            totalVal = totalVal - 5;
          } else if (between(clouds, 20, 30)) {
            totalVal = totalVal;
          } else if (between(clouds, 30, 40)) {
            totalVal += 2;
          } else if (between(clouds, 40, 50)) {
            totalVal += 5;
          } else if (between(clouds, 50, 60)) {
            totalVal += 7;
          } else if (between(clouds, 60, 70)) {
            totalVal += 10;
          } else if (clouds>70) {
            totalVal += 15;
          }

          if (rain == null || rain == 0) {
            totalVal += 5;
          }else if (between(rain,0.0001,1)) {
            totalVal += 2;
          }else if (between(rain,1,2)) {
            totalVal = totalVal;
          }else if (between(rain,2,3)) {
            totalVal = totalVal-10;
          }else if (rain>3) {
            totalVal = totalVal-15;
          }

          if (temp<-20) {
            totalVal = totalVal-20;
          }else if (between(temp,-20,-10)) {
            totalVal = totalVal-15;
          }else if (between(temp,-10,-5)) {
            totalVal = totalVal-10;
          }else if (between(temp,-5,0)) {
            totalVal = totalVal-5;
          }else if (between(temp,0,5)) {
            totalVal = totalVal-2;
          }else if (between(temp,5,10)) {
            totalVal = totalVal;
          }else if (between(temp,10,15)) {
            totalVal += 5;
          }else if (between(temp,15,20)) {
            totalVal += 10;
          }else if (temp>20) {
            totalVal += 5;
          }

          if (between(wind,0,5)) {
            totalVal += 10;
          }else if (between(wind,5,10)) {
            totalVal += 5;
          }else if (between(wind,10,15)) {
            totalVal += 2;
          }else if (between(wind,15,20)) {
            totalVal = totalVal;
          }else if (between(wind,20,30)) {
            totalVal = totalVal-10;
          }else if (wind>30) {
            totalVal = totalVal-20;
          }

          arr.push({
            totalVal: totalVal
          });

          wf += "<div class='col-lg-6'>"
          wf += "<div class='card border-0 box-shadow-0'>"
          wf += "<div class='card-content iter"+iter+"' style=''>"
          wf += "<div class='card-body bg-blue bg-lighten-4'>"
          wf += "<div class='animated-weather-icons text-center float-right w-25'>"
          wf += "<img src='https://openweathermap.org/img/w/" + val.weather[0].icon + ".png' class='weather-icon'>" // Icon
          wf += "</div>"
          wf += "<div class='weather-details text-center'>"
          wf += "<span class='block blue darken-2'>" + val.weather[0].description + "</span>"
          wf += "<span class='font-large-1 block blue darken-4'>" + val.main.temp + " &degC</span>"
          wf += "<span class='font-medium-4 text-bold-500 blue darken-4'>" + data.city.name + "</span>"
          wf += "</div>"
          wf += "</div>"
          wf += "<div class='card-footer p-0 border-0'>"
          wf += "<div class='table-responsive'>"
          wf += "<table class='table table-bordered mb-0'>"
          wf += "<tbody>"
          wf += "<tr>"
          wf += "<td>"
          wf += "<div class='details-left float-left'>"
          wf += "<span class='font-small-1 grey text-bold-600 block'>WIND</span>"
          wf += "<span class='text-bold-500'>" + val.wind.speed + " MPH</span>"
          wf += "</div>"
          wf += "<div class='float-right align-middle'>"
          wf += "<i class='me-wind grey lighten-1 font-large-1'></i>"
          wf += "</div>"
          wf += "</td>"
          wf += "<td>"
          wf += "<div class='details-left float-left'>"
          wf += "<span class='font-small-1 grey text-bold-600 block'>PRESSURE</span>"
          wf += "<span class='text-bold-500'>" + val.main.pressure + " &deg;</span>"
          wf += "</div>"
          wf += "<div class='float-right align-middle'>"
          wf += "<i class='me-thermometer grey lighten-1 font-large-1'></i>"
          wf += "</div>"
          wf += "</td>"
          wf += "</tr>"
          wf += "<tr>"
          wf += "<td>"
          wf += "<div class='details-left float-left'>"
          wf += "<span class='font-small-1 grey text-bold-600 block'>WIND DIRECTION</span>"
          wf += "<span class='text-bold-500'>" + val.wind.deg + "</span>"
          wf += "</div>"
          wf += "<div class='float-right align-middle'>"
          wf += "<i class='me-wind grey lighten-1 font-large-1'></i>"
          wf += "</div>"
          wf += "</td>"
          wf += "<td>"
          wf += "<div class='details-left float-left'>"
          wf += "<span class='font-small-1 grey text-bold-600 block'>DATE</span>"
          wf += "<span class='text-bold-500'>" + val.dt_txt + "</span>"
          wf += "</div>"
          wf += "<div class='float-right align-middle'>"
          wf += "<i class='me-thermometer grey lighten-1 font-large-1'></i>"
          wf += "</div>"
          wf += "</td>"
          wf += "</tr>"
          wf += "</tbody>"
          wf += "</table>"
          wf += "</div>"
          wf += "</div>"
          wf += "</div>"
          wf += "</div>"
          wf += "</div>"
          iter += 1;
        }
      });
      $("#showWeatherForcast").html(wf);
      console.log(arr);

      var max = Math.max(arr[0].totalVal,arr[1].totalVal,arr[2].totalVal,arr[3].totalVal,arr[4].totalVal)
      console.log(max);
      for (var i = 0; i < arr.length; i++) {
          if(max == arr[i].totalVal){
            console.log(arr[i]);
            card = document.querySelector('.iter'+i);
            card.style = 'border: solid; border-color: greenyellow;border-width: 15px;'
          }else {
            console.log("Nope");
          }

      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert("Weather api was unable to find location please select another location.");
      }

  });
}
