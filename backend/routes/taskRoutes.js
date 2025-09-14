const express = require("express");
const router = express.Router();
const {
  getUserTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/auth");
const {
  validateTask,
  validateTaskUpdate,
} = require("../middleware/validation");

// All task routes require authentication
router.use(authenticateToken);

// Task routes
router.get("/", getUserTasks);
router.get("/:id", getTaskById);
router.post("/", validateTask, createTask);
router.put("/:id", validateTaskUpdate, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
