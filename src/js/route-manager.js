// This file handles the logic for managing drawn routes and points, including storing data, updating the display, and providing functionality to clear or save items.

let drawnRoutes = [];
let drawnPoints = [];
let undoHistory = []; // Geri alma için geçmiş

function addRoute(route) {
    // Mevcut durumu geçmişe kaydet
    saveToHistory();
    
    drawnRoutes.push(route);
    console.log('Route added:', route);
    updateRouteDisplay();
}

function storePoint(point) {
    // Mevcut durumu geçmişe kaydet
    saveToHistory();
    
    drawnPoints.push(point);
    console.log('Point stored:', point);
    updateRouteDisplay();
}

function saveToHistory() {
    // Mevcut durumu kopyala
    undoHistory.push({
        routes: JSON.parse(JSON.stringify(drawnRoutes)),
        points: JSON.parse(JSON.stringify(drawnPoints)),
        timestamp: new Date()
    });
    
    // Geçmişi maksimum 20 adımla sınırla
    if (undoHistory.length > 20) {
        undoHistory.shift();
    }
}

function undo() {
    if (undoHistory.length === 0) {
        console.log('No actions to undo');
        return false;
    }
    
    // Son durumu geri yükle
    const lastState = undoHistory.pop();
    drawnRoutes = lastState.routes;
    drawnPoints = lastState.points;
    
    // Haritayı güncelle
    redrawMap();
    updateRouteDisplay();
    
    console.log('Undo completed. Remaining history:', undoHistory.length);
    
    // Bildirim göster
    if (window.showNotification) {
        window.showNotification('Son işlem geri alındı!', 'success');
    }
    
    return true;
}

function redrawMap() {
    // Haritayı temizle
    if (window.clearMap) {
        window.clearMap();
    }
    
    // Pointleri yeniden çiz
    drawnPoints.forEach(point => {
        const latlng = L.latLng(point.coordinates[0], point.coordinates[1]);
        const marker = L.circleMarker(latlng, {
            radius: 10,
            fillColor: point.color,
            color: '#132123',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });
        marker.bindPopup(`<b>Point</b><br>Koordinat: ${point.coordinates[0].toFixed(5)}, ${point.coordinates[1].toFixed(5)}<br>Renk: ${point.color}`);
        window.pointsLayer.addLayer(marker);
    });
    
    // Rotaları yeniden çiz
    drawnRoutes.forEach(route => {
        const latlngs = route.points.map(p => L.latLng(p[0], p[1]));
        
        let dashArray = null;
        switch(route.style) {
            case 'dashed':
                dashArray = '10, 5';
                break;
            case 'dotted':
                dashArray = '2, 6';
                break;
        }
        
        const polyline = L.polyline(latlngs, {
            color: route.color,
            weight: route.width,
            opacity: 0.8,
            dashArray: dashArray
        });
        
        window.routesLayer.addLayer(polyline);
    });
}

function clearRoutes() {
    // Temizlemeden önce geçmişe kaydet
    if (drawnRoutes.length > 0 || drawnPoints.length > 0) {
        saveToHistory();
    }
    
    drawnRoutes = [];
    drawnPoints = [];
    
    // Clear map layers
    if (window.clearMap) {
        window.clearMap();
    }
    
    updateRouteDisplay();
    console.log('All routes and points cleared');
}

function updateRouteDisplay() {
    // This function can be extended to update UI elements showing route/point counts
    const totalItems = drawnRoutes.length + drawnPoints.length;
    console.log(`Total items on map: ${totalItems} (${drawnPoints.length} points, ${drawnRoutes.length} routes)`);
}

function saveRoutes() {
    const data = {
        routes: drawnRoutes,
        points: drawnPoints,
        timestamp: new Date().toISOString(),
        mapCenter: window.map ? window.map.getCenter() : null,
        mapZoom: window.map ? window.map.getZoom() : null
    };
    
    try {
        // Save to localStorage
        localStorage.setItem('mapDrawings', JSON.stringify(data));
        
        // Also create downloadable file
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `map-drawings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert(`Çizimler kaydedildi! Toplam: ${drawnPoints.length} point, ${drawnRoutes.length} rota`);
        console.log('Routes and points saved successfully');
        
    } catch (error) {
        console.error('Error saving routes:', error);
        alert('Kaydetme sırasında hata oluştu!');
    }
}

function loadRoutes() {
    try {
        const savedData = localStorage.getItem('mapDrawings');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Clear current drawings
            clearRoutes();
            
            // Load points as simple circles
            if (data.points && data.points.length > 0) {
                data.points.forEach(point => {
                    const latlng = L.latLng(point.coordinates[0], point.coordinates[1]);
                    const marker = L.circleMarker(latlng, {
                        radius: 10,
                        fillColor: point.color,
                        color: 'black',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                    marker.bindPopup(`<b>Loaded Point</b><br>Koordinat: ${point.coordinates[0].toFixed(5)}, ${point.coordinates[1].toFixed(5)}<br>Renk: ${point.color}`);
                    window.pointsLayer.addLayer(marker);
                    drawnPoints.push(point);
                });
            }
            
            // Load routes with their original styles
            if (data.routes && data.routes.length > 0) {
                data.routes.forEach(route => {
                    const latlngs = route.points.map(p => L.latLng(p[0], p[1]));
                    
                    let dashArray = null;
                    switch(route.style) {
                        case 'dashed':
                            dashArray = '10, 5';
                            break;
                        case 'dotted':
                            dashArray = '2, 6';
                            break;
                    }
                    
                    const polyline = L.polyline(latlngs, {
                        color: route.color,
                        weight: route.width,
                        opacity: 0.8,
                        dashArray: dashArray
                    });
                    
                    window.routesLayer.addLayer(polyline);
                    drawnRoutes.push(route);
                });
            }
            
            // Restore map view if available
            if (data.mapCenter && data.mapZoom && window.map) {
                window.map.setView([data.mapCenter.lat, data.mapCenter.lng], data.mapZoom);
            }
            
            updateRouteDisplay();
            console.log(`✅ Loaded: ${drawnPoints.length} points, ${drawnRoutes.length} routes`);
            
        } else {
            console.log('No saved data found');
        }
    } catch (error) {
        console.error('Error loading routes:', error);
        alert('Yükleme sırasında hata oluştu!');
    }
}

function getRoutes() {
    return drawnRoutes;
}

function getPoints() {
    return drawnPoints;
}

function getStats() {
    return {
        totalRoutes: drawnRoutes.length,
        totalPoints: drawnPoints.length,
        totalItems: drawnRoutes.length + drawnPoints.length
    };
}

function canUndo() {
    return undoHistory.length > 0;
}

function getUndoCount() {
    return undoHistory.length;
}

// Make functions globally available
window.addRoute = addRoute;
window.storePoint = storePoint;
window.clearRoutes = clearRoutes;
window.saveRoutes = saveRoutes;
window.loadRoutes = loadRoutes;
window.getRoutes = getRoutes;
window.getPoints = getPoints;
window.getStats = getStats;
window.undo = undo;
window.canUndo = canUndo;
window.getUndoCount = getUndoCount;