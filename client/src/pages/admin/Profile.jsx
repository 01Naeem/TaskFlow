import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  Phone,
  Shield,
  Calendar,
  User,
  Building,
  Settings,
} from "lucide-react";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let localAdmin = {};
  try {
    localAdmin = JSON.parse(localStorage.getItem("admin")) || {};
  } catch {}

  const adminId = localAdmin?.id || localAdmin?._id;

  const fetchAdmin = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/profile/${adminId}`,
      );
      setAdmin(res.data.data);
      console.log(res.data)
    } catch {
      setError("Failed to load admin profile");
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-semibold">
                {admin?.name?.charAt(0)}
              </div>

              <div>
                <h1 className="text-xl font-semibold">{admin?.name}</h1>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-white/20 rounded">
                    {admin?.role || "Admin"}
                  </span>

                  <span className="text-xs px-2 py-1 bg-green-400/20 text-green-100 rounded">
                    ● Active
                  </span>
                </div>

                <p className="text-xs mt-2 opacity-80">
                  Admin ID: {admin?._id?.slice(-6)}
                </p>
              </div>
            </div>

            <div className="text-sm space-y-1 text-white/90">
              <p>Email: {admin?.email}</p>
              <p>Phone: {admin?.phone || "N/A"}</p>
              <p>Last Login: {formatDate(admin?.lastLogin)}</p>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <Section title="Administrator Details">
              <Grid>
                <Info
                  icon={<User />}
                  label="Full Name"
                  value={admin?.name}
                  color="indigo"
                />
                <Info
                  icon={<Mail />}
                  label="Email"
                  value={admin?.email}
                  color="blue"
                />
                <Info
                  icon={<Phone />}
                  label="Phone"
                  value={admin?.phone}
                  color="green"
                />
                <Info
                  icon={<Shield />}
                  label="Role"
                  value={admin?.role}
                  color="purple"
                />
              </Grid>
            </Section>

            <Section title="Organization Information">
              <Grid>
                <Info
                  icon={<Building />}
                  label="Organization"
                  value={admin?.organization || "TaskFlow"}
                  color="indigo"
                />
                <Info
                  icon={<Settings />}
                  label="Access Level"
                  value="Full Access"
                  color="blue"
                />
                <Info
                  icon={<Calendar />}
                  label="Created"
                  value={formatDate(admin?.createdAt)}
                  color="green"
                />
                <Info
                  icon={<Calendar />}
                  label="Updated"
                  value={formatDate(admin?.updatedAt)}
                  color="purple"
                />
              </Grid>
            </Section>

            <Section title="Activity Overview">
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>Employees Managed</span>
                  <span className="font-medium text-indigo-600">
                    {admin?.stats?.employees || 0}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Tasks Created</span>
                  <span className="font-medium text-blue-600">
                    {admin?.stats?.tasks || 0}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Departments</span>
                  <span className="font-medium text-purple-600">
                    {admin?.stats?.departments || 0}
                  </span>
                </li>
              </ul>
            </Section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <Section title="System Summary">
              <div className="space-y-3">
                <Stat
                  label="Employees"
                  value={admin?.stats?.employees || 0}
                  color="indigo"
                />
                <Stat
                  label="Tasks"
                  value={admin?.stats?.tasks || 0}
                  color="blue"
                />
                <Stat
                  label="Departments"
                  value={admin?.stats?.departments || 0}
                  color="purple"
                />
                <Stat
                  label="Active Users"
                  value={admin?.stats?.active || 0}
                  color="green"
                />
              </div>
            </Section>

            <Section title="Permissions">
              <ul className="text-sm space-y-2 text-gray-600">
                <li className="text-green-600">✔ Manage Employees</li>
                <li className="text-green-600">✔ Assign Tasks</li>
                <li className="text-green-600">✔ View Reports</li>
                <li className="text-green-600">✔ System Config</li>
              </ul>
            </Section>

            <Section title="System Info">
              <div className="text-sm text-gray-600 space-y-1">
                <p>Environment: Production</p>
                <p>Last Login: {formatDate(admin?.lastLogin)}</p>
                <p>Status: Active</p>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

/* UI COMPONENTS */

const Section = ({ title, children }) => (
  <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
    <h2 className="text-sm font-semibold text-gray-800 mb-4 border-b pb-2">
      {title}
    </h2>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Info = ({ icon, label, value, color }) => (
  <div className="flex items-start gap-3">
    <div
      className={`mt-1 
      ${color === "indigo" && "text-indigo-500"}
      ${color === "blue" && "text-blue-500"}
      ${color === "green" && "text-green-500"}
      ${color === "purple" && "text-purple-500"}
    `}
    >
      {icon}
    </div>

    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">
        {value || "Not available"}
      </p>
    </div>
  </div>
);

const Stat = ({ label, value, color }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <p className="text-sm text-gray-600">{label}</p>
    <p
      className={`text-sm font-semibold 
      ${color === "indigo" && "text-indigo-600"}
      ${color === "blue" && "text-blue-600"}
      ${color === "purple" && "text-purple-600"}
      ${color === "green" && "text-green-600"}
    `}
    >
      {value}
    </p>
  </div>
);

const Centered = ({ text, error }) => (
  <div
    className={`min-h-screen flex items-center justify-center ${error ? "text-red-500" : "text-gray-500"}`}
  >
    {text}
  </div>
);

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "N/A";

export default Profile;
