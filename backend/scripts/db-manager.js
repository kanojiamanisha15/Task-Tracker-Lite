#!/usr/bin/env node

const { sequelize, syncDatabase } = require("../config/sequelize");
const DatabaseSeeder = require("../config/seed");

class DatabaseManager {
  static async sync() {
    try {
      console.log("🔄 Syncing database...");
      await syncDatabase();
    } catch (error) {
      console.error("❌ Database sync failed:", error.message);
      throw error;
    }
  }

  static async seed() {
    try {
      console.log("🌱 Seeding database...");
      await DatabaseSeeder.seed();
      console.log("✅ Database seeded successfully");
    } catch (error) {
      console.error("❌ Database seeding failed:", error.message);
      throw error;
    }
  }

  static async reset() {
    try {
      console.log("🔄 Resetting database...");
      await DatabaseSeeder.reset();
      console.log("✅ Database reset successfully");
    } catch (error) {
      console.error("❌ Database reset failed:", error.message);
      throw error;
    }
  }

  static async resetAndSeed() {
    try {
      await this.reset();
      await this.sync();
      await this.seed();
      console.log("🎉 Database reset and seeded successfully");
    } catch (error) {
      console.error("❌ Database reset and seed failed:", error.message);
      throw error;
    }
  }

  static async status() {
    try {
      console.log("📊 Database Status:");

      // Test connection
      await sequelize.authenticate();
      console.log("✅ Database connection: OK");

      // Check tables
      const [results] = await sequelize.query("SHOW TABLES");
      const tableNames = results.map((row) => Object.values(row)[0]);

      console.log(`📋 Tables found: ${tableNames.length}`);
      tableNames.forEach((table) => console.log(`  - ${table}`));

      // Check data counts
      const { User, Category, Task } = require("../models");

      const userCount = await User.count();
      const categoryCount = await Category.count();
      const taskCount = await Task.count();

      console.log(`👥 Users: ${userCount}`);
      console.log(`📂 Categories: ${categoryCount}`);
      console.log(`📝 Tasks: ${taskCount}`);
    } catch (error) {
      console.error("❌ Database status check failed:", error.message);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case "sync":
        await DatabaseManager.sync();
        break;
      case "seed":
        await DatabaseManager.seed();
        break;
      case "reset":
        await DatabaseManager.reset();
        break;
      case "reset-seed":
        await DatabaseManager.resetAndSeed();
        break;
      case "status":
        await DatabaseManager.status();
        break;
      default:
        console.log("🔧 Database Manager");
        console.log("==================");
        console.log("");
        console.log("Usage: node scripts/db-manager.js <command>");
        console.log("");
        console.log("Commands:");
        console.log("  sync        - Sync database schema");
        console.log("  seed        - Seed database with default data");
        console.log("  reset       - Reset database (drop all tables)");
        console.log("  reset-seed  - Reset and seed database");
        console.log("  status      - Show database status");
        console.log("");
        console.log("Examples:");
        console.log("  node scripts/db-manager.js sync");
        console.log("  node scripts/db-manager.js seed");
        console.log("  node scripts/db-manager.js reset-seed");
        console.log("  node scripts/db-manager.js status");
        break;
    }
  } catch (error) {
    console.error("❌ Command failed:", error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = DatabaseManager;
