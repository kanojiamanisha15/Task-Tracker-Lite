const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} = require("../controllers/categoryController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { validateCategory } = require("../middleware/validation");

// Public route - Get all categories (for users to see available categories)
router.get("/", getAllCategories);

// Public route - Get single category
router.get("/:id", getCategoryById);

// Admin-only routes
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validateCategory,
  createCategory
);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  validateCategory,
  updateCategory
);
router.delete("/:id", authenticateToken, requireAdmin, deleteCategory);
router.get(
  "/stats/overview",
  authenticateToken,
  requireAdmin,
  getCategoryStats
);

module.exports = router;
