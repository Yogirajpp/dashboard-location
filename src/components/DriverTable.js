import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DriverTable.css'; // Import the CSS file for table styling

const DriverTable = () => {
    const [drivers, setDrivers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page

    useEffect(() => {
        // Fetch driver locations from your API
        axios.get('https://55kqzrxn-2011.inc1.devtunnels.ms/online-drivers') // Replace with your actual API endpoint
            .then(response => {
                console.log('API Response:', response.data); // Log API response to check data
                setDrivers(response.data.drivers);
            })
            .catch(error => {
                console.error('Error fetching driver locations:', error);
            });
    }, []);

    // Calculate the indexes for the current page
    const indexOfLastDriver = currentPage * itemsPerPage;
    const indexOfFirstDriver = indexOfLastDriver - itemsPerPage;
    const currentDrivers = drivers.slice(indexOfFirstDriver, indexOfLastDriver);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate total pages
    const totalPages = Math.ceil(drivers.length / itemsPerPage);

    return (
        <div className="table-container">
            <table className="driver-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDrivers.map(driver => (
                        <tr key={driver.driverId}>
                            <td>{driver.driverName}</td>
                            <td>{driver.phone}</td>
                            <td>{driver.driverLiveLocation.latitude}</td>
                            <td>{driver.driverLiveLocation.longitude}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DriverTable;
