// Define red icon
var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Define default icon
var defaultIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Initialize the map
var map = L.map('map').setView([20, 0], 2);  // Center the map

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Global layer group for markers
var markersLayer = L.layerGroup().addTo(map);

// Function to load and display medal data for the selected year
function loadMedalData(year) {
    // Clear existing markers
    markersLayer.clearLayers();

    // Fetch medal data for the selected year from the Flask API
    fetch(`/data/medal_data/${year}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(country => {
                // Convert latitude and longitude to numbers
                var lat = parseFloat(country.latitude);
                var lng = parseFloat(country.longitude);

                // Choose marker icon based on whether the country is a host country
                var icon = country.host_country === 'true' ? redIcon : defaultIcon;

                // Create a marker for each country
                var marker = L.marker([lat, lng], { icon: icon })
                    .bindPopup(`<h3>${country.country_name}</h3>
                                <p>Gold: ${country.gold}</p>
                                <p>Silver: ${country.silver}</p>
                                <p>Bronze: ${country.bronze}</p>
                                <p>Total: ${country.total_medals}</p>`);
                marker.addTo(markersLayer);
            });
        })
        .catch(error => {
            console.error('Error loading medal data:', error);
        });
}

// Handle slider input to load data for the selected year
document.getElementById("year-slider").addEventListener("input", function() {
    var year = this.value;
    document.getElementById("year-display").textContent = year;
    document.getElementById("year-input").value = year;
    loadMedalData(year);
});

// Handle enter key press in the input box
document.getElementById("year-input").addEventListener("keypress", function(e) {
    if (e.key === 'Enter') {
        var year = parseInt(this.value, 10);  // Convert to integer
        if (year >= 1896 && year <= 2020 && year % 4 === 0) {
            document.getElementById("year-slider").value = year;
            document.getElementById("year-display").textContent = year;
            loadMedalData(year);
        } else {
            alert("Please enter a valid Olympic year.");
        }
    }
});

// Initialize slider and input with the default year
function initializeYearControls(defaultYear) {
    document.getElementById("year-slider").value = defaultYear;
    document.getElementById("year-display").textContent = defaultYear;
    document.getElementById("year-input").value = defaultYear;
}

// Initial data load for the first year and set initial values
initializeYearControls(1896);
loadMedalData(1896);
