import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  Users,
  User,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Tasks", path: "/admin/tasks", icon: ListTodo },
    { name: "Assignments", path: "/admin/employees/create-employee", icon: UserPlus },
    { name: "Employees", path: "/admin/employees", icon: Users },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-50 h-screen bg-white border-r border-gray-100 transition-all
        ${collapsed ? "w-20" : "w-64"}
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex flex-col justify-between h-full">
          {/* TOP */}
          <div>
            <div className="flex justify-end p-3">
              <button onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <ChevronRight /> : <ChevronLeft />}
              </button>
            </div>

            <div className="space-y-2 px-3">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition
                    ${
                      active
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} />
                    {!collapsed && item.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM */}
          <div className="p-3 border-t space-y-2">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">
              <Settings size={18} />
              {!collapsed && "Settings"}
            </button>

            <button
              onClick={() => navigate("/admin/profile")}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
            >
              <User size={18} />
              {!collapsed && "Profile"}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg"
            >
              <LogOut size={18} />
              {!collapsed && "Logout"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
