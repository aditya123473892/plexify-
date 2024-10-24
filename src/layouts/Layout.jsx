import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-grow bg-[#3857239f] p-16 h-screen overflow-y-auto ms-12 mt-12" >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
