const { Category, User } = require("../models");

class CategoryService {
  // Get all categories
  static async getAllCategories() {
    const categories = await Category.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return categories.map((category) => {
      const categoryData = category.toJSON();
      categoryData.created_by_name = categoryData.creator?.name || null;
      delete categoryData.creator;
      return categoryData;
    });
  }

  // Get category by ID
  static async getCategoryById(categoryId) {
    const category = await Category.findByPk(categoryId, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name"],
          required: false,
        },
      ],
    });

    if (!category) return null;

    const categoryData = category.toJSON();
    categoryData.created_by_name = categoryData.creator?.name || null;
    delete categoryData.creator;
    return categoryData;
  }

  // Create category
  static async createCategory(categoryData) {
    const { name, description, createdBy } = categoryData;

    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }

    const category = await Category.create({
      name,
      description,
      createdBy,
    });

    return category.id;
  }

  // Update category
  static async updateCategory(categoryId, updateData) {
    const { name, description } = updateData;

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    // Check if new name conflicts with existing category
    if (name) {
      const existingCategory = await Category.findOne({
        where: {
          name,
          id: { [require("sequelize").Op.ne]: categoryId },
        },
      });

      if (existingCategory) {
        throw new Error("Category with this name already exists");
      }
    }

    // Build update object
    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;

    if (Object.keys(updates).length === 0) {
      throw new Error("No fields to update");
    }

    await Category.update(updates, { where: { id: categoryId } });

    return await this.getCategoryById(categoryId);
  }

  // Delete category
  static async deleteCategory(categoryId) {
    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    // Check if category is being used by any tasks
    const usageCount = await Category.getUsageCount(categoryId);
    if (usageCount > 0) {
      throw new Error("Cannot delete category as it is being used by tasks");
    }

    await Category.destroy({ where: { id: categoryId } });

    return true;
  }

  // Get category statistics
  static async getCategoryStats() {
    const { Task } = require("../models");
    const { sequelize } = require("../config/sequelize");

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
          model: Task,
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
  }

  // Check if category exists
  static async categoryExists(categoryId) {
    return await Category.existsById(categoryId);
  }

  // Check if category name exists
  static async isCategoryNameExists(name, excludeId = null) {
    return await Category.isNameExists(name, excludeId);
  }

  // Check if category is in use
  static async isCategoryInUse(categoryId) {
    const usageCount = await Category.getUsageCount(categoryId);
    return usageCount > 0;
  }

  // Get category usage count
  static async getCategoryUsageCount(categoryId) {
    return await Category.getUsageCount(categoryId);
  }
}

module.exports = CategoryService;
