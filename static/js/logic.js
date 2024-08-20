// Initialize the map
const map = L.map('map').setView([20, 0], 2);

// Add a tile layer to the map (for background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to fetch data and update the map
function updateMap(year) {
  fetch(`/data/${year}`).then(response => response.json()).then(data => {
    // Assuming the data includes geojson for countries and medal counts
    L.geoJson(data, {
      style: function (feature) {
        return {
          fillColor: getColor(feature.properties.medals),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        };
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`<h4>${feature.properties.name}</h4><p>Total Medals: ${feature.properties.medals}</p>`);
      }
    }).addTo(map);
  });
}

// Function to get color based on medals
function getColor(d) {
  return d > 100 ? '#800026' :
         d > 50  ? '#BD0026' :
         d > 20  ? '#E31A1C' :
         d > 10  ? '#FC4E2A' :
         d > 5   ? '#FD8D3C' :
         d > 0   ? '#FEB24C' :
                   '#FFEDA0';
}

// Initial load for the first year
updateMap(1896);

// Handle slider input to update year
document.getElementById('yearSlider').addEventListener('input', function(e) {
  const year = e.target.value;
  document.getElementById('selectedYear').textContent = year;
  updateMap(year);
});
