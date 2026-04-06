import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [statusUpdates, setStatusUpdates] = useState({});
  const [comments, setComments] = useState({});
  const [employee, setEmployee] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

  // ================= FETCH =================
  const fetchTasks = async (employeeId, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/employee/tasks/${employeeId}`,
      );

      setTasks(data?.data || []);
    } catch (error) {
      setError("Something went wrong while fetching tasks", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const emp = JSON.parse(localStorage.getItem("employee"));

    if (!emp?.id) {
      navigate("/login");
      return;
    }

    setEmployee(emp);
    fetchTasks(emp.id);
  }, []);

  // ================= UPDATE =================
  const handleSubmitStatus = async (taskId) => {
    try {
      setUpdatingId(taskId);

      const task = tasks.find((t) => t._id === taskId);
      const newStatus = statusUpdates[taskId] || task.status;
      const noteText = comments[taskId];

      await axios.put(
        `${import.meta.env.VITE_API_URL}/employee/tasks/${taskId}`,
        {
          employeeId: employee.id,
          status: newStatus,
          ...(noteText && { note: { text: noteText } }),
        },
      );

      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId
            ? {
                ...t,
                status: newStatus,
                notes: noteText
                  ? [
                      ...(t.notes || []),
                      { text: noteText, createdAt: new Date() },
                    ]
                  : t.notes,
              }
            : t,
        ),
      );

      setComments((prev) => ({ ...prev, [taskId]: "" }));
    } catch {
      setError("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // ================= STATS =================
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const overdue = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date(),
  ).length;

  const progress = total ? Math.round((completed / total) * 100) : 0;

  // ================= FILTER =================
  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => (filterStatus === "all" ? true : t.status === filterStatus));

  // ================= STYLES =================
  const statusStyle = (s) => {
    switch (s) {
      case "completed":
        return "bg-green-50 text-green-700";
      case "submitted":
        return "bg-purple-50 text-purple-700";
      case "in-progress":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Your Task Workspace
          </h1>

          <button
            onClick={() => fetchTasks(employee?.id, true)}
            disabled={refreshing}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200
    ${
      refreshing
        ? "bg-white text-gray-400 border border-gray-200 shadow-sm cursor-not-allowed"
        : "bg-gray-900 text-white border border-gray-900 shadow-sm hover:bg-gray-800 active:scale-[0.97]"
    }`}
          >
            {refreshing && (
              <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></span>
            )}

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Manage, update, and track your assigned tasks efficiently. Stay
          organized and keep your workflow moving.
        </p>

        {/* PROGRESS */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Your overall task completion</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {progress === 100
              ? "Excellent work! All tasks are completed."
              : progress > 60
                ? "You're making great progress. Keep going!"
                : "You have pending tasks. Stay focused and complete them on time."}
          </p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KPI
          icon={<CheckCircle size={18} />}
          title="Completed"
          value={completed}
          subtitle="Finished successfully"
          color="bg-green-50 text-green-700"
        />
        <KPI
          icon={<Clock size={18} />}
          title="Pending"
          value={pending}
          subtitle="Awaiting action"
          color="bg-yellow-50 text-yellow-700"
        />
        <KPI
          icon={<AlertCircle size={18} />}
          title="Total"
          value={total}
          subtitle="Assigned to you"
          color="bg-indigo-50 text-indigo-700"
        />
        <KPI
          icon={<AlertCircle size={18} />}
          title="Overdue"
          value={overdue}
          subtitle="Needs attention"
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* FILTER */}
      <div className="bg-white border rounded-lg p-4 flex flex-wrap gap-3">
        <input
          placeholder="Search tasks..."
          className="border px-3 py-2 rounded-md text-sm w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-md text-sm"
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="in-progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* TASKS */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center text-gray-400 py-10">
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No tasks found. Try adjusting your filters.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isOverdue =
              task.dueDate && new Date(task.dueDate) < new Date();

            return (
              <div
                key={task._id}
                className="bg-white border rounded-xl p-4 hover:shadow-md transition"
              >
                {/* TOP */}
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{task.title}</h3>

                    <p className="text-sm text-gray-500">{task.description}</p>

                    {/* EXTRA */}
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span>
                        📅{" "}
                        {new Date(
                          task.dueDate || task.createdAt,
                        ).toLocaleDateString()}
                      </span>

                      {isOverdue && (
                        <span className="text-red-500 font-medium">
                          Overdue task – update immediately
                        </span>
                      )}
                    </div>

                    {/* STATUS MESSAGE */}
                    <p className="text-xs text-gray-500 mt-2">
                      {task.status === "completed"
                        ? "Task completed successfully."
                        : task.status === "submitted"
                          ? "Task submitted for review."
                          : "Work in progress."}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${statusStyle(task.status)}`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* ACTION */}
                <div className="flex gap-2 mt-4">
                  <select
                    value={statusUpdates[task._id] || task.status}
                    onChange={(e) =>
                      setStatusUpdates((prev) => ({
                        ...prev,
                        [task._id]: e.target.value,
                      }))
                    }
                    className="border px-2 py-1 rounded text-sm"
                  >
                    <option value="in-progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                  </select>

                  <button
                    disabled={updatingId === task._id}
                    onClick={() => handleSubmitStatus(task._id)}
                    className="px-3 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    {updatingId === task._id ? "Saving..." : "Update"}
                  </button>
                </div>

                {/* COMMENT */}
                <textarea
                  placeholder="Add comment..."
                  value={comments[task._id] || ""}
                  onChange={(e) =>
                    setComments((prev) => ({
                      ...prev,
                      [task._id]: e.target.value,
                    }))
                  }
                  className="w-full border mt-3 p-2 rounded text-sm"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// KPI
const KPI = ({ icon, title, value, subtitle, color }) => (
  <div className={`p-4 rounded-xl border ${color}`}>
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <p className="text-xs font-medium">{title}</p>
    </div>

    <h2 className="text-lg font-semibold">{value}</h2>

    <p className="text-xs opacity-80 mt-1">{subtitle}</p>
  </div>
);

export default EmployeeTasks;
