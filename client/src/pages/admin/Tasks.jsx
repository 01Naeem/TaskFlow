import React, { useEffect, useState } from "react";
import axios from "axios";
import { ListTodo, Search, Eye, Trash2, Star } from "lucide-react";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 Modal state
  const [selectedTask, setSelectedTask] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Admin info for approval badge
  const adminData = JSON.parse(localStorage.getItem("admin") || "{}");

  // 🔥 Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/tasks`,
      );
      setTasks(res.data.data || []);
      setFiltered(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔍 Search
  useEffect(() => {
    const data = tasks.filter((task) =>
      `${task.title} ${task.assignedTo?.name} ${task.priority} ${task.status}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
    setFiltered(data);
  }, [search, tasks, openModal]);

  // ❌ Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/tasks/delete/${id}`,
      );
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 🎨 Styles
  const statusStyle = (s) => {
    if (s === "completed") return "bg-green-100 text-green-700";
    if (s === "submitted") return "bg-purple-100 text-purple-700";
    if (s === "in-progress") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };
  const priorityStyle = (p) => {
    if (p === "high") return "bg-red-50 text-red-600";
    if (p === "medium") return "bg-yellow-50 text-yellow-600";
    return "bg-green-50 text-green-600";
  };

  const isOverdue = (date) => date && new Date(date) < new Date();

  // ✅ Final Approve
  const handleFinalApprove = async (taskId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/tasks/final-approve/${taskId}`,
        {
          status: "completed",
          approvedBy: adminData.id
        },
      );

      // 🔄 update UI
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: "completed" } : t)),
      );

      setSelectedTask((prev) => ({
        ...prev,
        status: "completed",
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const data = tasks.filter((task) =>
      `${task.title} ${task.assignedTo?.name} ${task.priority} ${task.status}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
    setFiltered(data);
  }, [search, tasks, selectedTask, openModal]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* HEADER */}
      <div className="bg-white border rounded-xl p-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <ListTodo size={18} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Admin Tasks</h1>
            <p className="text-xs text-gray-500">Monitor all employee tasks</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-6 bg-white border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No tasks found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">Task</th>
                <th className="px-6 py-4 text-left">Assigned</th>
                <th className="px-6 py-4 text-left">Priority</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Deadline</th>
                <th className="px-6 py-4 text-left">Notes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((task) => (
                <tr key={task._id} className="border-t hover:bg-gray-50">
                  {/* TASK */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{task.title}</span>

                      {task.important && (
                        <Star className="text-yellow-500" size={14} />
                      )}
                    </div>

                    <p className="text-xs text-gray-500">{task.description}</p>
                  </td>

                  {/* ASSIGNED */}
                  <td className="px-6 py-4 text-sm">
                    {task.assignedTo?.name || "Unassigned"}
                    <div className="text-xs text-gray-400">
                      {task.assignedTo?.email}
                    </div>
                  </td>

                  {/* PRIORITY */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${priorityStyle(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${statusStyle(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  {/* DEADLINE */}
                  <td
                    className={`px-6 py-4 text-xs ${isOverdue(task.dueDate) ? "text-red-500" : ""}`}
                  >
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* NOTES */}
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {task.notes?.length || 0} comments
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setOpenModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔥 MODAL */}
      {openModal && selectedTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden">
            {/* HEADER */}
            <div className="flex justify-between items-start p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedTask.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedTask.description}
                </p>

                {/* BADGES */}
                <div className="flex gap-2 mt-3">
                  <span
                    className={`text-xs px-2 py-1 rounded 
              ${
                selectedTask.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : selectedTask.status === "submitted"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
              }`}
                  >
                    {selectedTask.status}
                  </span>

                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                    {selectedTask.priority}
                  </span>

                  {selectedTask.important && (
                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                      ⭐ Important
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-400 hover:text-black text-lg"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* LEFT */}
              <div>
                {/* ASSIGNED */}
                <div className="mb-5">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Assigned To
                  </h4>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full text-sm">
                      {selectedTask.assignedTo?.name?.[0] || "U"}
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {selectedTask.assignedTo?.name || "Unassigned"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {selectedTask.assignedTo?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DEADLINE */}
                <div className="mb-5">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Deadline
                  </h4>
                  <p className="text-sm">
                    {selectedTask.dueDate
                      ? new Date(selectedTask.dueDate).toLocaleDateString()
                      : "No deadline"}
                  </p>
                </div>

                {/* META */}
                <div className="text-xs text-gray-400">
                  Created: {new Date(selectedTask.createdAt).toLocaleString()}
                  <br />
                  Updated: {new Date(selectedTask.updatedAt).toLocaleString()}
                </div>

                {/* ✅ APPROVAL INFO */}
                {selectedTask.status === "completed" && (
                  <div
                    className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex justify-between items-center cursor-pointer hover:bg-green-100 transition"
                    onClick={() => setOpenModal(false)}
                  >
                    <div>
                      ✅ Approved by{" "}
                      <span className="font-semibold">
                        {adminData?.name || "Admin"}
                      </span>
                    </div>

                    <span className="text-xs text-gray-500">
                      {new Date(selectedTask.updatedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                {/* COMMENTS */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    💬 Comments
                  </h4>

                  {selectedTask.notes?.length === 0 ? (
                    <p className="text-sm text-gray-400">No comments yet</p>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                      {selectedTask.notes.map((n, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 border rounded-lg p-3"
                        >
                          <p className="text-sm text-gray-800">{n.text}</p>

                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>👤 {n.addedBy?.name || "Unknown"}</span>
                            <span>
                              {new Date(n.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTIVITY */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    🔁 Activity
                  </h4>

                  {selectedTask.activity?.length === 0 ? (
                    <p className="text-sm text-gray-400">No activity yet</p>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                      {selectedTask.activity.map((a, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-2 h-2 mt-2 bg-indigo-500 rounded-full"></div>

                          <div className="text-sm">
                            <p className="text-gray-700">{a.action}</p>
                            <p className="text-xs text-gray-400">
                              👤 {a.performedBy?.name || "System"} •{" "}
                              {new Date(a.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t flex justify-between items-center">
              {/* ✅ FINAL APPROVE */}
              {selectedTask.status === "submitted" && (
                <button
                  onClick={() => {
                    if (!confirm("Approve this task?")) return;
                    handleFinalApprove(selectedTask._id);
                    fetchTasks();
                    setOpenModal(false);
                  }}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  ✅ Final Approve
                </button>
              )}

              {/* 🔒 ALREADY COMPLETED */}
              {selectedTask.status === "completed" && (
                <button
                  disabled
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                >
                  ✔ Already Approved
                </button>
              )}

              <button
                className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
