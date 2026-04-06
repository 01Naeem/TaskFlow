import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import axios from "axios";

const EmployeeForm = () => {
  const navigate = useNavigate();

  // ✅ SAFE ADMIN PARSE
  let admin = {};
  try {
    const storedUser = localStorage.getItem("admin");
    admin = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("Error parsing user", error);
    admin = {};
  }

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    role: "employee",
    phone: "",
    joiningDate: getTodayDate(),
  });

  const [loading, setLoading] = useState(false);

  // HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        createdBy: {
          name: admin?.name || "Admin",
          email: admin?.email || "admin@example.com",
        },
        createdAt: new Date().toISOString(), // 🔥 bonus
      };

      console.log("Final Payload:", payload);

      // 🔥 API CALL
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/employees/create-employee`, payload);
      console.log(res.data)

      navigate("/admin/employees");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="text-indigo-600" size={20} />
        <h1 className="text-lg font-semibold text-gray-900">Add Employee</h1>
      </div>

      {/* ADMIN INFO (PRO FEATURE) */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 border">
        <p>
          Created by:{" "}
          <span className="font-medium text-gray-800">
            {admin?.name || "Admin"}
          </span>
        </p>
        <p>{admin?.email || "admin@example.com"}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Enter email"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* DEPARTMENT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Department</option>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="qa">QA / Testing</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        {/* DESIGNATION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Role
          </label>
          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Role</option>
            <option value="uiux">UI/UX Designer</option>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Full Stack Developer</option>
            <option value="tester">QA Tester</option>
            <option value="devops">DevOps Engineer</option>
          </select>
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* JOINING DATE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Joining Date
          </label>
          <input
            type="date"
            name="joiningDate"
            readOnly
            value={form.joiningDate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg 
            hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/employees")}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg 
            hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
