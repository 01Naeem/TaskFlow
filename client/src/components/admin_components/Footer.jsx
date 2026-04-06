import React from "react";
import { NavLink } from "react-router-dom";
import { Shield, HelpCircle, Mail, Code, Activity } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto px-6 md:px-6 pt-10 pb-5">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                TF
              </div>
              <span className="text-sm font-semibold text-gray-900">
                TaskFlow Admin
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Manage tasks, teams, and workflows efficiently with a modern admin
              dashboard built for productivity.
            </p>

            {/* STATUS */}
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <Activity size={14} className="text-green-500" />
              System operational
            </div>
          </div>

          {/* PRODUCT */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Dashboard
            </h3>

            <div className="space-y-2 text-xs text-gray-600">
              <NavLink to="/admin" className="block hover:text-gray-900">
                Overview
              </NavLink>
              <NavLink to="/admin/tasks" className="block hover:text-gray-900">
                Tasks
              </NavLink>
              <NavLink
                to="/admin/employees"
                className="block hover:text-gray-900"
              >
                Employees
              </NavLink>
              <NavLink
                to="/admin/analytics"
                className="block hover:text-gray-900"
              >
                Analytics
              </NavLink>
            </div>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Support
            </h3>

            <div className="space-y-2 text-xs text-gray-600">
              <NavLink
                to="/admin/help"
                className="flex items-center gap-2 hover:text-gray-900"
              >
                <HelpCircle size={14} />
                Help Center
              </NavLink>

              <NavLink
                to="/admin/security"
                className="flex items-center gap-2 hover:text-gray-900"
              >
                <Shield size={14} />
                Security
              </NavLink>

              <a
                href="mailto:support@taskflow.com"
                className="flex items-center gap-2 hover:text-gray-900"
              >
                <Mail size={14} />
                Contact Support
              </a>
            </div>
          </div>

          {/* DEVELOPER / META */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              System
            </h3>

            <div className="space-y-2 text-xs text-gray-600">
              <p>Version: v1.0.0</p>
              <p>Environment: Production</p>

              <a
                href="#"
                className="flex items-center gap-2 hover:text-gray-900"
              >
                <Code size={14} />
                Repository
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-100 mt-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          {/* COPYRIGHT */}
          <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>

          {/* LEGAL */}
          <div className="flex items-center gap-4">
            <NavLink to="/privacy" className="hover:text-gray-900">
              Privacy
            </NavLink>
            <NavLink to="/terms" className="hover:text-gray-900">
              Terms
            </NavLink>
            <NavLink to="/status" className="hover:text-gray-900">
              Status
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
