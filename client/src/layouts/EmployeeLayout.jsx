import React from "react";
import Navbar from "../components/employee_components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/employee_components/Footer";
import Sidebar from "../components/employee_components/Sidebar";
import { useState } from "react";

const EmployeeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
