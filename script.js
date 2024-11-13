// Initialize the map
var map = L.map('map').setView([40.20953106242784, -8.419176682463256], 15); // Coordinates for Jardim da Sereia, Coimbra

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>'
}).addTo(map);

// Custom icon for POI (Jardim da Sereia)
var poiIcon = L.icon({
    iconUrl: 'images/inicio.svg', // Replace with the path to your image for POI
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Anchor point of the icon (where the point of the marker is located)
    popupAnchor: [0, -32] // Position of the popup
});

// Add a marker for Jardim da Sereia, Coimbra with custom icon
var poiMarker = L.marker([40.20953106242784, -8.419176682463256], { icon: poiIcon }).addTo(map);
poiMarker.bindPopup(`
    <div style="text-align: center;">
        <b>Jardim da Sereia</b><br>
        <p>Escolha um horário:</p>
        <div>
            <button class="time-button" data-time="10:00">10:00</button>
            <button class="time-button" data-time="12:00">12:00</button>
            <button class="time-button" data-time="15:00">15:00</button>
        </div>
        <br>
        <button id="startRouteButton">Começar Rota</button>
    </div>
`).openPopup();

// Custom icon for User's Location
var userIcon = L.icon({
    iconUrl: 'images/arrow.svg', // Replace with the path to your image for user location
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Anchor point of the icon (where the point of the marker is located)
    popupAnchor: [0, -32] // Position of the popup
});

// Initialize the routing control (will be used later to show route)
var routeControl = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    show: false,
    addWaypoints: false,
    createMarker: function () { return null; } // Disable adding markers on the route
}).addTo(map);

var userLocation = null; // Variable to store the user's location

// Function to get the user's location
function onLocationFound(e) {
    var userMarker = L.marker(e.latlng, { icon: userIcon }).addTo(map);
    userMarker.bindPopup("<b>Your Location</b>").openPopup();
    map.setView(e.latlng, 15); // Center map to the user's location
    userLocation = e.latlng; // Store user's location for route calculation
}

// Handle error if location is not found
function onLocationError(e) {
    alert("Location access denied or failed.");
}

// Track the user's location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        onLocationFound({ latlng: L.latLng(lat, lon) });
    }, onLocationError);
} else {
    alert("Geolocation is not supported by this browser.");
}

// Function to toggle route visibility
function toggleRoute() {
    if (!isRouteVisible && userLocation) {
        routeControl.setWaypoints([userLocation, poiMarker.getLatLng()]);
        isRouteVisible = true;
    } else {
        routeControl.setWaypoints([]);
        isRouteVisible = false;
    }
}

var isRouteVisible = false;

// Add click event listener for the "Começar Rota" button
map.on('popupopen', function() {
    var startRouteButton = document.getElementById("startRouteButton");
    if (startRouteButton) {
        startRouteButton.addEventListener('click', function () {
            toggleRoute(); // Call toggleRoute function on button click
        });
    }
});
