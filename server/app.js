const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDataBase = require("./config/database_connection");

// Import Routes
const AdminRoutes = require("./routes/admin_routes");
const EmployeeRoutes = require("./routes/employee_routes");


// 🔐 Load environment variables
dotenv.config();

console.log(process.env.MONGODB_URI); 

const PORT = process.env.PORT || 5000;

const app = express();

// 🔌 Connect Database
connectDataBase();

// 🌐 Middlewares
app.use(cors({
  origin: "https://task-flow-b9qj1btpt-01naeems-projects.vercel.app",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/taskflow/admin", AdminRoutes);
app.use("/taskflow/employee", EmployeeRoutes);
// 🏠 Health check route (important in production)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 API is running successfully",
    environment: process.env.NODE_ENV || "development",
  });
});

// ❌ 404 Handler (must be after routes)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// 🔥 Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔴 Server Error:", err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`
🟢 Server Started Successfully
--------------------------------
Port        : ${PORT}
Environment : ${process.env.NODE_ENV || "development"}
--------------------------------
  `);
});
