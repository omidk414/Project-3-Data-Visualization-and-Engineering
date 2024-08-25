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
                // Create a marker for each country
                var marker = L.marker([country.latitude, country.longitude])
                    .bindPopup(`<h3>${country.country_name}</h3>
                                <p>Gold: ${country.Gold}</p>
                                <p>Silver: ${country.Silver}</p>
                                <p>Bronze: ${country.Bronze}</p>
                                <p>Total: ${country.Total_Medals}</p>`);
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
        var year = this.value;
        if (year >= 1896 && year <= 2020 && year % 4 === 0) {
            document.getElementById("year-slider").value = year;
            document.getElementById("year-display").textContent = year;
            loadMedalData(year);
        } else {
            alert("Please enter a valid Olympic year.");
        }
    }
});

// Initial data load for the first year
loadMedalData(1896);
