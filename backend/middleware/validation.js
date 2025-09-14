const { body, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

// User login validation
const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Category validation
const validateCategory = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Category name must be between 1 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  handleValidationErrors,
];

// Task validation
const validateTask = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Task title must be between 1 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  body("status")
    .optional()
    .isIn(["todo", "doing", "done"])
    .withMessage("Status must be one of: todo, doing, done"),
  body("due_date")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
  body("category_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  handleValidationErrors,
];

// Task update validation
const validateTaskUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Task title must be between 1 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  body("status")
    .optional()
    .isIn(["todo", "doing", "done"])
    .withMessage("Status must be one of: todo, doing, done"),
  body("due_date")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
  body("category_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateCategory,
  validateTask,
  validateTaskUpdate,
};
