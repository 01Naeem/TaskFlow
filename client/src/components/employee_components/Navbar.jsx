import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
} from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("employee")) || {};
  } catch {
    navigate("/login");
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* MOBILE MENU */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Menu size={20} />
            </button>

            {/* LOGO */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/employee/dashboard")}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                TF
              </div>

              <div className="hidden sm:block leading-tight">
                <h1 className="text-sm font-semibold text-gray-900">
                  TaskFlow
                </h1>
                <p className="text-xs text-gray-500">Workspace</p>
              </div>
            </div>
          </div>

          {/* 🔍 DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3 top-2.5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search tasks, projects..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 
                bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* MOBILE SEARCH */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Search size={18} />
            </button>

            {/* NOTIFICATION */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 md:gap-3 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="hidden md:flex flex-col text-left leading-tight">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.email}
                  </span>
                </div>
              </button>

              {/* 🔽 DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2">

                  {/* USER INFO */}
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                  {/* MENU */}
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/employee/profile");
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <User size={16} /> Profile
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/employee/settings");
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <Settings size={16} /> Settings
                  </button>

                  <div className="border-t my-2"></div>

                  {/* LOGOUT */}
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 🔍 MOBILE SEARCH BAR */}
      {showSearch && (
        <div className="md:hidden border-b bg-white">
          <div className="px-4 py-3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
              focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;