# Frontend-Backend Connection Setup

This guide explains how to connect and run the frontend and backend together.

## Port Configuration

### Backend
- **Port**: 3000 (default)
- **API Base URL**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/api/health`

### Frontend
- **Port**: 5173 (Vite default)
- **Development URL**: `http://localhost:5173`

## CORS Configuration

The backend is configured to accept requests from the frontend running on `http://localhost:5173`.

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm run db:setup  # Set up database and seed data
npm run dev       # Start backend server on port 3000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev       # Start frontend on port 5173
```

### 3. Verify Connection

1. **Backend Health Check**: Visit `http://localhost:3000/api/health`
2. **Frontend**: Visit `http://localhost:5173`
3. **API Connection**: Open browser console and run:
   ```javascript
   import { testApiConnection } from './src/utils/apiTest.js';
   testApiConnection();
   ```

## API Endpoints

The frontend is configured to communicate with these backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

### Categories
- `GET /api/categories` - Get categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## Configuration Files Modified

### Backend
- `server.js` - Updated CORS origin to allow frontend on port 5173

### Frontend
- `vite.config.js` - Configured to run on port 5173
- `src/services/authService.js` - Updated API URL to port 3000
- `src/services/taskService.js` - Updated API URL to port 3000  
- `src/services/categoryService.js` - Updated API URL to port 3000
- `src/utils/constants.js` - Added centralized API_BASE_URL
- `src/utils/apiTest.js` - Added connection testing utilities

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend is running on port 3000 and frontend on port 5173
2. **Connection Refused**: Verify both servers are running
3. **Database Issues**: Run `npm run db:setup` in backend directory
4. **Port Conflicts**: Check if ports 3000 or 5173 are already in use

### Environment Variables

Backend requires a `.env` file with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_tracker_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Testing the Connection

1. Start both servers
2. Open browser to `http://localhost:5173`
3. Try registering a new user
4. Check browser network tab for successful API calls
5. Verify data appears in the application
