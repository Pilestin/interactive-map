// This file contains configuration settings for the map, such as initial center coordinates, zoom levels, and layer options.

const mapConfig = {
    initialView: {
        center: [39.776, 30.514], // Initial center coordinates
        zoom: 15 // Initial zoom level
    },
    layers: {
        baseLayer: {
            name: "CartoDB Light",
            url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
            minZoom: 0
        },
        additionalLayers: [
            {
                name: "OpenStreetMap",
                url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                minZoom: 0
            }
        ]
    },
    drawingOptions: {
        lineStyles: {
            solid: {
                color: "#000000", // Default color for solid lines
                dashArray: null // No dashes for solid lines
            },
            dotted: {
                color: "#FF0000", // Default color for dotted lines
                dashArray: "5, 5" // Dotted line style
            }
        }
    }
};

export default mapConfig;