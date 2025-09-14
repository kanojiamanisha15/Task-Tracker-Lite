#!/usr/bin/env node

const { sequelize, User, Category, Task } = require("../models");

async function testDatabase() {
  try {
    console.log("🧪 Testing Database Setup...\n");

    // Test connection
    await sequelize.authenticate();
    console.log("✅ Database connection: OK");

    // Test models
    console.log("\n📊 Testing Models:");

    // Test User model
    const userCount = await User.count();
    console.log(`✅ Users: ${userCount}`);

    // Test Category model
    const categoryCount = await Category.count();
    console.log(`✅ Categories: ${categoryCount}`);

    // Test Task model
    const taskCount = await Task.count();
    console.log(`✅ Tasks: ${taskCount}`);

    // Test associations
    console.log("\n🔗 Testing Associations:");

    // Test User-Task association
    const userWithTasks = await User.findOne({
      include: [{ model: Task, as: "tasks" }],
    });
    console.log(
      `✅ User-Task association: ${userWithTasks ? "OK" : "No data"}`
    );

    // Test Category-Task association
    const categoryWithTasks = await Category.findOne({
      include: [{ model: Task, as: "tasks" }],
    });
    console.log(
      `✅ Category-Task association: ${categoryWithTasks ? "OK" : "No data"}`
    );

    // Test admin user
    const adminUser = await User.findOne({
      where: { email: "admin@tasktracker.com" },
    });
    console.log(`✅ Admin user: ${adminUser ? "Found" : "Not found"}`);

    if (adminUser) {
      console.log(`   - Name: ${adminUser.name}`);
      console.log(`   - Role: ${adminUser.role}`);
      console.log(`   - Created: ${adminUser.createdAt}`);
    }

    // Test categories
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });
    console.log(`\n📂 Categories (${categories.length}):`);
    categories.forEach((category) => {
      console.log(`   - ${category.name}: ${category.description}`);
    });

    // Test tasks
    const tasks = await Task.findAll({
      include: [
        { model: User, as: "user", attributes: ["name"] },
        { model: Category, as: "category", attributes: ["name"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    console.log(`\n📝 Recent Tasks (${tasks.length}):`);
    tasks.forEach((task) => {
      console.log(
        `   - ${task.title} (${task.status}) - ${
          task.user?.name || "Unknown"
        } - ${task.category?.name || "No category"}`
      );
    });

    console.log("\n🎉 Database test completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Start the server: npm run dev");
    console.log("2. Test API endpoints with Postman or curl");
    console.log("3. Login with admin credentials:");
    console.log("   Email: admin@tasktracker.com");
    console.log("   Password: admin123");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  testDatabase();
}

module.exports = testDatabase;
