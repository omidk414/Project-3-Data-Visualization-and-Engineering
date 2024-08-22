// Initialize the map
var map = L.map('map').setView([20, 0], 2);  // Center the map

// Load GeoJSON data for the map
d3.json("data/world.geo.json").then(function(data) {
    L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.name + "</h3>");
        }
    }).addTo(map);
});

// Add a tile layer (map background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Function to update the map based on the selected year
function updateMap(year) {
    // Clear existing pins
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Load and plot data for the selected year
    d3.csv("data/World_lat_lon.csv").then(function(latLonData) {
        d3.json(`data/medal_data/medal_data_${year}.json`).then(function(medalData) {
            latLonData.forEach(function(d) {
                let medalInfo = medalData.find(m => m.Country_Name === d.Country);
                let medalCount = medalInfo ? medalInfo.Total_Medals : "N/A";

                L.marker([d.Lat, d.Long])
                    .bindPopup(`<h3>${d.Country}</h3><p>Medal Count: ${medalCount}</p>`)
                    .addTo(map);
            });
        });
    });
}

// Initialize the slider with available years
var years = [1896, 1900, 1904, 1908, 1912];  // Add all years available in your JSON files

var slider = d3.select("body")
    .append("input")
    .attr("type", "range")
    .attr("min", d3.min(years))
    .attr("max", d3.max(years))
    .attr("step", 1)
    .attr("value", d3.min(years))
    .on("input", function() {
        var selectedYear = this.value;
        updateMap(selectedYear);
    });

// Display the current year next to the slider
d3.select("body")
    .append("div")
    .attr("id", "year-label")
    .text(d3.min(years));

// Set initial map state to the first year
updateMap(years[0]);

// Update the year label when the slider changes
slider.on("input", function() {
    var selectedYear = this.value;
    d3.select("#year-label").text(selectedYear);
    updateMap(selectedYear);
});
