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
      $.each(data.list, function(index, val) {
        if(index==0||index==8||index==16||index==24||index==32)
        {
        wf += "<div class='col-lg-6'>"
        wf += "<div class='card border-0 box-shadow-0'>"
          wf += "<div class='card-content'>"
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
      }
      });
      $("#showWeatherForcast").html(wf);
    }
  });
}
