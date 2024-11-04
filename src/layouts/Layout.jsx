import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Chatboat from "../Components/ChatboatIcon";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-grow bg1 p-2 md:p-16 h-screen overflow-y-auto ms-12 mt-12">
        <Outlet />
      </div>
      <Chatboat/>
    </div>
  );
};

export default Layout;
