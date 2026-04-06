import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">TF</span>
              </div>
              <span className="text-base font-semibold text-gray-900">
                TaskFlow
              </span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              A modern task management system to streamline workflows, manage teams, and boost productivity.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Product
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <NavLink to="/features" className="block hover:text-gray-900">
                Features
              </NavLink>
              <NavLink to="/pricing" className="block hover:text-gray-900">
                Pricing
              </NavLink>
              <NavLink to="/" className="block hover:text-gray-900">
                Overview
              </NavLink>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Company
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <NavLink to="/about" className="block hover:text-gray-900">
                About
              </NavLink>
              <NavLink to="/contact" className="block hover:text-gray-900">
                Contact
              </NavLink>
              <NavLink to="/careers" className="block hover:text-gray-900">
                Careers
              </NavLink>
            </div>
          </div>

          {/* AUTH / CTA */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Get Started
            </h3>
            <div className="space-y-3">
              <NavLink
                to="/login/employee"
                className="block text-sm text-gray-700 hover:text-gray-900"
              >
                Employee Login
              </NavLink>

              <NavLink
                to="/login/admin"
                className="block text-center px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
              >
                Admin Panel
              </NavLink>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          {/* COPYRIGHT */}
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>

          {/* EXTRA LINKS */}
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <NavLink to="/privacy" className="hover:text-gray-900">
              Privacy
            </NavLink>
            <NavLink to="/terms" className="hover:text-gray-900">
              Terms
            </NavLink>
            <NavLink to="/security" className="hover:text-gray-900">
              Security
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;