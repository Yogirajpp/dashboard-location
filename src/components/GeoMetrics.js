import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import axios from 'axios';
import './MapComponent.css'; // Add your CSS file for styling

const HeatmapLayer = ({ data }) => {
    const map = useMap();

    useEffect(() => {
        if (data.length > 0) {
            // Remove existing heatmap layer if present
            const existingHeatmapLayer = map._layers
                ? Object.values(map._layers).find(layer => layer instanceof L.HeatLayer)
                : null;
            if (existingHeatmapLayer) {
                map.removeLayer(existingHeatmapLayer);
            }

            L.heatLayer(data, { radius: 20, blur: 35, maxZoom: 15 }).addTo(map);
        }
    }, [data, map]);

    return null;
};

const GeoMetrics = () => {
    const [heatmapData, setHeatmapData] = useState([]);

    // Fetch ride clusters
    useEffect(() => {
        axios.get('https://55kqzrxn-2011.inc1.devtunnels.ms/dashboard/api/ride-distribution') // Adjust the endpoint as necessary
            .then(response => {
                const data = response.data.map(cluster => [
                    cluster.center.lat,
                    cluster.center.lng,
                    cluster.numRides
                ]);
                setHeatmapData(data);
            })
            .catch(error => {
                console.error('Error fetching ride distribution:', error);
            });
    }, []);

    return (
        <div className="geo-map-container">
            <MapContainer style={{ height: '100vh', width: '100%' }} center={[23.031129, 72.529016]} zoom={10} zoomControl={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='Map data © OpenStreetMap contributors'
                />
                <ZoomControl position="topright" />
                <HeatmapLayer data={heatmapData} />
            </MapContainer>
        </div>
    );
};

export default GeoMetrics;
