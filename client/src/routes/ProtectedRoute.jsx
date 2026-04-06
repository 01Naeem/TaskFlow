import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const employee = localStorage.getItem("employee");
  const admin = localStorage.getItem("admin");

  if (!employee && !admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;