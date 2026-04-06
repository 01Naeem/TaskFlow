import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListTodo,
  Users,
  CheckCircle,
  Clock,
  Plus,
  UserPlus,
  ClipboardEdit,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    pending: 0,
    employees: 0,
  });

  const [recentTasks, setRecentTasks] = useState([]);

  // 🔥 Simulated API (replace later)
  useEffect(() => {
    setStats({
      totalTasks: 120,
      completed: 80,
      pending: 40,
      employees: 25,
    });

    setRecentTasks([
      {
        title: "Design login page",
        user: "Rahul",
        status: "Pending",
      },
      {
        title: "API integration",
        user: "Aisha",
        status: "Completed",
      },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500">
          Manage employees, assign tasks, and monitor performance
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 flex justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Tasks</p>
            <h2 className="text-lg font-semibold">{stats.totalTasks}</h2>
          </div>
          <ListTodo className="text-indigo-600" />
        </div>

        <div className="bg-white border rounded-xl p-4 flex justify-between">
          <div>
            <p className="text-xs text-gray-500">Completed</p>
            <h2 className="text-lg font-semibold">{stats.completed}</h2>
          </div>
          <CheckCircle className="text-green-500" />
        </div>

        <div className="bg-white border rounded-xl p-4 flex justify-between">
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <h2 className="text-lg font-semibold">{stats.pending}</h2>
          </div>
          <Clock className="text-yellow-500" />
        </div>

        <div className="bg-white border rounded-xl p-4 flex justify-between">
          <div>
            <p className="text-xs text-gray-500">Employees</p>
            <h2 className="text-lg font-semibold">{stats.employees}</h2>
          </div>
          <Users className="text-blue-500" />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT TASKS */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">Recent Tasks</h2>

          <div className="space-y-3">
            {recentTasks.map((task, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-gray-500">
                    Assigned to: {task.user}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-md ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">Quick Actions</h2>

          <div className="space-y-3">
            {/* Assign Task */}
            <button
              onClick={() => navigate("/admin/tasks/assign")}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
            >
              <ClipboardEdit size={16} />
              Assign Task
            </button>

            {/* Register Employee */}
            <button
              onClick={() => navigate("/admin/employees/create-employee")}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              <UserPlus size={16} />
              Register Employee
            </button>

            {/* View All Tasks */}
            <button
              onClick={() => navigate("/admin/tasks")}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              <ListTodo size={16} />
              View Tasks
            </button>

            {/* Add Employee Shortcut */}
            <button
              onClick={() => navigate("/admin/employees")}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              <Users size={16} />
              Manage Employees
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
