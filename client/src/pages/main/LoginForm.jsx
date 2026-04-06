import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ Toastify import
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const [role, setRole] = useState("employee");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!formData.email || !formData.password) {
      return "All fields are required";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Invalid email format";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/${role}/login`,
        {
          ...formData,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      console.log("✅ Login success:", res.data);

      localStorage.setItem(
        `${role}`,
        JSON.stringify(res.data.admin || res.data.employee),
      );

      toast.success(res.data.message);

      setTimeout(() => {
        navigate(`/${role}`);
      }, 1000);
    } catch (err) {
      console.error(err);

      const message = err.response?.data?.message || "Login failed. Try again.";

      setError(message);
      toast.error(message); // ✅ added
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">      
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setRole("employee")}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition ${
              role === "employee"
                ? "bg-white shadow text-gray-900"
                : "text-gray-600"
            }`}
          >
            Employee
          </button>

          <button
            onClick={() => setRole("admin")}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition ${
              role === "admin"
                ? "bg-white shadow text-gray-900"
                : "text-gray-600"
            }`}
          >
            Admin
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="*******"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                type="checkbox"
                className="accent-gray-900"
              />
              Remember me
            </label>

            <button type="submit" className="text-gray-600 hover:text-gray-900">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            {loading ? "Signing in..." : `Sign in as ${role}`}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Don’t have an account?{" "}
          <span className="text-gray-900 font-medium cursor-pointer">
            Contact admin
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
