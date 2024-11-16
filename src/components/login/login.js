import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jmc from '../../assets/jmclogo.png';
import axios from 'axios';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [regNo, setregNo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  console.log('api', apiUrl)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('regNo:', regNo, 'Password:', password);
    // console.log(apiUrl)
    axios.post(`${apiUrl}/api/login/`, {
      regNo,
      password,
    })
      .then(res => {
        console.log("Response from server:", res.data);
        if (res.data.status === 'exist') {
          if (res.data.role === '1' || res.data.role === '2') {
            navigate(`/student/${regNo}/dashboard`, { state: { id: regNo } });
          } else {
            navigate(`/student/${regNo}/test`, { state: { id: regNo } });
          }
        } else if (res.data.status === 'wrong password') {
          alert("Wrong Password");
        } else if (res.data.status === 'not exist') {
          alert("User does not exist");
        }
      })
      .catch(e => {
        alert("An error occurred. Please try again.");
        console.log(e);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-amber-500 to-neutral-500">
      <div className="flex flex-col lg:flex-row justify-center items-center top-0  w-full bg-gray-100">
        <img src={jmc} alt="LOGO" className="w-24 h-24 lg:w-36 lg:h-36" />
        <div className="flex flex-col justify-center items-center lg:ml-8 text-center py-6">
          <p className="text-xl md:text-2xl lg:text-3xl font-extrabold"> JAMAL MOHAMED COLLEGE</p>
          <p className="text-lg md:text-xl font-bold">(Autonomous)</p>
          <p className="text-lg md:text-xl font-bold">TIRUCHIRAPPALLI - 620 020</p>
          <p className="text-lg md:text-xl font-bold">Online Exam Portal</p>
        </div>
      </div>
      <form className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md mt-16" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="regNo">
            Register No
          </label>
          <input
            type="regNo"
            id="regNo"
            value={regNo}
            onChange={(e) => setregNo(e.target.value.toUpperCase())}
            required
            className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-6 relative">
          <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="password">
            Date of Birth (DD/MM/YYYY)
          </label>
          <input
            type={isPasswordVisible ? 'text' : 'password'} // Toggle visibility based on state
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Handle Date of Birth input
            required
            placeholder="DD/MM/YYYY"
            className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          {/* Eye icon to toggle visibility */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-7 right-3 text-gray-600 focus:outline-none"
          >
            {isPasswordVisible ? (
              <FaRegEyeSlash className="w-5 h-5" /> // Eye slash icon (password hidden)
            ) : (
              <FaRegEye className="w-5 h-5" /> // Eye icon (password visible)
            )}
          </button>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 "
          onClick={handleLogin}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;