import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Trash2, Eye, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // 🔥 Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/employees`,
      );

      setEmployees(res.data.data || []);
      setFiltered(res.data.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🔍 SEARCH FILTER
  useEffect(() => {
    const filteredData = employees.filter((emp) =>
      `${emp.name} ${emp.email} ${emp.department} ${emp.designation} ${emp.createdBy?.name || "Admin"}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
    setFiltered(filteredData);
  }, [search, employees]);

  // 🗑 DELETE EMPLOYEE
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/employees/${id}`,
      );

      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="text-indigo-600" />
          <h1 className="text-lg font-semibold text-gray-900">Employees</h1>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* SEARCH */}
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg 
              focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            />
          </div>

          {/* 🔥 ASSIGN TASK BUTTON */}
          <button
            onClick={() => navigate("/admin/tasks/assign")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white 
            text-sm rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus size={16} />
            Assign Task
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Loading employees...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No employees found
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Department</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Created By</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((emp) => (
                    <tr key={emp._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {emp.name}
                      </td>

                      <td className="px-4 py-3 text-gray-600">{emp.email}</td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-md">
                          {emp.department}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {emp.designation}
                      </td>

                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {emp.createdBy?.name || "Admin"}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {/* 🔥 ASSIGN TASK PER EMPLOYEE */}
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/tasks/assign?employee=${emp._id}`,
                              )
                            }
                            className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                          >
                            Assign Task
                          </button>

                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS */}
          <div className="grid gap-4 md:hidden">
            {filtered.map((emp) => (
              <div
                key={emp._id}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
              >
                <h2 className="font-semibold text-gray-900">{emp.name}</h2>
                <p className="text-sm text-gray-500">{emp.email}</p>

                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Role:</strong> {emp.designation}
                  </p>
                  <p>
                    <strong>Dept:</strong> {emp.department}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() =>
                      navigate(`/admin/tasks/assign?employee=${emp._id}`)
                    }
                    className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded"
                  >
                    Assign Task
                  </button>

                  <div className="flex gap-2">
                    <button className="p-2 rounded hover:bg-gray-100">
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="p-2 rounded hover:bg-red-50 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Employees;
