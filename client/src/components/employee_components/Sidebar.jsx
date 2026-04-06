import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 💾 Persist collapse (desktop)
  const [collapsed, setCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem("sidebarCollapsed")) || false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // 👤 User
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

  const menu = [
    { name: "Dashboard", path: "/employee/dashboard", icon: LayoutDashboard },
    { name: "My Tasks", path: "/employee/tasks", icon: ListTodo },
    { name: "Profile", path: "/employee/profile", icon: User },
  ];

  return (
    <>
      {/* 🔥 OVERLAY (Mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-screen bg-white border-r border-gray-200
        transition-all duration-300 flex flex-col
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* TOP */}
        <div className="flex items-center justify-between p-4 border-b">
          {/* LOGO */}
          {!collapsed && (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/employee/dashboard")}
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                TF
              </div>
              <span className="font-semibold text-gray-800">TaskFlow</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* MOBILE CLOSE */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <X size={18} />
            </button>

            {/* COLLAPSE */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-2 rounded hover:bg-gray-100"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.path);

            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                title={collapsed ? item.name : ""}
                className={`group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all
                ${
                  active
                    ? "bg-indigo-50 text-indigo-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon
                  size={18}
                  className={`${
                    active
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />

                {!collapsed && item.name}

                {/* ACTIVE INDICATOR */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t">
          {/* USER */}
          <div className="flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-gray-50 transition">
            <div className="w-9 h-9 rounded-md bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            <LogOut size={16} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
