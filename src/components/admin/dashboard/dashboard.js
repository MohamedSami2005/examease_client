import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [data, setData] = useState([]);
    const [countSummary, setCountSummary] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/controls`);
                console.log(response.data);
                setData(response.data.uniqueData || []);
                setCountSummary(response.data.results || []);
            } catch (error) {
                alert('Error fetching data. Please try again.');
                console.error(error);
            }
        };

        fetchData();
    }, [apiUrl]);

    // Calculate totals based on the filtered data
    const totalDays = [...new Set(data.map((item) => item.doe))].length; // Unique days
    const totalSessions = [...new Set(countSummary.map((item) => item.session))].length; // Unique sessions
    const totalCourseCodes = countSummary.length; // Unique course codes
    const totalStudents = countSummary.reduce((acc, current) => acc + current.count, 0); // Total students

  return (
    <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 2xl:gap-10">
            <div className=" bg-teal-100 p-4 rounded shadow text-center text-xl font-bold 2xl:text-3xl">
                <div>No of Days</div>
                <div>{totalDays}</div>
            </div>
            <div className="bg-teal-100 p-4 rounded shadow text-center text-xl font-bold 2xl:text-3xl">
                <div>No of Sessions</div>
                <div>{totalSessions}</div>
            </div>
            <div className=" bg-teal-100 p-4 rounded shadow text-center text-xl font-bold 2xl:text-3xl">
                <div>No of Course Codes</div>
                <div>{totalCourseCodes}</div>
            </div>
            <div className="bg-teal-100 p-4 rounded shadow text-center text-xl font-bold 2xl:text-3xl">
                <div>Total No of Students</div>
                <div>{totalStudents}</div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard;