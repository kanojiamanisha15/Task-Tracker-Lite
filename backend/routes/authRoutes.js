const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const {
  validateRegistration,
  validateLogin,
  validateTask,
} = require("../middleware/validation");

// Public routes
router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);

// Protected routes
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.put("/change-password", authenticateToken, changePassword);

module.exports = router;
