const express = require("express");
const AdminControllers  = require("../controllers/admin_controllers")
const router = express.Router();

router.post("/login", AdminControllers.AdminLogin);
router.post("/employees/create-employee", AdminControllers.CreateEmployee);
router.get("/employees", AdminControllers.Employees);
router.get("/employees", AdminControllers.Employees);
router.post("/tasks/assign", AdminControllers.AssignTask);
router.get("/tasks", AdminControllers.GetTasks);
router.delete("/tasks/delete/:id", AdminControllers.DeleteTask);
router.put("/tasks/final-approve/:id", AdminControllers.ApproveTask);

module.exports = router;