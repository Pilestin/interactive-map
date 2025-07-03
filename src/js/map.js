// This file initializes the map using the CartoDB light layer and other layers. 
// It sets up the map view, adds tile layers, and handles map events.

var map = L.map('map').setView([39.776, 30.514], 15);

// Define base layers
var cartoDBLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
});

var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

var cartoDBDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
});

var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Add default layer
cartoDBLight.addTo(map);

// Layer control
var baseLayers = {
    "CartoDB Light": cartoDBLight,
    "OpenStreetMap": openStreetMap,
    "CartoDB Dark": cartoDBDark,
    "Satellite": satellite
};

L.control.layers(baseLayers).addTo(map);

// Initialize feature groups for different types of drawings
var drawnItems = new L.FeatureGroup();
var pointsLayer = new L.FeatureGroup();
var routesLayer = new L.FeatureGroup();

map.addLayer(drawnItems);
map.addLayer(pointsLayer);
map.addLayer(routesLayer);

// Drawing state variables
var drawingMode = null; // 'point' or 'route'
var currentPolyline = null;
var routePoints = [];

// Handle map events
map.on('click', function(e) {
    console.log('Map clicked, mode:', drawingMode);
    if (drawingMode === 'point') {
        addPoint(e.latlng);
    } else if (drawingMode === 'route') {
        addRoutePoint(e.latlng);
    }
});

// Function to add a point marker (simple circle)
function addPoint(latlng) {
    const color = getCurrentColor();
    
    // Create simple circle marker
    const marker = L.circleMarker(latlng, {
        radius: 10,
        fillColor: color,
        color: '#132123',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    });
    
    // Add popup
    marker.bindPopup(`<b>Point</b><br>Koordinat: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}<br>Renk: ${color}`);
    
    // Add to map
    pointsLayer.addLayer(marker);
    
    // Save to manager with correct function
    if (window.storePoint) {
        window.storePoint({
            type: 'point',
            coordinates: [latlng.lat, latlng.lng],
            color: color,
            timestamp: new Date()
        });
    }
    
    console.log('Point added successfully at:', latlng, 'color:', color);
    
    // Show success notification
    showTempNotification(`Point eklendi! Renk: ${color}`, 'success');
}

// Function to add route point
function addRoutePoint(latlng) {
    routePoints.push(latlng);
    
    if (routePoints.length === 1) {
        // First point - create new polyline with current settings
        const style = getLineStyle();
        currentPolyline = L.polyline([latlng], style);
        
        // Save the original style so it won't change
        currentPolyline._originalStyle = {
            color: style.color,
            weight: style.weight,
            dashArray: style.dashArray,
            style: getCurrentLineStyle()
        };
        
        routesLayer.addLayer(currentPolyline);
        console.log('Route started with style:', style);
        
    } else {
        // Add point to existing route
        currentPolyline.addLatLng(latlng);
        console.log('Point added to route, total points:', routePoints.length);
    }
    
    showTempNotification(`Rota noktası eklendi (${routePoints.length}). Enter ile bitirin.`, 'info');
}

// Function to get current line style
function getLineStyle() {
    const color = getCurrentColor();
    const width = getCurrentWidth();
    const style = getCurrentLineStyle();
    
    let dashArray = null;
    switch(style) {
        case 'dashed':
            dashArray = '10, 5';
            break;
        case 'dotted':
            dashArray = '2, 6';
            break;
        default:
            dashArray = null;
    }
    
    return {
        color: color,
        weight: width,
        opacity: 0.8,
        dashArray: dashArray
    };
}

// Helper functions to get current settings
function getCurrentColor() {
    const colorPicker = document.getElementById('color-picker');
    return colorPicker ? colorPicker.value : '#ff0000';
}

function getCurrentWidth() {
    const widthSlider = document.getElementById('line-width');
    return widthSlider ? parseInt(widthSlider.value) : 4;
}

function getCurrentLineStyle() {
    const styleSelect = document.getElementById('line-style');
    return styleSelect ? styleSelect.value : 'solid';
}

// Function to finish current route
function finishRoute() {
    if (routePoints.length > 1 && currentPolyline && window.addRoute) {
        const originalStyle = currentPolyline._originalStyle;
        
        window.addRoute({
            type: 'route',
            points: routePoints.map(p => [p.lat, p.lng]),
            color: originalStyle.color,
            width: originalStyle.weight,
            style: originalStyle.style,
            timestamp: new Date()
        });
        
        console.log('Route finished with', routePoints.length, 'points');
        showTempNotification(`Rota tamamlandı! ${routePoints.length} nokta`, 'success');
    }
    
    // Reset route variables
    routePoints = [];
    currentPolyline = null;
}

// Function to show temporary notification
function showTempNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 10px 15px;
        border-radius: 5px;
        color: white;
        font-size: 14px;
        z-index: 2000;
        max-width: 300px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ${type === 'success' ? 'background-color: #28a745;' : 
          type === 'error' ? 'background-color: #dc3545;' : 
          'background-color: #007cba;'}
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2000);
}

// Function to clear the map
function clearMap() {
    drawnItems.clearLayers();
    pointsLayer.clearLayers();
    routesLayer.clearLayers();
    routePoints = [];
    currentPolyline = null;
    console.log('Map cleared');
}

// Function to set drawing mode
function setDrawingMode(mode) {
    // Finish current route if switching modes
    if (drawingMode === 'route' && routePoints.length > 0) {
        finishRoute();
    }
    
    drawingMode = mode;
    console.log('Drawing mode set to:', mode);
    
    // Update cursor
    const mapContainer = document.getElementById('map');
    if (mode) {
        mapContainer.style.cursor = 'crosshair';
    } else {
        mapContainer.style.cursor = '';
    }
}

// Make variables globally available
window.map = map;
window.drawnItems = drawnItems;
window.pointsLayer = pointsLayer;
window.routesLayer = routesLayer;
window.clearMap = clearMap;
window.setDrawingMode = setDrawingMode;
window.finishRoute = finishRoute;