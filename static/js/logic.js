// Initialize the map
var map = L.map('map').setView([20, 0], 2);  // Center the map

// Add a tile layer (map background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// List of valid Olympic years
var validYears = [1896, 1900, 1904, 1908, 1912, 1920, 1924, 1928, 1932, 1936, 
                  1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 
                  1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020];

// Initialize the map with the default year
loadData(1896);

// Function to load and plot data
function loadData(year) {
    var filePath = `data/medal_data/medal_data_${year}.json`;

    d3.json(filePath).then(function(medalData) {
        d3.csv("data/World_lat_lon.csv").then(function(latLonData) {
            latLonData.forEach(function(d) {
                var countryMedals = medalData.find(m => m.Country_Name === d.Country);
                var medalCount = countryMedals ? countryMedals.Total_Medals : "N/A";
                
                L.marker([d.Lat, d.Long])
                    .bindPopup(`<h3>${d.Country}</h3><p>Medal Count: ${medalCount}</p>`)
                    .addTo(map);
            });
        });
    });
}

// Handle slider changes
document.getElementById('yearSlider').addEventListener('input', function() {
    var selectedYearIndex = this.value;
    var selectedYear = validYears[selectedYearIndex];
    document.getElementById('yearInput').value = selectedYear;
    updateMap(selectedYear);
});

// Handle input box changes
document.getElementById('yearInput').addEventListener('change', function() {
    var inputYear = parseInt(this.value);
    if (validYears.includes(inputYear)) {
        var selectedYearIndex = validYears.indexOf(inputYear);
        document.getElementById('yearSlider').value = selectedYearIndex;
        updateMap(inputYear);
    } else {
        alert("Please enter a valid Olympic year.");
        this.value = validYears[document.getElementById('yearSlider').value];
    }
});

// Enable mouse wheel to change the slider value
document.getElementById('yearSlider').addEventListener('wheel', function(event) {
    event.preventDefault();
    var currentIndex = parseInt(this.value);
    var step = event.deltaY < 0 ? 1 : -1;
    var newIndex = currentIndex + step;
    if (newIndex >= 0 && newIndex < validYears.length) {
        this.value = newIndex;
        document.getElementById('yearInput').value = validYears[newIndex];
        updateMap(validYears[newIndex]);
    }
});

// Function to update the map based on the selected year
function updateMap(year) {
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    loadData(year);
}
