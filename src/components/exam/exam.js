import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Exam() {
  const { regNo } = useParams();
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(true);
  const [remainingTime, setRemainingTime] = useState(null);  // To store the remaining time
  const [timerActive, setTimerActive] = useState(false);  // To track if the timer is active
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/exam/${regNo}`);
        setData(response.data || []);
        console.log('response', response);
      } catch (error) {
        alert('Error fetching data. Please try again.');
        console.error(error);
      }
    };

    fetchData();
  }, [regNo, apiUrl]);

  // Function to calculate the remaining time in IST
  const calculateRemainingTime = (timer) => {
    // Convert the timer (in UTC) to IST by adding 5 hours and 30 minutes (330 minutes)
    const timerExpiry = new Date(new Date(timer).getTime() - (5.5 * 60 * 60 * 1000)); // Convert timer to IST
    const currentTime = new Date();  // Local current time (IST if the system is in IST)
  
    console.log('currentTime', currentTime);  // This should print the local time in IST
    console.log('timerExpiry', timerExpiry);  // This should print the converted timer in IST
  
    // Calculate the time difference in milliseconds
    const timeDifference = timerExpiry - currentTime;
  
    if (timeDifference <= 0) {
      setRemainingTime("00:00:00");
      setTimerActive(false);  // Disable timer when time expires
    } else {
      // Convert milliseconds to HH:MM:SS format
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
      setRemainingTime(
        `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
      );
      setTimerActive(true);  // Enable the timer while it's active
    }
  };

  useEffect(() => {
    // Check if there's any active timer and start countdown
    if (data.length > 0 && data[0].timer) {
      const timerExpiry = new Date(data[0].timer);
      const currentTime = new Date();

      // If the timer has already expired, set the remaining time to 00:00:00
      if (timerExpiry <= currentTime) {
        setRemainingTime("00:00:00");
        setTimerActive(false);  // Disable timer when time expires
      } else {
        const interval = setInterval(() => {
          calculateRemainingTime(data[0].timer);
        }, 1000);

        // Cleanup the interval when the component unmounts
        return () => clearInterval(interval);
      }
    }
  }, [data]); // Dependency on data to re-run the effect when new data is loaded

  console.log('Remaining Time:', remainingTime);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {data.map((user, index) => (
        <div key={index} className="flex flex-col">
          <div className="ml-3 mr-3 font-bold">
            <button
              onClick={() => window.open(`https://forms.gle/ZqVkRxF3XeqrBAdn8`, '_blank')}
              className={`px-4 py-12 border border-4 text-2xl mt-32 rounded-lg 
                ${user.active === '0' ? 'border-gray-500 text-gray-500 bg-gray-300 cursor-not-allowed' : 'border-red-500 text-black hover:border-green-500 hover:text-green-600'}`}
              disabled={user.active === '0' ||  remainingTime !== '00:00:00'}
            >
              {user.course_code} &nbsp;&nbsp;<br />
              {new Date(user.doe).toLocaleDateString('en-IN')}<br />
              {remainingTime && (
                <span className="text-lg font-semibold"> {remainingTime}</span>
                // Remaining Time:
              )}
            </button>
          </div>
        </div>
      ))}

      {/* Instructions */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-teal-200 w-3/5 text-black h-80 rounded-lg shadow-lg overflow-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Instructions</h2>
            <p className="mb-4 ">
              <span className="font-bold ">1. Access the Exam: </span> <br />
              <span className="ml-10">Click on the provided Google Form Link to access the exam form. </span> <br />
              <span className="font-bold"> 2. Do Not Open Other Browsers or Applications:  </span> <br />
              <span className="ml-10">Under no circumstances should you open another browser window or tab, including ChatGPT or any other tool. </span>  <br />
              <span className="font-bold ">3. Mobile Phones, Smartwatches, and Other Gadgets Prohibited:</span>  <br />
              <span className="ml-10">Mobile phones, smartwatches, and any other electronic gadgets are strictly prohibited during the exam.</span>   <br />
            </p>
            <div className="block relative">
              <button
                onClick={closePopup}
                className="bg-blue-500 absolute right-0 text-white py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Exam;
