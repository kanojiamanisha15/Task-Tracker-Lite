const { User } = require("../models");

class AuthService {
  // Hash password
  static async hashPassword(password) {
    const bcrypt = require("bcryptjs");
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verify password
  static async verifyPassword(password, hashedPassword) {
    const bcrypt = require("bcryptjs");
    return await bcrypt.compare(password, hashedPassword);
  }

  // Create user
  static async createUser(userData) {
    const { name, email, password } = userData;

    const user = await User.create({
      name,
      email,
      password,
    });

    return user.id;
  }

  // Get user by email
  static async getUserByEmail(email) {
    const user = await User.findByEmail(email);
    return user ? user.toJSON() : null;
  }

  // Get user by ID
  static async getUserById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    return user ? user.toJSON() : null;
  }

  // Check if user exists by email
  static async isEmailTaken(email, excludeUserId = null) {
    const where = { email };
    if (excludeUserId) {
      where.id = { [require("sequelize").Op.ne]: excludeUserId };
    }
    const user = await User.findOne({ where });
    return !!user;
  }

  // Update user profile
  static async updateUserProfile(userId, updateData) {
    const { name, email } = updateData;

    // Check if email is already taken by another user
    if (email) {
      const isEmailTaken = await this.isEmailTaken(email, userId);
      if (isEmailTaken) {
        throw new Error("Email is already taken by another user");
      }
    }

    // Build update object
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    if (Object.keys(updates).length === 0) {
      throw new Error("No fields to update");
    }

    await User.update(updates, { where: { id: userId } });

    // Get updated user data
    return await this.getUserById(userId);
  }

  // Change user password
  static async changePassword(userId, currentPassword, newPassword) {
    // Get user with password
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Update password
    await User.update({ password: newPassword }, { where: { id: userId } });

    return true;
  }

  // Get user with password (for login)
  static async findUserByEmail(email) {
    const user = await User.findByEmailWithPassword(email);
    return user ? user.toJSON() : null;
  }

  // Get user password for verification
  static async getUserPassword(userId) {
    const user = await User.findByPk(userId, {
      attributes: ["password"],
    });
    return user ? user.password : null;
  }

  // Update user password
  static async updateUserPassword(userId, newPassword) {
    await User.update({ password: newPassword }, { where: { id: userId } });
    return true;
  }

  // Find user by ID
  static async findUserById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    return user ? user.toJSON() : null;
  }

  // Get all users (for admin)
  static async getAllUsers(filters = {}) {
    const { page = 1, limit = 10, search } = filters;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where[require("sequelize").Op.or] = [
        { name: { [require("sequelize").Op.like]: `%${search}%` } },
        { email: { [require("sequelize").Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: require("../models").Task,
          as: "tasks",
          attributes: ["id", "status"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    // Transform users to include task counts
    const transformedUsers = users.map((user) => {
      const userData = user.toJSON();
      const tasks = userData.tasks || [];
      userData.task_count = tasks.length;
      userData.completed_tasks = tasks.filter(
        (task) => task.status === "done"
      ).length;
      delete userData.tasks;
      return userData;
    });

    return {
      users: transformedUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalUsers: count,
        hasNextPage: page < Math.ceil(count / parseInt(limit)),
        hasPrevPage: page > 1,
        limit: parseInt(limit),
      },
    };
  }

  // Update user role
  static async updateUserRole(userId, role) {
    if (!["admin", "user"].includes(role)) {
      throw new Error('Invalid role. Must be either "admin" or "user"');
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update user role
    await User.update({ role }, { where: { id: userId } });

    return true;
  }

  // Delete user
  static async deleteUser(userId) {
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Delete user (tasks will be deleted due to CASCADE)
    await User.destroy({ where: { id: userId } });

    return true;
  }

  // Get user details with tasks
  static async getUserDetailsWithTasks(userId) {
    // Get user info
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's tasks
    const tasks = await require("../models").Task.findAll({
      where: { userId },
      include: [
        {
          model: require("../models").Category,
          as: "category",
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Get user statistics
    const stats = await require("../models").Task.getUserStats(userId);

    return {
      user: user.toJSON(),
      tasks: tasks.map((task) => task.toJSON()),
      stats,
    };
  }
}

module.exports = AuthService;
