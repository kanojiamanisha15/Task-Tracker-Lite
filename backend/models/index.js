const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

// Import models
const User = require("./User")(sequelize, DataTypes);
const Category = require("./Category")(sequelize, DataTypes);
const Task = require("./Task")(sequelize, DataTypes);

// Define associations
User.hasMany(Task, { foreignKey: "userId", as: "tasks" });
Task.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Category, { foreignKey: "createdBy", as: "createdCategories" });
Category.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

Category.hasMany(Task, { foreignKey: "categoryId", as: "tasks" });
Task.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Import syncDatabase from sequelize config
const { syncDatabase } = require("../config/sequelize");

// Initialize database with default data
const initializeDatabase = async () => {
  try {
    const DatabaseSeeder = require("../config/seed");
    await DatabaseSeeder.seed();
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Category,
  Task,
  syncDatabase,
  initializeDatabase,
};
