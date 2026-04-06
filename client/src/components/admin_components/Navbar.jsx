import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, User, Settings, LogOut } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();

  // ✅ GET USER FROM LOCALSTORAGE
  const user = JSON.parse(localStorage.getItem("admin")) || {};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <header className="h-16 px-4 md:px-6 flex items-center justify-between 
      bg-white/80 backdrop-blur-md border-b border-gray-100">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">TF</span>
          </div>

          <div className="hidden sm:block" onClick={() => navigate("/admin/dashboard")}>
            <h1 className="text-sm font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-[11px] text-gray-500 -mt-1">
              Manage system
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg 
            bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* MOBILE SEARCH */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Search size={18} />
          </button>

          {/* NOTIFICATION */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
          </button>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                {user?.name?.charAt(0) || "A"}
              </div>

              {/* Name (desktop only) */}
              <span className="hidden md:block text-sm text-gray-700">
                {user?.name || "Admin"}
              </span>
            </button>

            {/* DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-lg shadow-md py-2">

                {/* USER INFO */}
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "admin@example.com"}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/admin/profile")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <User size={16} /> Profile
                </button>

                <button
                  onClick={() => navigate("/admin/settings")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <Settings size={16} /> Settings
                </button>

                <div className="border-t my-1"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH */}
      {showSearch && (
        <div className="md:hidden px-4 py-3 border-b bg-white">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </>
  );
};

export default Navbar;