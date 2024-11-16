import React, {useState, useEffect} from 'react';
import axios from 'axios';

function Student() {
    const [data, setData] = useState([])
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            // console.log('api', apiUrl)
            try {
                const response = await axios.get(`${apiUrl}/api/students`);
                console.log(response)
                setData(response.data); 
               
            } catch (error) {
                alert('Error fetching data. Please try again.');
                console.error(error);
            }
        };

        fetchData();
    }, [apiUrl]);

  return (
    <div>
        <h1 className='bg-neutral-800 text-white font-bold text-xl p-2'>Students Details</h1>
        <div className="text-right font-bold text-xl mb-3 text-black">No of Students :  {data.length}</div>
        <div className="grid grid-cols-5 w-auto bg-teal-500 mt-4">
                <div className="font-bold border border-white text-center py-3">S NO.</div>
                <div className="font-bold border border-white text-center py-3">Exam Date</div>
                <div className="font-bold border border-white text-center py-3">Register No</div>
                <div className="font-bold border border-white text-center py-3">DOB</div>
                <div className="font-bold border border-white text-center py-3">course Code</div>
                {/* <div className="font-bold border border-white text-center py-3 col-span-3">Link</div>
                <div className="font-bold border border-white text-center py-3">Action</div>
                <div className='font-bold border border-white text-center py-3 col-span-2'>Edit</div> */}

            </div>
            {data.map((user, index) => (
                <div key={index} className="grid grid-cols-5 bg-teal-200">
                    <div className="font-bold border border-white text-center py-3 uppercase">{index + 1}</div>
                    <div className="font-bold border border-white text-center py-3 uppercase">{user.doe}</div>
                    <div className="font-bold border border-white text-center py-3 uppercase">{user.regNo}</div>
                    <div className="font-bold border border-white text-center py-3 ">{new Date(user.doe).toLocaleDateString('en-IN')}</div>
                    <div className="font-bold border border-white text-center py-3 uppercase">{user.course_code}</div>                  
                </div>
            ))}     
    </div>
  )
}

export default Student