import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuTimer } from "react-icons/lu";

function Controls() {
    const [data, setData] = useState([]);
    const [countSummary, setCountSummary] = useState([]);
    const [editData, setEditData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSet, setIsSet] = useState(false);
    const [newTimer, setNewTimer] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;
    console.log('api', apiUrl)
    const { regNo } = useParams();
    console.log('regno:', regNo)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/controls`);
                console.log(response.data)
                setData(response.data.uniqueData || []);
                setCountSummary(response.data.results || []);
            } catch (error) {
                alert('Error fetching data. Please try again.');
                console.error(error);
            }
        };

        fetchData();
    }, [apiUrl]);

    const handleCheckbox = async (index, field, checked) => {
        const updatedStatus = checked ? 1 : 0; // Toggle between 1 and 0
        const user = data[index];
        const courseCode = user.course_code; // Assume courseCode is in user object

        try {
            // Send the update request to the backend
            await axios.put(`${apiUrl}/api/controls/${courseCode}`, { active: updatedStatus });

            // Optionally, update the local state if necessary
            const updatedData = [...data];
            updatedData[index] = { ...user, active: updatedStatus };
            setData(updatedData);  // Assuming you have setData for updating your local state
            window.location.reload();
        } catch (error) {
            console.error("Error updating status:", error);
            // Optionally, you can display an error message or handle the error appropriately
        }
    };

    // const handleToggle = async (courseCode, isActive) => {
    //     const updatedStatus = isActive === 1 ? 0 : 1;

    //     try {
    //         await axios.put(`${apiUrl}/api/controls/${courseCode}`, { active: updatedStatus });

    //         setData((prevCourses) =>
    //             prevCourses.map((item) =>
    //                 item.course_code === courseCode ? { ...item, active: updatedStatus } : item
    //             )
    //         );
    //     } catch (error) {
    //         alert('Error updating status. Please try again.');
    //         console.error('Error updating course status:', error);
    //     }
    // };

    const handleEditClick = (user) => {
        setEditData(user);
        setIsModalOpen(true); // Open the modal
    };
    const handleTimerClick = (user) => {
        setEditData(user);
        setIsSet(true); // Open the modal
    };
    const handleDelete = (user) => {
        try {
            const del = axios.delete(`${apiUrl}/api/controls/delete/${user.course_code}`)
            if (del) {
                alert('Deleted Successfully')
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            alert('Error updating course. Please try again.');
        }
    }

    // Handle Save Button click
    const handleSaveClick = async () => {
        try {
            const updatedData = {
                ...editData,
                doe: new Date(editData.doe).toISOString(),
            };

            // Make the PUT request to save the edited data
            await axios.put(`${apiUrl}/api/controls/update/${editData.course_code}`, updatedData);

            // Update local state with the new data
            setData(prevData =>
                prevData.map(item =>
                    item.course_code === editData.course_code ? { ...item, ...updatedData } : item
                )
            );

            // Close the modal
            setIsModalOpen(false);
            alert('Course updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Error updating course. Please try again.');
        }
    };

    //timer update
    const convertToSeconds = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return (hours * 3600 + minutes * 60 + seconds) * 1000; // return milliseconds
    };

    const handleTimerUpdate = async (courseCode, timerStr) => {
        if (!timerStr.match(/^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/)) {
            alert("Please enter a valid timer in HH:MM:SS format.");
            return;
        }

        const timerInMilliseconds = convertToSeconds(timerStr);

        try {
            const updatedData = { timer: timerInMilliseconds };

            await axios.put(`${apiUrl}/api/controls/update-timer/${courseCode}`, updatedData);

            setData(prevData =>
                prevData.map(item =>
                    item.course_code === courseCode ? { ...item, timer: timerInMilliseconds } : item
                )
            );
            setIsSet(false);
            alert('Timer updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Error updating timer. Please try again.');
        }
    };


    // Handle modal close
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsSet(false);
    };
    const gridCols = regNo === 'ADMINCOE' ? 'grid-cols-11' : 'grid-cols-8';

    return (
        <div>
            <h1 className='bg-neutral-800 text-white font-bold text-xl p-2'>Exams Details</h1>
            <div className={`grid ${gridCols} w-auto bg-teal-500 mt-4`}>
                <div className="font-bold border border-white text-center py-3">S NO.</div>
                <div className="font-bold border border-white text-center py-3">Date</div>
                <div className="font-bold border border-white text-center py-3">Session</div>
                <div className="font-bold border border-white text-center py-3">course Code</div>
                <div className="font-bold border border-white text-center py-3 col-span-3">Link</div>
                <div className="font-bold border border-white text-center py-3">Action</div>
                {regNo === 'ADMINCOE' && (
                    <div className='font-bold border border-white text-center py-3 col-span-2'>Edit</div>
                )}
                {regNo === 'ADMINCOE' && (
                    <div className='font-bold border border-white text-center py-3'>Timer</div>
                )}

            </div>
            {data.map((user, index) => (
                <div key={index} className={`grid ${gridCols} bg-teal-200`}>
                    <div className="font-bold border border-white text-center py-3 uppercase">{index + 1}</div>
                    {/* <div className="font-bold border border-white text-center py-3 uppercase">{new Date(user.doe).toLocaleDateString('en-IN')}</div> */}
                    <div className="font-bold border border-white text-center py-3 uppercase">{new Date(user.doe).toLocaleDateString('en-IN')}</div>
                    <div className="font-bold border border-white text-center py-3 uppercase">{user.session}</div>
                    <div className="font-bold border border-white text-center py-3 uppercase">{user.course_code}</div>
                    <div className="font-bold border border-white text-center py-3 text-wrap col-span-3">{user.link}</div>
                    <div className="font-bold border border-white text-center py-3 flex justify-center uppercase">
                        <div className="relative inline-block w-14 h-8">
                            <input
                                type="checkbox"
                                checked={user.active === '1'}
                                onChange={(e) => handleCheckbox(index, 'active', e.target.checked)}
                                className="absolute inset-0 opacity-0"
                            />
                            <div
                                className={`block w-full h-full rounded-full cursor-pointer ${user.active === '1' ? 'bg-green-500' : 'bg-red-500'}`}
                                onClick={() => handleCheckbox(index, 'active', !user.active === '1')}
                            >
                                <div
                                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 transform ${user.active === '1' ? 'translate-x-6' : 'translate-x-0'}`}
                                ></div>
                            </div>
                        </div>
                    </div>
                    {regNo === 'ADMINCOE' && (
                        <div className="font-bold border flex justify-center items-center border-white text-center py-3 uppercase col-span-2">
                            <button
                                onClick={() => handleEditClick(user)}
                                className='border border-4 flex border-zinc-100 bg-cyan-400 hover:bg-cyan-300 p-1 rounded-md'
                            >
                               <MdEdit/> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(user)}
                                className='border border-4 flex border-zinc-100 bg-red-500 hover:bg-red-400 p-1 rounded-md ml-3'
                            >
                                < RiDeleteBin5Line /> Delete
                            </button>
                        </div>
                    )}
                    {regNo === 'ADMINCOE' && (
                       <div className="font-bold border border-white flex justify-center items-center text-center py-3 uppercase ">
                        <button
                                onClick={() => handleTimerClick(user)}
                                className='border border-4 flex  border-zinc-100 bg-cyan-400 hover:bg-cyan-300 p-1 rounded-md'
                            >
                               <LuTimer /> Set
                            </button>
                       </div>
                    )}
                </div>
            ))}

            <h1 className='bg-neutral-800 text-white font-bold text-xl p-2 mt-10'>Exams Data Summary</h1>
            <div className="grid grid-cols-5 w-auto bg-teal-500 mt-4">
                <div className="font-bold border border-white text-center py-3">S NO.</div>
                <div className="font-bold border border-white text-center py-3">Exam Date</div>
                <div className="font-bold border border-white text-center py-3">Course Code</div>
                <div className="font-bold border border-white text-center py-3">Session</div>
                <div className="font-bold border border-white text-center py-3">Strength</div>
            </div>
            {countSummary.map((summary, index) => (
                <div key={index} className="grid grid-cols-5 bg-teal-200">
                    <div className="font-bold border border-white text-center py-3 uppercase">{index + 1}</div>
                    <div className="font-bold border border-white text-center py-3 uppercase">{new Date(summary.doe).toLocaleDateString('en-IN')}</div>
                    <div className="font-bold border border-white text-center py-3 uppercase">{summary.course_code}</div>
                    <div className="font-bold border border-white text-center py-3 uppercase">{summary.session}</div>
                    <div className="font-bold border border-white text-center py-3 uppercase">{summary.count}</div>
                </div>
            ))}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-1/2">
                        <h2 className="text-xl font-bold mb-4">Edit Course</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-bold">Course Code</label>
                                <input
                                    type="text"
                                    value={editData?.course_code}
                                    onChange={(e) => setEditData({ ...editData, course_code: e.target.value })}
                                    className="border border-gray-300 p-2 w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold">Link</label>
                                <input
                                    type="text"
                                    value={editData?.link}
                                    onChange={(e) => setEditData({ ...editData, link: e.target.value })}
                                    className="border border-gray-300 p-2 w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold">Date</label>
                                <input
                                    type="date"
                                    value={editData?.doe?.substring(0, 10)}
                                    onChange={(e) => setEditData({ ...editData, doe: e.target.value })}
                                    className="border border-gray-300 p-2 w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold">Session</label>

                                <select
                                    name="dept"
                                    value={editData?.session}
                                    onChange={(e) => setEditData({ ...editData, session: e.target.value })}
                                    className="border border-gray-300 p-2 w-full"
                                >
                                    <option value="FN">FN</option>
                                    <option value="AN">AN</option>
                                </select>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleSaveClick}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isSet && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-1/3 flex flex-col justify-center items-center">
                        <label className="block text-sm font-bold">Timer (HH:MM:SS){editData.course_code}</label>
                        <input
                            type="text"
                            value={newTimer}
                            
                            onChange={(e) => setNewTimer(e.target.value)}
                            placeholder="Enter timer in HH:MM:SS"
                            className="border border-gray-300 p-2 w-52 mt-4"
                        />
                        <button
                            onClick={() => handleTimerUpdate(editData.course_code, newTimer)}
                            className="bg-green-500 text-white px-4 py-2 rounded w-52 mt-4"
                        >
                            Update Timer
                        </button>
                        <button
                            type="button"
                            onClick={handleCloseModal} 
                            className="bg-gray-500 text-white px-4 py-2 rounded w-52 mt-4"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Controls;