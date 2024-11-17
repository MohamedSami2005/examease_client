import React from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import Jmclogo from '../../assets/jmclogo.png';
import { IoNewspaperOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RiDashboard3Line } from "react-icons/ri";
import { IoMdCloudUpload } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { RiLockPasswordLine } from "react-icons/ri";


// import Jmc from '../../assets/jmc_whitefont.png';

function StudentLayout() {
  const navigate = useNavigate();
  const { regNo, role } = useParams();
  
  // Adjust menu options based on the role and regNo
  console.log('regno:', regNo, ' & role:', role)
  let menus = [
    {
      icon: <IoNewspaperOutline className="text-white text-2xl" />,
      name: 'Exam Portal',
      path: `/student/${regNo}/test`,
      show: regNo !== 'ADMIN' && regNo !== 'ADMINCOE',  // Show only if not ADMIN and ADMINCOE
    },
    {
      icon: <RiDashboard3Line className="text-white text-2xl" />,
      name: 'Dashboard',
      path: `/student/${regNo}/dashboard`,
      show: regNo === 'ADMIN' || regNo === 'ADMINCOE',  // Show only if ADMIN and ADMINCOE
    },
    {
      icon: <IoMdCloudUpload className="text-white text-2xl" />,
      name: 'Upload Center',
      path: `/student/${regNo}/upload`,
      show: regNo === 'ADMIN' || regNo === 'ADMINCOE',  // Show only if ADMIN and ADMINCOE
    },
    {
      icon: <IoMdCloudUpload className="text-white text-2xl" />,
      name: 'Question Bank',
      path: `/student/${regNo}/questionbank`,
      show: regNo === 'ADMIN' || regNo === 'ADMINCOE',  // Show only if ADMIN and ADMINCOE
    },
    {
      icon: <MdAdminPanelSettings className="text-white text-2xl" />,
      name: 'Admin Management',
      path: `/student/${regNo}/controls`,
      show: regNo === 'ADMIN' || regNo === 'ADMINCOE',  // Show only if ADMIN and ADMINCOE
    },
    {
      icon: <PiStudentFill className="text-white text-2xl" />,
      name: 'Student Management',
      path: `/student/${regNo}/students`,
      show: regNo === 'ADMIN' || regNo === 'ADMINCOE',  // Show only if ADMIN and ADMINCOE
    },
    {
      icon: <RiLockPasswordLine className="text-white text-2xl" />,
      name: 'Password Management',
      path: `/student/${regNo}/password`,
      show:  regNo === 'ADMINCOE',  // Show only if ADMIN and ADMINCOE
  
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    navigate('/');
    window.history.pushState(null, null, '/');
  };

  return (
    <div className="flex flex-row bg-neutral-50 h-screen w-screen ">
      <div className={`bg-amber-500 w-64 p-3 h-screen flex flex-col text-black transition-transform transform lg:translate-x-0 lg:static fixed z-50`}>
        <div className='flex flex-col mb-10 place-items-center'>
          <img src={Jmclogo} alt="" className="w-36 h-40" />
          {/* <img src={Jmc} alt="" className=" w-60 " /> */}
          <div className='mt-2 text-white'>
            <span className="text-sm font-extrabold text-center">JAMAL MOHAMED COLLEGE<br /></span>
            <span className="text-sm font-bold ml-12 text-center">(Autonomous)<br /></span>
            <span className="text-sm font-bold text-center">TIRUCHIRAPPALLI - 620 020<br /></span>
          </div>
        </div>
        
        {/* Iterate over the menus and render those with show: true */}
        {menus.map((item, index) => (
          item.show && ( // Only show menu item if `show` is true
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `space-x-4 text-xl pl-[5px] flex items-center h-[45px] transition-all duration-800 hover:bg-neutral-800 hover:rounded-[5px] hover:bg-opacity-75 ${isActive ? 'bg-neutral-800 rounded-[5px] bg-opacity-75' : ''}`
              }
            >
              {item.icon}
              <label className="text-center cursor-pointer font-medium text-base text-white relative z-10 ">
                {item.name}
              </label>
            </NavLink>
          )
        ))}
        
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="space-x-4 text-xl pl-[5px] flex items-center h-[45px] transition-all duration-800 hover:bg-neutral-800 hover:rounded-[5px] hover:bg-opacity-50"
        >
          <RiLogoutCircleLine className="text-white text-2xl" />
          <label className="space-x-4 text-center cursor-pointer font-medium text-base text-white relative z-10">
            Logout
          </label>
        </button>

      </div>
      <div className="p-4 flex-1 overflow-auto overflow-scroll">
        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentLayout;