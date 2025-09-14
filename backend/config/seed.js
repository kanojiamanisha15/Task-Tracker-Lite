const { User, Category, Task } = require("../models");
const bcrypt = require("bcryptjs");

class DatabaseSeeder {
  // Seed admin user
  static async seedAdminUser() {
    try {
      // Check if admin user already exists
      const adminExists = await User.findOne({
        where: { email: "admin@tasktracker.com" },
      });

      if (!adminExists) {
        const hashedPassword = await bcrypt.hash("admin123", 12);

        const adminUser = await User.create({
          name: "Admin User",
          email: "admin@tasktracker.com",
          password: hashedPassword,
          role: "admin",
        });

        console.log("✅ Admin user created successfully:", adminUser.email);
        return adminUser;
      } else {
        console.log("ℹ️  Admin user already exists:", adminExists.email);
        return adminExists;
      }
    } catch (error) {
      console.error("❌ Error seeding admin user:", error.message);
      throw error;
    }
  }
  static async seedNormalUser() {
    try {
      // Check if normal user already exists
      const normalUserExists = await User.findOne({
        where: { email: "user@tasktracker.com" },
      });

      if (!normalUserExists) {
        const hashedPassword = await bcrypt.hash("user123", 12);

        const normalUser = await User.create({
          name: "Normal User",
          email: "user@tasktracker.com",
          password: hashedPassword,
          role: "user",
        });

        console.log("✅ Normal user created successfully:", normalUser.email);
        return normalUser;
      } else {
        console.log("ℹ️  Normal user already exists:", normalUserExists.email);
        return normalUserExists;
      }
    } catch (error) {
      console.error("❌ Error seeding normal user:", error.message);
      throw error;
    }
  }

  // Seed default categories
  static async seedCategories(adminUserId) {
    try {
      const categoryCount = await Category.count();

      if (categoryCount === 0) {
        const defaultCategories = [
          {
            name: "Work",
            description: "Work-related tasks and projects",
          },
          {
            name: "Personal",
            description: "Personal tasks and activities",
          },
          {
            name: "Health",
            description: "Health and fitness related tasks",
          },
          {
            name: "Learning",
            description: "Educational and learning tasks",
          },
          {
            name: "Shopping",
            description: "Shopping lists and errands",
          },
          {
            name: "Home",
            description: "Home maintenance and household tasks",
          },
        ];

        const createdCategories = [];
        for (const categoryData of defaultCategories) {
          const category = await Category.create({
            name: categoryData.name,
            description: categoryData.description,
            createdBy: adminUserId,
          });
          createdCategories.push(category);
        }

        console.log(
          `✅ ${createdCategories.length} default categories created successfully`
        );
        return createdCategories;
      } else {
        console.log(`ℹ️  ${categoryCount} categories already exist`);
        return await Category.findAll();
      }
    } catch (error) {
      console.error("❌ Error seeding categories:", error.message);
      throw error;
    }
  }

  // Seed sample tasks (optional)
  static async seedSampleTasks(adminUserId, categories) {
    try {
      const taskCount = await Task.count();

      if (taskCount === 0) {
        const sampleTasks = [
          {
            title: "Review project requirements",
            description:
              "Go through the new project specifications and create a detailed plan",
            status: "todo",
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            categoryId: categories.find((c) => c.name === "Work")?.id,
            userId: adminUserId,
          },
          {
            title: "Update resume",
            description: "Add recent projects and skills to resume",
            status: "doing",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            categoryId: categories.find((c) => c.name === "Work")?.id,
            userId: adminUserId,
          },
          {
            title: "Morning workout",
            description: "30-minute cardio and strength training",
            status: "done",
            dueDate: new Date(),
            categoryId: categories.find((c) => c.name === "Health")?.id,
            userId: adminUserId,
          },
          {
            title: "Read JavaScript book",
            description: "Complete chapter 5 of Advanced JavaScript concepts",
            status: "todo",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            categoryId: categories.find((c) => c.name === "Learning")?.id,
            userId: adminUserId,
          },
          {
            title: "Grocery shopping",
            description: "Buy ingredients for weekend meal prep",
            status: "todo",
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
            categoryId: categories.find((c) => c.name === "Shopping")?.id,
            userId: adminUserId,
          },
        ];

        const createdTasks = [];
        for (const taskData of sampleTasks) {
          const task = await Task.create(taskData);
          createdTasks.push(task);
        }

        console.log(
          `✅ ${createdTasks.length} sample tasks created successfully`
        );
        return createdTasks;
      } else {
        console.log(`ℹ️  ${taskCount} tasks already exist`);
        return await Task.findAll();
      }
    } catch (error) {
      console.error("❌ Error seeding sample tasks:", error.message);
      throw error;
    }
  }

  // Main seed function
  static async seed() {
    try {
      console.log("🌱 Starting database seeding...\n");

      // Seed admin user first
      const adminUser = await this.seedAdminUser();

      // Seed normal user
      const normalUser = await this.seedNormalUser();

      // Seed categories
      const categories = await this.seedCategories(adminUser.id);

      // Seed sample tasks (optional - comment out if not needed)
      const tasks = await this.seedSampleTasks(normalUser.id, categories);

      console.log("\n🎉 Database seeding completed successfully!");
      console.log("\n📊 Summary:");
      console.log(`- Admin user: ${adminUser.email}`);
      console.log(`- Categories: ${categories.length}`);
      console.log(`- Sample tasks: ${tasks.length}`);

      return {
        adminUser,
        categories,
        tasks,
      };
    } catch (error) {
      console.error("❌ Database seeding failed:", error.message);
      throw error;
    }
  }

  // Reset database (for development)
  static async reset() {
    try {
      console.log("🔄 Resetting database...");

      // Drop all tables
      await Task.drop({ cascade: true });
      await Category.drop({ cascade: true });
      await User.drop({ cascade: true });

      console.log("✅ Database reset completed");
    } catch (error) {
      console.error("❌ Database reset failed:", error.message);
      throw error;
    }
  }
}

module.exports = DatabaseSeeder;
