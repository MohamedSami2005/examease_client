import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// import { IoMdCloudUpload } from "react-icons/io";

function Upload() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [file, setFile] = useState('');
    const [isLoad, setIsLoad] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        setIsLoad(true)
        // console.log('api', apiUrl)
        if (!file) {
            alert('Please Select the File')
        }
        const formData = new FormData()
        formData.append('file', file)
        try {
            // Send file to the backend
            const response = await axios.post(`${apiUrl}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsLoad(false)
            if (response.data) {
                alert('File Uploaded Successfully')
            };
        } catch (error) {
            alert('Error uploading file. Please try again.');
            console.error(error);
        }
    }

    const handleDownload = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'Sample_Excel';

        // Define headers for Excel
        const headers = [
            'REGNO',
            'DOB',
            'COURSE CODE',
            'LINK',
            'DOE',
            'Session'
        ];

        // Add headers to the beginning of the data array
        const dataWithHeaders = [headers, [
           '23MCA001',
           '01/01/2003',
           '23MCA3DE3A',
           'https://forms.gle/syj7oZJRL1hEWA6w9In',
           '14.11.2024',
           'FN'
        ]];

        const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const data = new Blob([excelBuffer], { type: fileType });
        saveAs(data, fileName + fileExtension);
    };
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-neutral-800 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-6 text-white">Upload Excel File</h2>

            <form onSubmit={handleUpload} className="flex flex-col items-center space-y-4">

                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="block w-full text-gray-800 bg-gray-300 border border-gray-500 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    type="submit"
                    disabled={isLoad} 
                    className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-300 relative"
                >
                    {/* <IoMdCloudUpload className="text-white text-2xl absolute flex justify-center items-center text-center" /> */}
                    {isLoad ? 'Please Wait...' : 'Upload'} 
                </button>
               
            </form>
            <button onClick={handleDownload} type='button' className='text-white underline'>Sample Excel</button>
        </div>
    );
};

export default Upload;