const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [1, 200],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      status: {
        type: DataTypes.ENUM("todo", "doing", "done"),
        defaultValue: "todo",
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "due_date",
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
        field: "category_id",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        field: "user_id",
      },
    },
    {
      tableName: "tasks",
      timestamps: true,
    }
  );

  // Class methods
  Task.getUserStats = async function (userId) {
    const stats = await this.findOne({
      where: { userId },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "total_tasks"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN status = 'todo' THEN 1 END")
          ),
          "todo_count",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN status = 'doing' THEN 1 END")
          ),
          "doing_count",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN status = 'done' THEN 1 END")
          ),
          "done_count",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              "CASE WHEN due_date < CURDATE() AND status != 'done' THEN 1 END"
            )
          ),
          "overdue_count",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              "CASE WHEN due_date = CURDATE() AND status != 'done' THEN 1 END"
            )
          ),
          "due_today_count",
        ],
      ],
      raw: true,
    });

    return (
      stats || {
        total_tasks: 0,
        todo_count: 0,
        doing_count: 0,
        done_count: 0,
        overdue_count: 0,
        due_today_count: 0,
      }
    );
  };

  Task.getOverallStats = async function () {
    const stats = await this.findOne({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "total_tasks"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN status = 'todo' THEN 1 END")
          ),
          "todo_count",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN status = 'doing' THEN 1 END")
          ),
          "doing_count",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN status = 'done' THEN 1 END")
          ),
          "done_count",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              "CASE WHEN due_date < CURDATE() AND status != 'done' THEN 1 END"
            )
          ),
          "overdue_count",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              "CASE WHEN due_date = CURDATE() AND status != 'done' THEN 1 END"
            )
          ),
          "due_today_count",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("user_id"))
          ),
          "total_users",
        ],
      ],
      raw: true,
    });

    return (
      stats || {
        total_tasks: 0,
        todo_count: 0,
        doing_count: 0,
        done_count: 0,
        overdue_count: 0,
        due_today_count: 0,
        total_users: 0,
      }
    );
  };

  Task.getStatusStats = async function () {
    const totalTasks = await this.count();

    const stats = await this.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [
          sequelize.literal(`ROUND(COUNT(*) * 100.0 / ${totalTasks}, 2)`),
          "percentage",
        ],
      ],
      group: ["status"],
      order: [[sequelize.literal("count"), "DESC"]],
      raw: true,
    });

    return stats;
  };

  Task.getCategoryStats = async function () {
    const { Category } = require("./index");

    const stats = await Category.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("COUNT", sequelize.col("tasks.id")), "task_count"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN tasks.status = 'todo' THEN 1 END")
          ),
          "todo_count",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN tasks.status = 'doing' THEN 1 END")
          ),
          "doing_count",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN tasks.status = 'done' THEN 1 END")
          ),
          "done_count",
        ],
      ],
      include: [
        {
          model: this,
          as: "tasks",
          attributes: [],
          required: false,
        },
      ],
      group: ["Category.id", "Category.name"],
      order: [[sequelize.literal("task_count"), "DESC"]],
      raw: true,
    });

    return stats;
  };

  Task.getUserActivity = async function () {
    const { User } = require("./index");

    const stats = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        [sequelize.fn("COUNT", sequelize.col("tasks.id")), "total_tasks"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN tasks.status = 'done' THEN 1 END")
          ),
          "completed_tasks",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              "CASE WHEN tasks.due_date < CURDATE() AND tasks.status != 'done' THEN 1 END"
            )
          ),
          "overdue_tasks",
        ],
        [
          sequelize.fn("MAX", sequelize.col("tasks.created_at")),
          "last_task_created",
        ],
      ],
      include: [
        {
          model: this,
          as: "tasks",
          attributes: [],
          required: false,
        },
      ],
      group: ["User.id", "User.name", "User.email"],
      order: [[sequelize.literal("total_tasks"), "DESC"]],
      raw: true,
    });

    return stats;
  };

  Task.getRecentActivity = async function (days = 7) {
    const { User, Category } = require("./index");
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);

    const tasks = await this.findAll({
      attributes: ["id", "title", "status", "createdAt"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name"],
          required: false,
        },
        {
          model: Category,
          as: "category",
          attributes: ["name"],
          required: false,
        },
      ],
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      created_at: task.createdAt,
      user_name: task.user?.name || null,
      category_name: task.category?.name || null,
    }));
  };

  return Task;
};
