import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  User,
  Building,
  Shield,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate()

  let localUser = {};
  try {
    localUser = JSON.parse(localStorage.getItem("employee")) || {};
  } catch {
    navigate("/login")
  }

  const employeeId = localUser?.id || localUser?._id;

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/employee/profile/${employeeId}`,
      );

      setProfile(res.data.data.employee);
      setTasks(res.data.data.tasks || []);
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchUser();
  }, [employeeId]);

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.length - completedTasks;

  if (loading) return <Centered text="Loading profile..." />;
  if (error) return <Centered text={error} error />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 🔥 HERO HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-white text-indigo-600 flex items-center justify-center text-2xl font-bold shadow-lg">
              {profile?.name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{profile?.name}</h1>
              <p className="text-sm opacity-90">
                {profile?.designation} • {profile?.department}
              </p>

              <span className="mt-2 inline-block text-xs bg-white/20 px-3 py-1 rounded-full">
                ID: {profile?._id}
              </span>
            </div>
          </div>
        </div>

        {/* 🔥 GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <GlassSection title="👤 Personal Info">
              <Grid>
                <Card icon={<User />} label="Full Name" value={profile?.name} />
                <Card icon={<Mail />} label="Email" value={profile?.email} />
                <Card icon={<Phone />} label="Phone" value={profile?.phone} />
                <Card icon={<BadgeCheck />} label="Status" value="Active" />
              </Grid>
            </GlassSection>

            <GlassSection title="💼 Work Info">
              <Grid>
                <Card
                  icon={<Briefcase />}
                  label="Designation"
                  value={profile?.designation}
                />
                <Card
                  icon={<Building />}
                  label="Department"
                  value={profile?.department}
                />
                <Card
                  icon={<Calendar />}
                  label="Joining Date"
                  value={formatDate(profile?.joiningDate)}
                />
                <Card
                  icon={<Shield />}
                  label="Role"
                  value={profile?.role || "Employee"}
                />
              </Grid>
            </GlassSection>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <GlassSection title="👨‍💼 Supervisor">
              <p className="text-sm font-semibold text-gray-800">
                {profile?.createdBy?.name || "Supervisor"}
              </p>
              <p className="text-xs text-gray-500">
                {profile?.createdBy?.email}
              </p>
            </GlassSection>

            <GlassSection title="⚙️ Account Info">
              <Grid single>
                <Card label="Created" value={formatDate(profile?.createdAt)} />
                <Card label="Updated" value={formatDate(profile?.updatedAt)} />
                <Card label="Employee Code" value={profile?.employeeId} />
              </Grid>
            </GlassSection>
          </div>
        </div>

        {/* 🔥 PERFORMANCE */}
        <GlassSection title="📊 Performance Snapshot">
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-4">
            <Stat
              label="Completed"
              value={completedTasks}
              color="from-green-400 to-green-600"
            />
            <Stat
              label="Pending"
              value={pendingTasks}
              color="from-yellow-400 to-orange-500"
            />
            <Stat
              label="Total"
              value={tasks.length}
              color="from-indigo-500 to-indigo-700"
            />
            <Stat
              label="Rating"
              value="A+"
              color="from-pink-500 to-purple-600"
            />
          </div>
        </GlassSection>
      </div>
    </div>
  );
};

/* ================= PREMIUM UI COMPONENTS ================= */

const GlassSection = ({ title, children }) => (
  <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg">
    <h2 className="text-sm font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children, single }) => (
  <div
    className={`grid ${single ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}
  >
    {children}
  </div>
);

const Card = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition">
    {icon && <div className="text-indigo-600">{icon}</div>}
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);

const Stat = ({ label, value, color }) => (
  <div
    className={`p-4 rounded-xl text-white text-center shadow-lg bg-gradient-to-r ${color}`}
  >
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs opacity-80">{label}</p>
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

export default EmployeeProfile;
