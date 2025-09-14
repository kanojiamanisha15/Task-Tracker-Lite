const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats);
router.get("/tasks", getAllTasks);
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);
router.put("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);

module.exports = router;
