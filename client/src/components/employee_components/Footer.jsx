import React, { useState } from "react";
import { Mail, Code, Globe, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) return alert("Enter email");
    alert("Subscribed successfully 🚀");
    setEmail("");
  };

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* TOP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">TF</span>
              </div>
              <h2 className="text-sm font-semibold text-gray-900">TaskFlow</h2>
            </div>

            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              A modern task management platform designed to streamline
              workflows, improve collaboration, and enhance team productivity.
            </p>

            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <Activity size={14} className="text-green-500" />
              System Status: Operational
            </div>
          </div>

          {/* PRODUCT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li
                onClick={() => navigate("/admin")}
                className="hover:text-indigo-600 cursor-pointer"
              >
                Dashboard
              </li>
              <li
                onClick={() => navigate("/admin/tasks")}
                className="hover:text-indigo-600 cursor-pointer"
              >
                Tasks
              </li>
              <li
                onClick={() => navigate("/admin/employees")}
                className="hover:text-indigo-600 cursor-pointer"
              >
                Employees
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="hover:text-indigo-600 cursor-pointer">About</li>
              <li className="hover:text-indigo-600 cursor-pointer">Careers</li>
              <li className="hover:text-indigo-600 cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Stay Updated
            </h3>

            {/* Responsive input */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
                focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={handleSubscribe}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Subscribe
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Get updates about features & improvements.
            </p>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-100 my-8"></div>

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} TaskFlow Inc. All rights reserved.
            <span className="ml-2 text-gray-400 block sm:inline">v1.0.0</span>
          </div>

          {/* SOCIAL */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
              <Mail size={16} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
              <Code size={16} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
              <Globe size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
