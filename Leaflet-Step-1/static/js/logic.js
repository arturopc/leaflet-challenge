// Creating map object
var myMap = L.map("map", {
    center: [38.5, -98],
    zoom: 2
  });

  // Adding tile layer to the map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  var legend = L.control({position: 'topright'});
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    var limits = ["magnitude < 5","5 < magnitude < 5.5","5.5 < magnitude"];
    var colors = [getColor(4),getColor(5.1),getColor(6)];
    limits.forEach(function (limit, i) {
        div.innerHTML +=
            '<h3 style="background:' + colors[i] + '"font-size": 10px>'+ limit +'</h3>';
    });
    return div;
  }
  legend.addTo(myMap);
 // Store API query variables
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Grab the data with d3
d3.json(baseURL, function(response) {
    // Create a new marker cluster group
    var markers = L.markerClusterGroup();
    
    // Loop through data
    for (var i = 0; i < response.features.length; i++) {
  
      // Set the data location property to a variable
      var location = response.features[i].geometry;
      var place = response.features[i].properties.place;

      var magnitude = response.features[i].properties.mag;
      magnitude = +magnitude
      // Check for location property
      if (location) {
        // Add a new marker to the cluster group and bind a pop-up
        markers.addLayer(L.circleMarker([location.coordinates[1], location.coordinates[0]], {
            radius: getRadius(magnitude),
            color: getColor(magnitude),
            opacity: 0.75,
            fillOpacity: 0.75,
            weight: 0
          })
          .bindPopup("Location: " + place + ". Magnitude: "+magnitude));
      }
    }
  
    // Add our marker cluster layer to the map
    myMap.addLayer(markers);
  
  });

  function getColor(magnitude){
      if (magnitude <= 5) {
          return "#FFF800"
      } else if (magnitude > 5 && magnitude <= 5.5) {
        return "#FFB600"
      } else {
        return "#FF0000"
      }
  }

  function getRadius(magnitude){
      if (magnitude <= 5) {
        return 30
      } else if (magnitude > 5 && magnitude <= 5.5) {
        return 40
      } else {
        return 50
      }
  }