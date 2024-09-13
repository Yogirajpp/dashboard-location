import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import './MapComponent.css'; // Import the CSS file

// Map container style
const mapContainerStyle = {
    height: '100%',
    width: '100%'
};

// Center position of the map
const center = {
    lat: 23.031129, // Default center
    lng: 72.529016
};

const MapComponent = () => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [driverAddress, setDriverAddress] = useState('');
    const [infoWindowPosition, setInfoWindowPosition] = useState(null);

    useEffect(() => {
        // Fetch driver locations from your API
        axios.get('https://55kqzrxn-2011.inc1.devtunnels.ms/online-drivers') // Replace with your actual API endpoint
            .then(response => {
                console.log('API Response:', response.data); // Log API response to check data
                const drivers = response.data.drivers.map(driver => ({
                    ...driver,
                    driverLiveLocation: {
                        latitude: parseFloat(driver.driverLiveLocation.latitude),
                        longitude: parseFloat(driver.driverLiveLocation.longitude)
                    }
                }));
                setDrivers(drivers);
            })
            .catch(error => {
                console.error('Error fetching driver locations:', error);
            });
    }, []);

    const handleMarkerClick = async (driver) => {
        setSelectedDriver(driver);
        const { latitude, longitude } = driver.driverLiveLocation;

        // Ensure that latitude and longitude are numbers
        if (isNaN(latitude) || isNaN(longitude)) {
            console.error('Invalid latitude or longitude values');
            return;
        }

        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
            const results = response.data.results;

            if (results && results.length > 0) {
                const address = results[0].formatted_address;
                setDriverAddress(address);
            } else {
                setDriverAddress('Address not found');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            setDriverAddress('Error fetching address');
        }

        setInfoWindowPosition({ lat: latitude, lng: longitude });
    };

    return (
        <div className="map-container">
            <div className="map">
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={12}
                    >
                        {drivers.map(driver => (
                            <Marker
                                key={driver.driverId}
                                position={{
                                    lat: driver.driverLiveLocation.latitude,
                                    lng: driver.driverLiveLocation.longitude
                                }}
                                onClick={() => handleMarkerClick(driver)}
                            />
                        ))}

                        {infoWindowPosition && selectedDriver && (
                            <InfoWindow
                                position={infoWindowPosition}
                                onCloseClick={() => setInfoWindowPosition(null)}
                            >
                                <div>
                                    <h4>{selectedDriver.driverName}</h4>
                                    <p><strong>Phone:</strong> {selectedDriver.phone}</p>
                                    <p><strong>Latitude:</strong> {selectedDriver.driverLiveLocation.latitude}</p>
                                    <p><strong>Longitude:</strong> {selectedDriver.driverLiveLocation.longitude}</p>
                                    <p><strong>Address:</strong> {driverAddress}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>
            <div className="driver-details">
                {selectedDriver ? (
                    <>
                        <h2>Driver Details</h2>
                        <p><strong>Name:</strong> {selectedDriver.driverName}</p>
                        <p><strong>Phone:</strong> {selectedDriver.phone}</p>
                        <p><strong>Latitude:</strong> {selectedDriver.driverLiveLocation.latitude}</p>
                        <p><strong>Longitude:</strong> {selectedDriver.driverLiveLocation.longitude}</p>
                        <p><strong>Address:</strong> {driverAddress}</p>
                    </>
                ) : (
                    <p>Select a driver to see details</p>
                )}
            </div>
        </div>
    );
};

export default MapComponent;
