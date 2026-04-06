import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO (Professional Brand Identity) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-semibold">TF</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900 tracking-tight">
              TaskFlow
            </p>
            <p className="text-[10px] text-gray-500 -mt-1">
              Task Management
            </p>
          </div>
        </div>

        {/* NAVIGATION (Perfectly Centered) */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-600">
          <NavLink to="/" className="hover:text-gray-900 transition">
            Overview
          </NavLink>
          <NavLink to="/features" className="hover:text-gray-900 transition">
            Features
          </NavLink>
          <NavLink to="/pricing" className="hover:text-gray-900 transition">
            Pricing
          </NavLink>
          <NavLink to="/contact" className="hover:text-gray-900 transition">
            Contact
          </NavLink>
        </nav>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink
            to="/employee"
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm"
          >
            Employee Workspace
          </NavLink>

          <NavLink
            to="/admin"
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm"
          >
            Admin Panel
          </NavLink>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 pb-6 pt-4 bg-white border-t border-gray-100 space-y-6">

          {/* NAV LINKS */}
          <div className="space-y-4 text-sm text-gray-700">
            <NavLink to="/" className="block">
              Overview
            </NavLink>
            <NavLink to="/features" className="block">
              Features
            </NavLink>
            <NavLink to="/pricing" className="block">
              Pricing
            </NavLink>
            <NavLink to="/contact" className="block">
              Contact
            </NavLink>
          </div>

          <div className="border-t border-gray-100"></div>

          {/* ACTIONS */}
          <div className="space-y-3">
            <NavLink
              to="/login/employee"
              className="block text-center text-sm text-gray-800"
            >
              Employee Login
            </NavLink>

            <NavLink
              to="/login/admin"
              className="block text-center px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium"
            >
              Admin Panel
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;