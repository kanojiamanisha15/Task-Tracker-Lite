# Task Tracker Lite - Backend API

A comprehensive Node.js Express backend API for a task management system with user authentication, role-based access control, and admin dashboard functionality.

## Features

### 🔐 User Authentication System
- User registration with email validation
- Secure login with JWT tokens
- Password hashing using bcryptjs
- Profile management and password change
- Session management with logout functionality

### 👥 Role Management
- **Admin Users**: Full access to all features including category management and admin dashboard
- **Normal Users**: Can manage their own tasks and view available categories

### 📂 Categories Management (Admin-only)
- Create, read, update, and delete categories
- Category statistics and usage tracking
- Prevent deletion of categories in use

### ✅ Task Management (All Users)
- Create, read, update, and delete tasks
- Task status management (Todo, Doing, Done)
- Due date validation (cannot change status after due date)
- Category assignment
- Task filtering and pagination
- Personal task statistics

### 📊 Admin Dashboard
- Complete overview of all tasks across all users
- Advanced filtering by user, status, category, and date range
- User management and role updates
- Comprehensive statistics and analytics
- Recent activity monitoring

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Validation**: express-validator
- **Environment**: dotenv

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-tracker-lite/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=task_tracker_db

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   - Create a MySQL database named `task_tracker_db`
   - Run the database setup commands:
   ```bash
   # Complete database setup (recommended)
   npm run db:setup

   # Or step by step:
   npm run db:sync    # Create/update tables
   npm run db:seed    # Add default data
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update user profile (Protected)
- `PUT /change-password` - Change password (Protected)

### Category Routes (`/api/categories`)
- `GET /` - Get all categories (Public)
- `GET /:id` - Get category by ID (Public)
- `POST /` - Create category (Admin only)
- `PUT /:id` - Update category (Admin only)
- `DELETE /:id` - Delete category (Admin only)
- `GET /stats/overview` - Get category statistics (Admin only)

### Task Routes (`/api/tasks`)
- `GET /` - Get user's tasks with filtering and pagination (Protected)
- `GET /stats` - Get user's task statistics (Protected)
- `GET /:id` - Get task by ID (Protected)
- `POST /` - Create new task (Protected)
- `PUT /:id` - Update task (Protected)
- `DELETE /:id` - Delete task (Protected)

### Admin Routes (`/api/admin`)
- `GET /dashboard/stats` - Get dashboard statistics (Admin only)
- `GET /tasks` - Get all tasks with advanced filtering (Admin only)
- `GET /users` - Get all users with pagination (Admin only)
- `GET /users/:userId` - Get user details with tasks (Admin only)
- `PUT /users/:userId/role` - Update user role (Admin only)
- `DELETE /users/:userId` - Delete user (Admin only)

## Default Admin Account

The system creates a default admin account on first run:
- **Email**: admin@tasktracker.com
- **Password**: admin123

**⚠️ Important**: Change the default admin password after first login!

## API Usage Examples

### User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Task (with authentication token)
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "todo",
    "due_date": "2024-01-15",
    "category_id": 1
  }'
```

### Get User Tasks with Filtering
```bash
curl -X GET "http://localhost:3000/api/tasks?status=todo&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Admin Dashboard Statistics
```bash
curl -X GET http://localhost:3000/api/admin/dashboard/stats \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `role` (ENUM: 'admin', 'user')
- `created_at`, `updated_at` (TIMESTAMP)

### Categories Table
- `id` (Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `created_by` (Foreign Key to Users)
- `created_at`, `updated_at` (TIMESTAMP)

### Tasks Table
- `id` (Primary Key)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (ENUM: 'todo', 'doing', 'done')
- `due_date` (DATE)
- `category_id` (Foreign Key to Categories)
- `user_id` (Foreign Key to Users)
- `created_at`, `updated_at` (TIMESTAMP)

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation and sanitization
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers for Express

## Error Handling

The API includes comprehensive error handling:
- Validation errors with detailed messages
- Database constraint violations
- Authentication and authorization errors
- Custom error responses with appropriate HTTP status codes
- Development vs production error details

## Development

### Project Structure
```
backend/
├── config/
│   ├── database.js          # Database configuration (legacy)
│   └── sequelize.js         # Sequelize configuration
├── models/                  # Sequelize models
│   ├── index.js            # Model definitions and associations
│   ├── User.js             # User model
│   ├── Category.js         # Category model
│   └── Task.js             # Task model
├── services/               # Business logic services
│   ├── authService.js
│   ├── categoryService.js
│   ├── taskService.js
│   └── adminService.js
├── controllers/            # Request handlers
│   ├── authController.js
│   ├── categoryController.js
│   ├── taskController.js
│   └── adminController.js
├── middleware/             # Authentication & validation
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── routes/                 # API endpoints
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── taskRoutes.js
│   └── adminRoutes.js
├── scripts/                # Database management scripts
│   ├── db-manager.js       # Database sync/seed/reset
│   └── test-db.js          # Database testing
├── server.js               # Main application
├── package.json            # Dependencies
├── setup.js                # Setup helper
└── README.md              # This file
```

### Scripts
- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon

### Database Management
- `npm run db:sync` - Sync database schema (create/update tables)
- `npm run db:seed` - Seed database with default data
- `npm run db:reset` - Reset database (drop all tables)
- `npm run db:reset-seed` - Reset and seed database
- `npm run db:status` - Show database status and statistics
- `npm run db:setup` - Complete database setup (sync + seed)
- `npm run db:test` - Test database setup and connections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
