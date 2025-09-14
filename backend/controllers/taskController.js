const TaskService = require("../services/taskService");

// Get all tasks for the authenticated user
const getUserTasks = async (req, res) => {
  try {
    const {
      status,
      category_id,
      page = 1,
      limit = 10,
      sort_by = "createdAt",
      sort_order = "DESC",
      userId,
    } = req.query;
    let user_id;
    if (req.user.role === "admin") {
      user_id = userId ?? undefined; // Admin can filter by any user
    } else {
      user_id = req.user.userId;
    }

    const result = await TaskService.getUserTasks(user_id, {
      status,
      category_id,
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
    console.error("Get user tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

// Get single task
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await TaskService.getTaskById(id, userId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        task,
      },
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status = "todo",
      due_date,
      category_id,
    } = req.body;
    const userId = req.user.userId;

    // Validate category exists if provided
    if (category_id) {
      const categoryExists = await TaskService.categoryExists(category_id);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    const taskId = await TaskService.createTask({
      title,
      description,
      status,
      due_date,
      category_id,
      user_id: userId,
    });

    // Get the created task
    const newTask = await TaskService.getCreatedTask(taskId);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task: newTask,
      },
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date, category_id } = req.body;
    const userId = req.user.userId;

    // Validate category exists if provided
    if (category_id) {
      const categoryExists = await TaskService.categoryExists(category_id);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    try {
      const updatedTask = await TaskService.updateTask(id, userId, {
        title,
        description,
        status,
        due_date,
        category_id,
      });

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: {
          task: updatedTask,
        },
      });
    } catch (error) {
      if (
        error.message === "Cannot change status of tasks past their due date"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deleted = await TaskService.deleteTask(id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

module.exports = {
  getUserTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
