const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("====================================");
    console.log("decoded", decoded);
    console.log("====================================");

    // Add user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

// Check if user is admin or the task owner
const requireAdminOrOwner = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }

  // For non-admin users, check if they own the resource
  const resourceUserId = req.params.userId || req.body.userId;
  if (resourceUserId && parseInt(resourceUserId) !== req.user.userId) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own resources.",
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAdminOrOwner,
};
