# Task Tracker Lite

A comprehensive task management application with user authentication, role-based access control, and category management.

## Features

### 🔐 User Authentication System
- User registration with name, email, and password validation
- Secure login with JWT token authentication
- Password confirmation and validation
- Secure logout functionality
- Protected routes for authenticated users only

### 👑 Role Management
- **Admin Users**: Full access to category management and admin dashboard
- **Normal Users**: Can create and manage their own tasks, assign to existing categories

### 🏷️ Categories Management (Admin-only)
- Create, read, update, and delete categories
- Categories are used to organize tasks
- Only administrators can manage categories

### 📋 Task Management (All Users)
- Create tasks with title, description, status, due date, and category
- Three task statuses: Todo, Doing, Done
- View and filter personal tasks
- Update task details and status
- Delete tasks
- **Important**: Task status cannot be changed after the due date has passed

### 📊 Admin Dashboard
- Complete overview of all tasks across all users
- Task filtering by user, status, category, and due date
- Statistics showing total tasks, users, overdue tasks, and completed tasks
- User activity monitoring

## Technology Stack

- **Frontend**: React 19 with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Fetch API
- **Form Handling**: React Hook Form
- **Data Fetching**: TanStack React Query

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with navigation
│   ├── ProtectedRoute.jsx  # Route protection component
│   ├── TaskForm.jsx    # Task creation/editing form
│   └── CategoryForm.jsx # Category creation/editing form
├── pages/              # Page components
│   ├── Login.jsx       # User login page
│   ├── Register.jsx    # User registration page
│   ├── Dashboard.jsx   # User dashboard
│   ├── Tasks.jsx       # Task management page
│   ├── AdminDashboard.jsx # Admin overview dashboard
│   └── AdminCategories.jsx # Category management page
├── services/           # API service layer
│   ├── authService.js  # Authentication API calls
│   ├── taskService.js  # Task-related API calls
│   └── categoryService.js # Category-related API calls
├── store/              # Redux store configuration
│   ├── index.js        # Store setup
│   └── slices/         # Redux slices
│       ├── authSlice.js    # Authentication state
│       ├── taskSlice.js    # Task state
│       └── categorySlice.js # Category state
├── hooks/              # Custom React hooks
│   └── useAuth.js      # Authentication hook
├── utils/              # Utility functions
│   ├── constants.js    # Application constants
│   └── helpers.js      # Helper functions
└── App.jsx             # Main application component
```

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-tracker-lite/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Backend Setup

This frontend application expects a backend API running on `http://localhost:3000/api` with the following endpoints:

#### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

#### Task Endpoints
- `GET /tasks` - Get tasks (with optional filters)
- `GET /tasks/:id` - Get specific task
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PATCH /tasks/:id/status` - Update task status

#### Category Endpoints
- `GET /categories` - Get all categories
- `POST /categories` - Create new category (Admin only)
- `PUT /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Delete category (Admin only)

## Usage

### For Regular Users
1. **Register** a new account or **login** with existing credentials
2. **View Dashboard** to see task statistics and recent activity
3. **Create Tasks** with title, description, due date, and category
4. **Manage Tasks** by updating status, editing details, or deleting
5. **Filter Tasks** by status, category, or sort by various criteria

### For Admin Users
1. **All regular user features** plus:
2. **Admin Dashboard** to view all tasks across all users
3. **Category Management** to create, edit, and delete categories
4. **User Activity Monitoring** with filtering and statistics

## Key Features Explained

### Task Status Management
- Tasks can be in one of three states: **Todo**, **Doing**, or **Done**
- Once a task's due date has passed, the status cannot be changed
- This ensures accountability and prevents backdating of completed work

### Role-Based Access Control
- **Admin users** have full system access including category management
- **Normal users** can only manage their own tasks and assign them to existing categories
- Protected routes ensure users only access features appropriate to their role

### Category System
- Categories help organize tasks (e.g., "Work", "Personal", "Health")
- Only administrators can create and manage categories
- Users can assign their tasks to any existing category

### Responsive Design
- Mobile-friendly interface using Tailwind CSS
- Responsive navigation and form layouts
- Optimized for both desktop and mobile devices

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure
- **Components**: Reusable UI components with proper prop validation
- **Pages**: Full page components with routing integration
- **Services**: API communication layer with error handling
- **Store**: Redux state management with async thunks
- **Utils**: Helper functions and constants

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.