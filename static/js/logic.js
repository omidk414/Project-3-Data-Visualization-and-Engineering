// Initialize the map
var map = L.map('map').setView([20, 0], 2);  // Center the map

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Load and display GeoJSON data
fetch("/data/countries")
    .then(response => response.json())
    .then(data => {
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
    var filePath = `/data/medal_data/${year}`;

    fetch(filePath)
        .then(response => response.json())
        .then(medalData => {
            if (window.shadedCountries) {
                window.shadedCountries.clearLayers();
            }

            window.shadedCountries = L.geoJson(window.geoJsonData, {
                style: function(feature) {
                    var medalCount = medalData.find(d => d.Country_Name === feature.properties.name)?.Total_Medals || 0;
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
    if (window.legend) {
        map.removeControl(window.legend);
    }

    window.legend = L.control({position: 'bottomright'});

    window.legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [1, 5, 10, 20, 50],
            labels = [];

        div.innerHTML += '<b>Medal Count</b><br>';

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
