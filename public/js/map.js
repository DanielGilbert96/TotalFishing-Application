//map.js

//Set up some of our variables.
var map; //Will contain map object.
var marker = false; ////Has the user plotted their location marker?

//Function called to initialize / create the map.
//This is called when the page has loaded.
function initMap() {

  //The center location of our map.
  var centerOfMap = new google.maps.LatLng(52.357971, -6.516758);

  //Map options.
  var options = {
    center: centerOfMap, //Set center.
    zoom: 7 //The zoom value.
  };

  //Create the map object.
  map = new google.maps.Map(document.getElementById('map'), options);

  //Listen for any clicks on the map.
  google.maps.event.addListener(map, 'click', function(event) {
    //Get the location that the user clicked.
    var clickedLocation = event.latLng;
    //If the marker hasn't been added.
    if (marker === false) {
      //Create the marker.
      marker = new google.maps.Marker({
        position: clickedLocation,
        map: map,
        draggable: true //make it draggable
      });
      //Listen for drag events!
      google.maps.event.addListener(marker, 'dragend', function(event) {
        markerLocation();
      });
    } else {
      //Marker has already been added, so just change its location.
      marker.setPosition(clickedLocation);
    }
    getReverseGeocodingData();
  });
}


function getReverseGeocodingData(lat, lng) {

  var currentLocation = marker.getPosition();
  var latlng = new google.maps.LatLng(currentLocation.lat(), currentLocation.lng());
  // This is making the Geocode request
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'latLng': latlng
  }, function(results, status) {
    if (status !== google.maps.GeocoderStatus.OK) {
      alert(status);
    }
    // This is checking to see if the Geoeode Status is OK before proceeding
    if (status == google.maps.GeocoderStatus.OK) {
      var address = (results[1].formatted_address);
      var city = (results[0].address_components[2].long_name).replace("Co. ","").replace("County","").replace("Meath","Navan").replace("Westmeath", "fore");
      console.log(city);
      document.getElementById('location').value = address;
      document.getElementById('city').value = city;
    }
  });
}

//Load the map when the page has finished loading.
google.maps.event.addDomListener(window, 'load', initMap);
