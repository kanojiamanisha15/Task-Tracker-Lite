# 🚀 Task Tracker Backend - Setup Guide

This guide will help you set up the Task Tracker backend with Sequelize ORM and MySQL database.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the environment template and configure your database:
```bash
cp env.example .env
```

Edit `.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_tracker_db

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup
Create the MySQL database:
```sql
CREATE DATABASE task_tracker_db;
```

### 4. Initialize Database
Run the complete database setup:
```bash
npm run db:setup
```

This will:
- Create/update database tables
- Seed with default admin user
- Create default categories
- Add sample tasks

### 5. Test Database Setup
Verify everything is working:
```bash
npm run db:test
```

### 6. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Database Management Commands

### Sync Database Schema
```bash
npm run db:sync
```
Creates or updates database tables based on your Sequelize models.

### Seed Database
```bash
npm run db:seed
```
Adds default data (admin user, categories, sample tasks).

### Reset Database
```bash
npm run db:reset
```
⚠️ **Warning**: This will drop all tables and data!

### Reset and Seed
```bash
npm run db:reset-seed
```
Resets database and seeds with fresh data.

### Check Database Status
```bash
npm run db:status
```
Shows database connection status and data counts.

## Default Admin Account

After seeding, you can login with:
- **Email**: admin@tasktracker.com
- **Password**: admin123

## Default Categories

The system comes with these pre-configured categories:
- Work
- Personal
- Health
- Learning
- Shopping
- Home

## API Testing

Once the server is running, you can test the API:

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tasktracker.com",
    "password": "admin123"
  }'
```

### Get Categories
```bash
curl http://localhost:3000/api/categories
```

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running
2. Check database credentials in `.env`
3. Verify database exists: `SHOW DATABASES;`
4. Test connection: `npm run db:status`

### Permission Issues
1. Ensure MySQL user has proper permissions
2. Grant privileges: `GRANT ALL PRIVILEGES ON task_tracker_db.* TO 'your_user'@'localhost';`

### Port Already in Use
1. Change PORT in `.env` file
2. Or kill the process using the port: `lsof -ti:3000 | xargs kill -9`

### Sequelize Sync Issues
1. Check model definitions
2. Verify foreign key relationships
3. Run `npm run db:reset-seed` to start fresh

## Development Workflow

### Making Model Changes
1. Update model files in `models/`
2. Run `npm run db:sync` to update schema
3. Test with `npm run db:test`

### Adding New Seed Data
1. Edit `config/seed.js`
2. Run `npm run db:reset-seed` to apply changes

### Database Migrations
For production, consider using Sequelize migrations instead of sync:
```bash
npx sequelize-cli migration:generate --name your-migration-name
```

## Production Deployment

### Environment Variables
Set these in your production environment:
- `NODE_ENV=production`
- `DB_HOST=your_production_db_host`
- `DB_USER=your_production_db_user`
- `DB_PASSWORD=your_production_db_password`
- `JWT_SECRET=your_production_jwt_secret`

### Database Setup
1. Create production database
2. Run `npm run db:sync` to create tables
3. Run `npm run db:seed` to add initial data
4. Start server with `npm start`

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify all prerequisites are installed
3. Ensure database credentials are correct
4. Check the troubleshooting section above

## Next Steps

- Explore the API endpoints in the main README
- Set up your frontend application
- Customize the seed data for your needs
- Configure additional environment variables as needed
