import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  // ✅ handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ basic validation
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
  // ✅ submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      return setError(validationError);
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
          withCredentials: true, // if using cookies/session
        },
      );

      console.log("✅ Login success:", res.data);
      // Store user Object in localStorage
      localStorage.setItem(`${role}`, JSON.stringify(res.data.admin || res.data.employee));
      navigate(`/${role}`);

      // 🔁 redirect logic (add navigate)
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* ROLE SWITCH */}
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

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
          {/* EMAIL */}
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

          {/* PASSWORD */}
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

          {/* OPTIONS */}
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

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-2.5 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            {loading ? "Signing in..." : `Sign in as ${role}`}
          </button>
        </form>

        {/* FOOTER */}
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
