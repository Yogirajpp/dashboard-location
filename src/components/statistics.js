import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import moment from 'moment';
import './statistics.css';

const RideStatistics = () => {
    const [period, setPeriod] = useState('30 days'); // Default period
    const [rideData, setRideData] = useState([]);
    const [driverData, setDriverData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to reduce x-axis labels based on selected period
    const filterXAxisLabels = (data) => {
        const filteredData = [data[0]]; // Start with the header

        const intervals = {
            'today': 1,
            '30 days': Math.floor(data.length / 10), // Show 10 intervals
            '1 year': Math.floor(data.length / 4), // Show 4 intervals (quarterly)
            'all time': Math.floor(data.length / 6), // Show 6 intervals for longer periods
        };

        const interval = intervals[period] || 1;

        for (let i = 1; i < data.length; i += interval) {
            filteredData.push(data[i]);
        }

        return filteredData;
    };

    // Fetch data for both total rides and drivers
    const fetchData = async () => {
        try {
            const response = await axios.post('https://55kqzrxn-2011.inc1.devtunnels.ms/dashboard/api/total-completed-rides', { period });
            const result = response.data;

            const formattedRideData = [
                ['Date', 'Total Completed Rides'],
                ...result.map(item => [
                    moment(item.date).format('YYYY-MM-DD'),
                    item.totalCompletedRides
                ])
            ];

            const formattedDriverData = [
                ['Date', 'Total New Drivers'],
                ...result.map(item => [
                    moment(item.date).format('YYYY-MM-DD'),
                    item.totalNewDrivers
                ])
            ];

            // Filter data to reduce x-axis labels
            const filteredRideData = filterXAxisLabels(formattedRideData);
            const filteredDriverData = filterXAxisLabels(formattedDriverData);

            setRideData(filteredRideData);
            setDriverData(filteredDriverData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [period]);

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
    };

    if (loading) {
        return <p>Loading charts...</p>;
    }

    const options = {
        hAxis: { title: 'Date' },
        vAxis: { title: 'Count' },
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    return (
        <div className='statistics-container'>
            <div className="period-select">
                <label htmlFor="period">Select Period: </label>
                <select id="period" value={period} onChange={handlePeriodChange}>
                    <option value="today">Today</option>
                    <option value="30 days">Last 30 Days</option>
                    <option value="1 year">Last 1 Year</option>
                    <option value="all time">All Time</option>
                </select>
            </div>
            <div className="graphs-wrapper">

                <div className="ride-statistics-container">
                    <h1 className="chart-title">Completed Rides</h1>
                    <div className="chart-container">
                        <Chart
                            chartType="LineChart"
                            data={rideData}
                            options={{ ...options, title: `Completed Rides over ${period}` }}
                            width="100%"
                            height="100%"
                        />
                    </div>
                </div>

                <div className="ride-statistics-container">
                    <h1 className="chart-title">New Drivers</h1>
                    <div className="chart-container">
                        <Chart
                            chartType="LineChart"
                            data={driverData}
                            options={{ ...options, title: `New Drivers over ${period}` }}
                            width="100%"
                            height="100%"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RideStatistics;
