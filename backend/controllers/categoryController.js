const CategoryService = require("../services/categoryService");

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryService.getAllCategories();

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// Get single category
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

// Create new category (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const createdBy = req.user.userId;

    // Check if category with same name already exists
    const isNameExists = await CategoryService.isCategoryNameExists(name);
    if (isNameExists) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const categoryId = await CategoryService.createCategory({
      name,
      description,
      createdBy,
    });

    // Get the created category
    const newCategory = await CategoryService.getCategoryById(categoryId);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category: newCategory,
      },
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// Update category (Admin only)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if category exists
    const existingCategory = await CategoryService.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if new name conflicts with existing category
    if (name) {
      const isNameExists = await CategoryService.isCategoryNameExists(name, id);
      if (isNameExists) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    // Update category
    const updatedCategory = await CategoryService.updateCategory(id, {
      name,
      description,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        category: updatedCategory,
      },
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

// Delete category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existingCategory = await CategoryService.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category is being used by any tasks
    const isInUse = await CategoryService.isCategoryInUse(id);
    if (isInUse) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category as it is being used by tasks",
      });
    }

    await CategoryService.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

// Get category statistics (Admin only)
const getCategoryStats = async (req, res) => {
  try {
    const categoryStats = await CategoryService.getCategoryStats();

    res.status(200).json({
      success: true,
      data: {
        categoryStats,
      },
    });
  } catch (error) {
    console.error("Get category stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category statistics",
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
};
