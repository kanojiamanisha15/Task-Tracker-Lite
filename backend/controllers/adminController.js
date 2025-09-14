const AdminService = require("../services/adminService");
const AuthService = require("../services/authService");

// Get all tasks for admin dashboard
const getAllTasks = async (req, res) => {
  try {
    const {
      user_id,
      status,
      category_id,
      due_date_from,
      due_date_to,
      page = 1,
      limit = 10,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = req.query;

    const result = await AdminService.getAllTasks({
      user_id,
      status,
      category_id,
      due_date_from,
      due_date_to,
      page,
      limit,
      sort_by,
      sort_order,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get all tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const stats = await AdminService.getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

// Get all users for admin
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const result = await AdminService.getAllUsers({
      page,
      limit,
      search,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Get user details with tasks
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await AdminService.getUserDetails(userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "admin" or "user"',
      });
    }

    // Check if user exists
    const user = await AuthService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user role
    await AuthService.updateUserRole(userId, role);

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await AuthService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (parseInt(userId) === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    // Delete user (tasks will be deleted due to CASCADE)
    await AuthService.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

module.exports = {
  getAllTasks,
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
};
