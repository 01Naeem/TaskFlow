import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginForm from "./pages/main/LoginForm";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import EmployeeForm from "./pages/admin/EmployeeForm";
import Employees from "./pages/admin/Employees";
import Tasks from "./pages/admin/Tasks";
import AssignTask from "./pages/admin/AssignTask";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeLayout from "./layouts/EmployeeLayout";
import EmployeeTasks from "./pages/employee/EmployeeTasks";
import ProtectedRoute from "./routes/ProtectedRoute";
import EmployeeProfile from "./pages/employee/EmployeeProfile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Route>
      </Routes>
      {/* <Routes>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route
            path="/admin/employees/create-employee"
            element={<EmployeeForm />}
          />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/tasks" element={<Tasks />} />
          <Route path="/admin/tasks/assign" element={<AssignTask />} />
        </Route>
      </Routes> */}
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* default → /admin */}
            <Route index element={<Dashboard />} />
            {/* optional → /admin/dashboard */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route
              path="employees/create-employee"
              element={<EmployeeForm />}
            />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/assign" element={<AssignTask />} />
          </Route>
        </Route>
      </Routes>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/employee" element={<EmployeeLayout />}>
            {/* default: /employee */}
            <Route index element={<EmployeeDashboard />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            {/* /employee/tasks */}
            <Route path="tasks" element={<EmployeeTasks />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
