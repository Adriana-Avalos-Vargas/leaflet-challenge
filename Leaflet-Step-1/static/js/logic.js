// Create a map object
//Lets read the geojson
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"//&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {

  layer.bindPopup("<h3>" + feature.properties.place +
   "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  };
  
  //

  //Marker characteristics
  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: style,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  
  //return color based on value
  function getValue(x) {
    return x > 7 ? "#800026" :
          x > 6.5 ? "#BD0026" :
          x > 6 ? "#E31A1C" :
          x > 5.5 ? "#FC4E2A" :
          x > 5 ? "#FD8D3C" :
          x > 4.5 ? "#FEB24C" :
          x > 4 ? "#FED976" :
            "#FFEDA0";
  }

    // style function 
    function style(feature) {
      return {
        "color": getValue(feature.properties.mag),
        "stroke": false
      };
    }
  
  
      // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature
  // });
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        var mypopup = L.popup().setContent("latlng: " + latlng);
        var mymarker = L.circleMarker(latlng, geojsonMarkerOptions, style(feature));
  
        mymarker.bindPopup(mypopup);
        return mymarker;               
    }
  });
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
