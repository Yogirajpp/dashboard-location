import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import DriverTable from './components/DriverTable';
import GeoMetrics from './components/GeoMetrics';
import RideStatistics from './components/statistics';

function App() {
    const [selectedDriver, setSelectedDriver] = useState(null);

    const handleDriverSelect = (driver) => {
        setSelectedDriver(driver);

        // Scroll to the top of the page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="App">
            <MapComponent
                selectedDriver={selectedDriver}
                onDriverSelect={handleDriverSelect}
            />
            <DriverTable onDriverSelect={handleDriverSelect} />
            <GeoMetrics
                selectedDriver={selectedDriver}
                onDriverSelect={handleDriverSelect}
            />
            <RideStatistics />
        </div>
    );
}

export default App;
