import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CloudSnow, ListTodo } from "lucide-react";
const AssignTask = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    assignedBy: "",
    priority: "medium",
    dueDate: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empLoading, setEmpLoading] = useState(false);
  const [locked, setLocked] = useState(false); // ✅ key fix
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedEmployee = searchParams.get("employee");

  const assignedBy = JSON.parse(localStorage.getItem("admin") || "{}");

  const fetchEmployees = async () => {
    try {
      setEmpLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/employees`,
      );
      setEmployees(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setEmpLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
    if (selectedEmployee) {
      setForm((prev) => ({
        ...prev,
        assignedBy: assignedBy.id,
        assignedTo: selectedEmployee,
      }));
      setLocked(true); // ✅ lock only initially
    }
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.assignedTo) {
      alert("Title and Employee are required");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/tasks/assign`, form);
      alert("Task assigned successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error(error);
      alert("Failed to assign task");
    } finally {
      setLoading(false);
    }
  };
  const selectedEmpData = employees.find((emp) => emp._id === form.assignedTo);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-xl shadow-sm">
          <ListTodo className="text-indigo-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Assign Task</h1>
      </div>
      {/* CARD */}
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-md p-6 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg 
              focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter task details..."
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg 
              focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To *
            </label>
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              disabled={locked}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg 
              focus:ring-2 focus:ring-indigo-500 outline-none 
              disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {empLoading ? "Loading employees..." : "Select Employee"}
              </option>

              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
            {selectedEmpData && (
              <div className="mt-2 text-xs text-gray-500">
                Assigned to:{" "}
                <span className="font-semibold text-gray-700">
                  {selectedEmpData.name}
                </span>
              </div>
            )}
            {locked && (
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    assignedTo: "",
                  }));
                  setLocked(false); // ✅ unlock dropdown
                }}
                className="text-xs text-indigo-600 mt-1 hover:underline"
              >
                Change Employee
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg 
                focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg 
                focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg 
              hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg 
              hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Assigning..." : "Assign Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AssignTask;