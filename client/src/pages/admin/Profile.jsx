import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  Phone,
  Shield,
  Calendar,
  User,
  Building,
  BadgeCheck,
  Settings,
} from "lucide-react";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 GET ADMIN FROM LOCAL STORAGE
  let localAdmin = {};
  try {
    localAdmin = JSON.parse(localStorage.getItem("admin")) || {};
  } catch {
    localAdmin = {};
  }

  const adminId = localAdmin?.id || localAdmin?._id;

  // 🔥 FETCH ADMIN DATA
  const fetchAdmin = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/profile/${adminId}`,
      );
      setAdmin(res.data.data);
    } catch (err) {
      setError("Failed to load admin profile", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  if (loading) return <Centered text="Loading profile..." />;
  if (error) return <Centered text={error} error />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 🔥 HEADER */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white text-gray-900 flex items-center justify-center text-xl font-bold">
                {admin?.name?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <h1 className="text-lg font-semibold">{admin?.name}</h1>
                <p className="text-sm opacity-80">
                  {admin?.role || "Administrator"}
                </p>

                <span className="inline-block mt-1 text-xs px-2 py-1 bg-white/20 rounded">
                  Admin ID: {admin?._id?.slice(-6) || "ADM-001"}
                </span>
              </div>
            </div>

            <span className="text-xs bg-green-500/20 px-2 py-1 rounded">
              Active
            </span>
          </div>
        </div>

        {/* 🔥 GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <Section title="Administrator Information">
              <Grid>
                <Card icon={<User />} label="Full Name" value={admin?.name} />
                <Card icon={<Mail />} label="Email" value={admin?.email} />
                <Card icon={<Phone />} label="Phone" value={admin?.phone} />
                <Card
                  icon={<Shield />}
                  label="Role"
                  value={admin?.role || "Admin"}
                />
              </Grid>
            </Section>

            <Section title="Organization Details">
              <Grid>
                <Card
                  icon={<Building />}
                  label="Organization"
                  value={admin?.organization || "TaskFlow Inc."}
                />
                <Card
                  icon={<Settings />}
                  label="System Access"
                  value="Full Access"
                />
                <Card
                  icon={<Calendar />}
                  label="Account Created"
                  value={formatDate(admin?.createdAt)}
                />
                <Card
                  icon={<Calendar />}
                  label="Last Updated"
                  value={formatDate(admin?.updatedAt)}
                />
              </Grid>
            </Section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* 🔥 MANAGEMENT SUMMARY */}
            <Section title="Management Summary">
              <div className="grid grid-cols-2 gap-4">
                <Stat label="Employees" value={admin?.stats?.employees || 0} />
                <Stat label="Tasks Created" value={admin?.stats?.tasks || 0} />
                <Stat
                  label="Departments"
                  value={admin?.stats?.departments || 0}
                />
                <Stat label="Active Users" value={admin?.stats?.active || 0} />
              </div>
            </Section>

            {/* 🔥 PERMISSIONS */}
            <Section title="Permissions">
              <div className="space-y-2 text-sm text-gray-600">
                <p>✔ Manage Employees</p>
                <p>✔ Assign Tasks</p>
                <p>✔ View Reports</p>
                <p>✔ System Configuration</p>
              </div>
            </Section>

            {/* 🔥 SYSTEM INFO */}
            <Section title="System Info">
              <p className="text-xs text-gray-500">
                Last login: {formatDate(admin?.lastLogin)}
              </p>
              <p className="text-xs text-gray-500">Environment: Production</p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
    <h2 className="text-sm font-semibold text-gray-900 mb-4">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Card = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-700">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">
        {value || "Not available"}
      </p>
    </div>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
    <p className="text-lg font-semibold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const Centered = ({ text, error }) => (
  <div
    className={`min-h-screen flex items-center justify-center ${error ? "text-red-500" : "text-gray-500"}`}
  >
    {text}
  </div>
);

const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString() : "N/A";
};

export default Profile;
