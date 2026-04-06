const EmployeeModel = require("../models/employee_model");
const TaskModel = require("../models/task_model");
const bcrypt = require("bcrypt");
const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const employee = await EmployeeModel.findOne({ email }).select("+password");
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Login successful",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const GetEmployeeTasks = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "employeeId is required",
      });
    }
    const tasks = await TaskModel.find({ assignedTo: employeeId });
    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const UpdateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { employeeId, status, progress, important, note } = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "taskId is required",
      });
    }

    const task = await TaskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 🔹 Update basic fields
    if (status) task.status = status;
    if (progress !== undefined) task.progress = progress;
    if (important !== undefined) task.important = important;

    // 💬 Add note (CORRECT WAY)
    if (note && note.text) {
      task.notes.push({
        text: note.text,
        addedBy: employeeId || null,
      });
    }

    // 🔁 Activity log (VERY IMPORTANT FEATURE)
    task.activity.push({
      action: "task_updated",
      performedBy: employeeId || null,
    });

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const GetEmployeeProfile = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // ✅ 1. VALIDATION
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    // ✅ 2. FETCH EMPLOYEE
    const employee = await EmployeeModel.findById(employeeId)
      .select("-password")
      .lean(); // 🔥 convert to plain JS object

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // ✅ 3. FETCH TASKS (with sorting & optional fields)
    const tasks = await TaskModel.find({ assignedTo: employeeId })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    // ✅ 4. RESPONSE STRUCTURE (clean & scalable)
    return res.status(200).json({
      success: true,
      message: "Employee profile fetched successfully",
      data: {
        employee,
        tasks,
        totalTasks: tasks.length,
      },
    });
  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  UserLogin,
  GetEmployeeTasks,
  UpdateTask,
  GetEmployeeProfile,
};
