const { User, Category, Task, sequelize } = require("../models");
const { Op } = require("sequelize");

class TaskService {
  // Get user tasks with filtering and pagination
  static async getUserTasks(userId, filters = {}) {
    const {
      status,
      category_id,
      page = 1,
      limit = 10,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = filters;

    // Build where clause
    const where = { userId };
    if (status) where.status = status;
    if (category_id) where.categoryId = category_id;

    // Validate sort parameters
    const allowedSortFields = [
      "createdAt",
      "updated_at",
      "due_date",
      "title",
      "status",
    ];
    const sortField = allowedSortFields.includes(sort_by)
      ? sort_by
      : "createdAt";
    const sortDirection = sort_order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get tasks with pagination
    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [[sortField, sortDirection]],
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

  // Get task by ID
  static async getTaskById(taskId, userId) {
    const task = await Task.findOne({
      where: { id: taskId, userId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
          required: false,
        },
      ],
    });

    if (!task) return null;

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
      category_id: taskData.categoryId,
    };
  }

  // Create task
  static async createTask(taskData) {
    const {
      title,
      description,
      status = "todo",
      due_date,
      category_id,
      user_id,
    } = taskData;

    // Validate category exists if provided
    if (category_id) {
      const categoryExists = await Category.findByPk(category_id);
      if (!categoryExists) {
        throw new Error("Category not found");
      }
    }

    const task = await Task.create({
      title,
      description,
      status,
      dueDate: due_date,
      categoryId: category_id,
      userId: user_id,
    });

    return task.id;
  }

  // Update task
  static async updateTask(taskId, userId, updateData) {
    const { title, description, status, due_date, category_id } = updateData;

    // Check if task exists and belongs to user
    const existingTask = await Task.findOne({
      where: { id: taskId, userId },
      attributes: ["id", "dueDate"],
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    // Check if due date has passed and user is trying to change status
    if (status && existingTask.dueDate) {
      const dueDate = new Date(existingTask.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day

      if (dueDate < today) {
        throw new Error("Cannot change status of tasks past their due date");
      }
    }

    // Validate category exists if provided
    if (category_id) {
      const categoryExists = await Category.findByPk(category_id);
      if (!categoryExists) {
        throw new Error("Category not found");
      }
    }

    // Build update object
    const updates = {};
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status) updates.status = status;
    if (due_date !== undefined) updates.dueDate = due_date;
    if (category_id !== undefined) updates.categoryId = category_id;

    if (Object.keys(updates).length === 0) {
      throw new Error("No fields to update");
    }

    await Task.update(updates, { where: { id: taskId, userId } });

    return await this.getTaskById(taskId, userId);
  }

  // Delete task
  static async deleteTask(taskId, userId) {
    // Check if task exists and belongs to user
    const existingTask = await Task.findOne({
      where: { id: taskId, userId },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    await Task.destroy({ where: { id: taskId, userId } });

    return true;
  }

  // Get task statistics for user
  static async getUserTaskStats(userId) {
    return await Task.getUserStats(userId);
  }

  // Check if category exists
  static async categoryExists(categoryId) {
    const category = await Category.findByPk(categoryId);
    return !!category;
  }

  // Get created task (for response)
  static async getCreatedTask(taskId) {
    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
          required: false,
        },
      ],
    });

    if (!task) return null;

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
      category_id: taskData.categoryId,
    };
  }
}

module.exports = TaskService;
