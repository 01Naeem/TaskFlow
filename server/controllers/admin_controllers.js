const AdminModel = require("../models/admin_model");
const UserModel = require("../models/employee_model");
const TaskModel = require("../models/task_model");
const generatePassword = require("../utils/generatePassword");
const bcrypt = require("bcrypt");
const sendEmail = require("../services/email.service");
const sendTaskEmail = require("../services/sendTaskEmail");

const AdminLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // ❌ Required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ❌ Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // ❌ Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ❌ Role check
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // 🔍 Find admin
    const admin = await AdminModel.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // 🔐 Compare password
    const isMatch = password === admin.password;

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("🔴 AdminLogin Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const CreateEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      department,
      designation,
      role = "employee",
      phone,
      joiningDate,
      createdBy,
    } = req.body;

    // ✅ 1. VALIDATION
    if (!name || !email || !department || !designation) {
      return res.status(400).json({
        success: false,
        message: "Name, email, department and designation are required.",
      });
    }

    // ✅ 2. CHECK DUPLICATE EMAIL
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Employee with this email already exists.",
      });
    }

    // 🔐 3. GET ADMIN FROM TOKEN (BEST PRACTICE)
    const adminName = req.body.createdBy?.name || "Admin";
    const adminEmail = req.body.createdBy?.email || "admin@example.com";

    // 🔥 4. GENERATE + HASH PASSWORD
    const rawPassword = generatePassword(8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // ✅ 5. CREATE USER
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      department,
      designation,
      role,
      phone,
      joiningDate,
      createdBy: {
        name: adminName,
        email: adminEmail,
      },
    });

    console.log(adminName);

    // 📧 6. SEND EMAIL (NON-BLOCKING)
    // ✅ Send email (clean)
    sendEmail({
      name,
      email,
      password: rawPassword,
      department,
      designation,
      adminName,
    }).catch((err) => console.error(err));

    // ✅ 7. RESPONSE
    res.status(201).json({
      success: true,
      message: "Employee account created successfully.",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        designation: newUser.designation,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("🔴 Server Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const Employees = async (req, res) => {
  try {
    const employees = await UserModel.find({ role: "employee" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: employees,
    });
  } catch (error) {
    console.error("🔴 Server Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
// const AssignTask = async (req, res) => {
//   try {
//     const { title, description, assignedTo, priority, dueDate } = req.body;
//     const task = await TaskModel.create({
//       title: title,
//       description: description,
//       priority: priority,
//       dueDate: dueDate,
//       assignedTo: assignedTo,
//     });

//     // ✅ SEND EMAIL
//     await sendTaskEmail({
//       name: employee.name,
//       email: employee.email,
//       title,
//       description,
//       priority,
//       dueDate: formattedDate,
//       adminName: "Admin", // or from req.user
//     }).catch((err) => console.error("Email Error:", err.message));

//     res.status(201).json({
//       success: true,
//       message: "Task assigned and email sent successfully",
//       data: task,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Task assigned successfully",
//       data: task,
//     });
//   } catch (error) {
//     console.error("🔴 Server Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error. Please try again later.",
//     });
//   }
// };

const AssignTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, assignedBy } =
      req.body;

    // ✅ 1. VALIDATION
    if (!title || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Title and assigned employee are required",
      });
    }

    // ✅ 2. FIND EMPLOYEE
    const employee = await UserModel.findById(assignedTo);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // ✅ 3. CREATE TASK
    const task = await TaskModel.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      assignedBy, // Store admin ID for reference
    });

    // ✅ 4. FORMAT DATE
    const formattedDate = dueDate
      ? new Date(dueDate).toLocaleDateString()
      : "Not specified";

    // ✅ 5. GET ADMIN (if available)
    const adminName = req.body.createdBy?.name || "Admin";

    // ✅ 6. SEND EMAIL (NON-BLOCKING SAFE)
    try {
      await sendTaskEmail({
        name: employee.name,
        email: employee.email,
        title,
        description,
        priority,
        dueDate: formattedDate,
        adminName,
        taskId: task._id,
        taskLink: "http://localhost:5173/employee/tasks",
      });

      console.log("✅ Email function executed");
    } catch (err) {
      console.error("📧 Email Error:", err.message);
    }

    // ✅ 7. RESPONSE (ONLY ONCE)
    return res.status(201).json({
      success: true,
      message: "Task assigned successfully",
      data: task,
    });
  } catch (error) {
    console.error("🔴 Server Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const GetTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find()
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name")
      .populate("activity.performedBy", "name");
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("🔴 Server Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const DeleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("🔴 Server Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const ApproveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy } = req.body;
    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status = status;
    task.approvedBy = approvedBy;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("🔴 Server Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const GetAdminProfile = async (req, res) => {
  try {
    const { adminId } = req.params;

    // ✅ 1. VALIDATION
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
    }

    // ✅ 2. FIND ADMIN (exclude password)
    const admin = await AdminModel.findById(adminId)

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const employees = await UserModel.find({ "createdBy.email": admin.email });
    const tasks = await TaskModel.find({ assignedBy: adminId });

    // ✅ 3. OPTIONAL: ADD STATS (dynamic or placeholder)
    const data = {
      ...admin.toObject(),
      stats: {
        employees: employees.length,
        tasks: tasks.length,
        departments: [...new Set(employees.map((e) => e.department))].length,
        active: tasks.filter((t) => t.status === "active").length,
      },
    };

    // ✅ 4. SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      message: "Admin profile fetched successfully",
      data,
    });
  } catch (error) {
    console.error("🔴 GetAdminProfile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { GetAdminProfile };

module.exports = {
  AdminLogin,
  CreateEmployee,
  Employees,
  AssignTask,
  GetTasks,
  DeleteTask,
  ApproveTask,
  GetAdminProfile,
};
