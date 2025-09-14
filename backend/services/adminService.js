const { User, Category, Task, sequelize } = require("../models");
const { Op } = require("sequelize");

class AdminService {
  // Get dashboard statistics
  static async getDashboardStats() {
    // Overall statistics
    const overall = await Task.getOverallStats();

    // Tasks by status
    const statusBreakdown = await Task.getStatusStats();

    // Tasks by category
    const categoryBreakdown = await Task.getCategoryStats();

    // User activity
    const userActivity = await Task.getUserActivity();

    // Recent activity (last 7 days)
    const recentActivity = await Task.getRecentActivity(7);

    return {
      overall,
      statusBreakdown,
      categoryBreakdown,
      userActivity,
      recentActivity,
    };
  }

  // Get all tasks with advanced filtering
  static async getAllTasks(filters = {}) {
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
    } = filters;

    // Build where clause
    const where = {};
    if (user_id) where.userId = user_id;
    if (status) where.status = status;
    if (category_id) where.categoryId = category_id;
    if (due_date_from || due_date_to) {
      where.dueDate = {};
      if (due_date_from) where.dueDate[Op.gte] = due_date_from;
      if (due_date_to) where.dueDate[Op.lte] = due_date_to;
    }

    // Validate sort parameters
    const allowedSortFields = [
      "created_at",
      "updated_at",
      "due_date",
      "title",
      "status",
      "user_name",
    ];
    const sortField = allowedSortFields.includes(sort_by)
      ? sort_by
      : "createdAt";
    const sortDirection = sort_order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Build order clause
    let order;
    if (sortField === "user_name") {
      order = [[{ model: User, as: "user" }, "name", sortDirection]];
    } else {
      order = [[sortField, sortDirection]];
    }

    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get tasks with pagination
    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
          required: false,
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order,
      limit: parseInt(limit),
      offset,
    });

    // Transform tasks to match expected format
    const transformedTasks = tasks.map((task) => {
      const taskData = task.toJSON();
      return {
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        due_date: taskData.dueDate,
        created_at: taskData.createdAt,
        updated_at: taskData.updatedAt,
        user_name: taskData.user?.name || null,
        user_email: taskData.user?.email || null,
        user_id: taskData.userId,
        category_name: taskData.category?.name || null,
        category_id: taskData.categoryId,
      };
    });

    return {
      tasks: transformedTasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalTasks: count,
        hasNextPage: page < Math.ceil(count / parseInt(limit)),
        hasPrevPage: page > 1,
        limit: parseInt(limit),
      },
    };
  }

  // Get all users with pagination and search
  static async getAllUsers(filters = {}) {
    const { page = 1, limit = 10, search } = filters;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause for search
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    // Get users with task counts
    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Task,
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
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        created_at: userData.createdAt,
        task_count: tasks.length,
        completed_tasks: tasks.filter((task) => task.status === "done").length,
      };
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

  // Get user details with tasks
  static async getUserDetails(userId) {
    // Get user info
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's tasks
    const tasks = await Task.findAll({
      where: { userId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Get user statistics
    const stats = await Task.getUserStats(userId);

    return {
      user: user.toJSON(),
      tasks: tasks.map((task) => {
        const taskData = task.toJSON();
        return {
          id: taskData.id,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          due_date: taskData.dueDate,
          created_at: taskData.createdAt,
          updated_at: taskData.updatedAt,
          category_name: taskData.category?.name || null,
        };
      }),
      stats,
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

  // Get system statistics
  static async getSystemStats() {
    // Get total users by role
    const userRoleStats = await User.findAll({
      attributes: [
        "role",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["role"],
      raw: true,
    });

    // Get total categories
    const totalCategories = await Category.count();

    // Get tasks created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTasksStats = await Task.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "task_count"],
      ],
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "DESC"]],
      raw: true,
    });

    // Get most active users (last 30 days)
    const activeUsersStats = await User.findAll({
      attributes: [
        "name",
        "email",
        [sequelize.fn("COUNT", sequelize.col("tasks.id")), "tasks_created"],
      ],
      include: [
        {
          model: Task,
          as: "tasks",
          attributes: [],
          where: {
            createdAt: {
              [Op.gte]: thirtyDaysAgo,
            },
          },
          required: false,
        },
      ],
      group: ["User.id", "User.name", "User.email"],
      order: [[sequelize.fn("COUNT", sequelize.col("tasks.id")), "DESC"]],
      limit: 10,
      raw: true,
    });

    return {
      userRoleStats,
      totalCategories,
      recentTasksStats,
      activeUsersStats,
    };
  }

  // Get performance metrics
  static async getPerformanceMetrics() {
    // Average tasks per user
    const avgTasksPerUser = await Task.findAll({
      attributes: [
        [
          sequelize.fn("AVG", sequelize.literal("task_count")),
          "avg_tasks_per_user",
        ],
      ],
      from: sequelize.literal(`(
        SELECT COUNT(*) as task_count
        FROM tasks
        GROUP BY user_id
      ) as user_task_counts`),
      raw: true,
    });

    // Completion rate
    const completionRate = await Task.findOne({
      attributes: [
        [
          sequelize.literal(
            'ROUND((COUNT(CASE WHEN status = "done" THEN 1 END) * 100.0 / COUNT(*)), 2)'
          ),
          "completion_rate",
        ],
      ],
      raw: true,
    });

    // Overdue rate
    const overdueRate = await Task.findOne({
      attributes: [
        [
          sequelize.literal(
            'ROUND((COUNT(CASE WHEN due_date < CURDATE() AND status != "done" THEN 1 END) * 100.0 / COUNT(*)), 2)'
          ),
          "overdue_rate",
        ],
      ],
      where: {
        dueDate: {
          [Op.ne]: null,
        },
      },
      raw: true,
    });

    // Tasks by day of week
    const tasksByDayOfWeek = await Task.findAll({
      attributes: [
        [sequelize.fn("DAYNAME", sequelize.col("createdAt")), "day_of_week"],
        [sequelize.fn("COUNT", sequelize.col("id")), "task_count"],
      ],
      group: [
        sequelize.fn("DAYOFWEEK", sequelize.col("createdAt")),
        sequelize.fn("DAYNAME", sequelize.col("createdAt")),
      ],
      order: [[sequelize.fn("DAYOFWEEK", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    return {
      avgTasksPerUser: avgTasksPerUser[0]?.avg_tasks_per_user || 0,
      completionRate: completionRate?.completion_rate || 0,
      overdueRate: overdueRate?.overdue_rate || 0,
      tasksByDayOfWeek,
    };
  }
}

module.exports = AdminService;
