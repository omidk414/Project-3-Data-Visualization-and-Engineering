// Initialize the map
var map = L.map('map').setView([20, 0], 2);  // Center the map

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Load and display GeoJSON data
d3.json("/static/data/countries.geo.json").then(function(data) {
    // Store GeoJSON data globally to use later for filtering
    window.geoJsonData = data;

    // Add initial GeoJSON layer
    L.geoJson(data, {
        style: function(feature) {
            return {
                fillColor: '#ccc', // Default color
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.name + "</h3>");
        }
    }).addTo(map);

    // Initial data load
    loadData(1896);
});

// Load and display shaded countries for the selected year
function loadData(year) {
    var filePath = `/static/data/medal_data/medal_data_${year}.json`;

    d3.json(filePath).then(function(medalData) {
        // Clear existing layers if needed
        if (window.shadedCountries) {
            window.shadedCountries.clearLayers();
        }

        // Create a new layer group for shaded countries
        window.shadedCountries = L.geoJson(window.geoJsonData, {
            style: function(feature) {
                // Get the medal count for the country
                var medalCount = medalData.find(d => d.Country_Name === feature.properties.name)?.Total_Medals || 0;

                // Define color based on medal count
                return {
                    fillColor: getColor(medalCount),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup("<h3>" + feature.properties.name + "</h3><p>Medal Count: " + (medalData.find(d => d.Country_Name === feature.properties.name)?.Total_Medals || '0') + "</p>");
            }
        }).addTo(map);

        // Update the legend
        updateLegend(medalData);
    });
}

// Define color scale
function getColor(medalCount) {
    return medalCount > 50 ? '#800026' :
           medalCount > 20 ? '#BD0026' :
           medalCount > 10 ? '#E31A1C' :
           medalCount > 5  ? '#FC4E2A' :
           medalCount > 1  ? '#FD8D3C' :
                             '#FED976';
}

// Update legend based on medal count
function updateLegend(medalData) {
    // Remove existing legend if present
    if (window.legend) {
        map.removeControl(window.legend);
    }

    window.legend = L.control({position: 'bottomright'});

    window.legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [1, 5, 10, 20, 50],
            labels = [];

        // Add legend title
        div.innerHTML += '<b>Medal Count</b><br>';

        // Loop through the grades and add color boxes
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    window.legend.addTo(map);
}

// Handle slider input
document.getElementById("year-slider").addEventListener("input", function() {
    var year = this.value;
    document.getElementById("year-display").textContent = year;
    document.getElementById("year-input").value = year; // Sync input box with slider
    loadData(year);
});

// Handle enter key press in the input box
document.getElementById("year-input").addEventListener("keypress", function(e) {
    if (e.key === 'Enter') {
        var year = this.value;
        if (year >= 1896 && year <= 2020 && year % 4 === 0) {
            document.getElementById("year-slider").value = year; // Sync slider with input box
            document.getElementById("year-display").textContent = year;
            loadData(year);
        } else {
            alert("Please enter a valid Olympic year.");
        }
    }
});
