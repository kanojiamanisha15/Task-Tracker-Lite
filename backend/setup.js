#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🚀 Task Tracker Lite - Backend Setup");
console.log("=====================================\n");

// Check if .env file exists
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  console.log("📝 Creating .env file from template...");
  const envExample = fs.readFileSync(
    path.join(__dirname, "env.example"),
    "utf8"
  );
  fs.writeFileSync(envPath, envExample);
  console.log("✅ .env file created successfully!");
  console.log(
    "⚠️  Please update the .env file with your database credentials.\n"
  );
} else {
  console.log("✅ .env file already exists.\n");
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, "node_modules");
if (!fs.existsSync(nodeModulesPath)) {
  console.log("📦 Installing dependencies...");
  console.log("Run: npm install\n");
} else {
  console.log("✅ Dependencies are installed.\n");
}

console.log("📋 Next Steps:");
console.log("1. Update .env file with your MySQL database credentials");
console.log('2. Create a MySQL database named "task_tracker_db"');
console.log("3. Run: npm install (if not already done)");
console.log(
  "4. Run: npm run dev (for development) or npm start (for production)"
);
console.log("\n🔑 Default Admin Account:");
console.log("Email: admin@tasktracker.com");
console.log("Password: admin123");
console.log("\n📖 API Documentation: See README.md for detailed API usage");
console.log("\n🎉 Setup complete! Happy coding!");
