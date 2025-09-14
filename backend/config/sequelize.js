const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || "task_tracker_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize database connected successfully");
  } catch (error) {
    console.error("❌ Sequelize database connection failed:", error.message);
    process.exit(1);
  }
};

// Sync database function
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("✅ Database synchronized successfully");
  } catch (error) {
    console.error("❌ Database synchronization failed:", error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
};
