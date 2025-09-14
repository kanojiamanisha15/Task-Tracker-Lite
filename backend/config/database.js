const { sequelize, testConnection, syncDatabase } = require("./sequelize");
const { initializeDatabase } = require("../models");

// Legacy pool for backward compatibility (if needed)
const pool = null;

module.exports = {
  pool,
  testConnection,
  initializeDatabase: async () => {
    await testConnection();
    await syncDatabase();
    await initializeDatabase();
  },
};
