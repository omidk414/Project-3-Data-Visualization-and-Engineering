// Initialize the map
var map = L.map('map').setView([20, 0], 2);  // Center the map

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Load and display GeoJSON data
d3.json("data/world.geo.json").then(function(data) {
    // Store GeoJSON data globally to use later for filtering
    window.geoJsonData = data;

    L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.name + "</h3>");
        }
    }).addTo(map);

    // Initial data load
    loadData(1896);
});

// Load and display markers for the selected year
function loadData(year) {
    var filePath = `data/medal_data/medal_data_${year}.json`;

    d3.json(filePath).then(function(medalData) {
        // Clear existing markers
        if (window.markers) {
            window.markers.clearLayers();
        }

        // Create a new layer group for markers
        window.markers = L.layerGroup().addTo(map);

        // Load latitude and longitude data
        d3.csv("data/World_lat_lon.csv").then(function(latLonData) {
            var medalCountries = new Set(medalData.map(d => d.Country_Name));

            latLonData.forEach(function(d) {
                if (medalCountries.has(d.Country)) {
                    L.marker([d.Lat, d.Long])
                        .bindPopup(`<h3>${d.Country}</h3><p>Medal Count: ${medalData.find(md => md.Country_Name === d.Country)?.Total_Medals || '0'}</p>`)
                        .addTo(window.markers);
                }
            });
        });
    }).catch(function(error) {
        console.error("Error loading the medal data:", error);
    });
}

// Handle slider input
document.getElementById("year-slider").addEventListener("input", function() {
    var year = this.value;
    document.getElementById("year-display").textContent = year;
    document.getElementById("year-input").value = year;
    loadData(year);
});

// Handle enter key press in the input box
document.getElementById("year-input").addEventListener("keypress", function(e) {
    if (e.key === 'Enter') {
        var year = this.value;
        if (year >= 1896 && year <= 2020 && year % 4 === 0) {
            document.getElementById("year-slider").value = year;
            document.getElementById("year-display").textContent = year;
            loadData(year);
        } else {
            alert("Please enter a valid Olympic year.");
        }
    }
});
