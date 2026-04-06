import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Clock, ListTodo, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedEmployee = localStorage.getItem("employee");

      if (!storedEmployee) {
        navigate("/login");
        return;
      }

      const parsed = JSON.parse(storedEmployee);
      setEmployee(parsed);
    } catch {
      navigate("/login");
    }
  }, []);

  const fetchTasks = async (employeeId) => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/employee/tasks/${employeeId}`,
      );

      setTasks(data?.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employee?.id) fetchTasks(employee.id);
  }, [employee]);

  // 📊 Stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const overdue = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date(),
  ).length;

  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome back, {employee?.name || "Employee"} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's your task performance overview
        </p>

        {/* PROGRESS */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<ListTodo size={18} />}
          title="Total Tasks"
          value={total}
          color="bg-indigo-50 text-indigo-700"
        />
        <StatCard
          icon={<CheckCircle size={18} />}
          title="Completed"
          value={completed}
          color="bg-green-50 text-green-700"
        />
        <StatCard
          icon={<Clock size={18} />}
          title="Pending"
          value={pending}
          color="bg-yellow-50 text-yellow-700"
        />
        <StatCard
          icon={<AlertTriangle size={18} />}
          title="Overdue"
          value={overdue}
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* TASK LIST */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-800">Recent Tasks</h2>

          <button
            onClick={() => navigate("/employee/tasks")}
            className="text-sm text-indigo-600 hover:underline"
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No tasks assigned</div>
        ) : (
          <div className="divide-y">
            {tasks.slice(0, 5).map((task) => {
              const isOverdue =
                task.dueDate && new Date(task.dueDate) < new Date();

              return (
                <div
                  key={task._id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-xs text-gray-500">{task.description}</p>

                    {/* EXTRA INFO */}
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span>
                        📅{" "}
                        {new Date(
                          task.dueDate || task.createdAt,
                        ).toLocaleDateString()}
                      </span>

                      {isOverdue && (
                        <span className="text-red-500 font-medium">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.status === "completed"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {task.status || "pending"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">
          Quick Actions
        </h2>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate("/employee/tasks")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
          >
            View Tasks
          </button>

          <button className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Improved Stat Card
const StatCard = ({ icon, title, value, color }) => (
  <div className={`p-4 rounded-xl border flex items-center gap-3 ${color}`}>
    <div>{icon}</div>
    <div>
      <p className="text-xs">{title}</p>
      <h2 className="text-lg font-semibold">{value}</h2>
    </div>
  </div>
);

export default EmployeeDashboard;
