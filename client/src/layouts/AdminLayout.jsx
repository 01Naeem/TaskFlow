import React, { useState} from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/admin_components/Navbar";
import Footer from "../components/admin_components/Footer";
import Sidebar from "../components/admin_components/Sidebar";

const AdminLayout = () => {
 const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;