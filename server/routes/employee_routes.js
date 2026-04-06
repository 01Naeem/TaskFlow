const express = require("express");
const EmployeeControllres = require("../controllers/employee_controllers")
const Router = express.Router();

Router.post("/login", EmployeeControllres.UserLogin);
Router.get("/tasks/:employeeId", EmployeeControllres.GetEmployeeTasks);
Router.put("/tasks/:taskId", EmployeeControllres.UpdateTask);
Router.get("/profile/:employeeId", EmployeeControllres.GetEmployeeProfile);



module.exports = Router;