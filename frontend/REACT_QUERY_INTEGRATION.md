# React Query Integration

This document outlines the React Query integration that has been implemented in the Task Tracker Lite frontend application.

## Overview

React Query (TanStack Query) has been integrated to handle all API calls, replacing Redux async thunks for data fetching and mutations. Redux is now used only for local state management (filters, auth state).

## Key Changes

### 1. Setup
- Added `@tanstack/react-query` and `@tanstack/react-query-devtools` packages
- Configured QueryClient with appropriate defaults in `main.jsx`
- Added React Query DevTools for development

### 2. Custom Hooks Created

#### `useTasks.js`
- `useTasks(filters)` - Fetch tasks with optional filters
- `useTask(id)` - Fetch single task
- `useCreateTask()` - Create new task
- `useUpdateTask()` - Update existing task
- `useDeleteTask()` - Delete task
- `useUpdateTaskStatus()` - Update task status

#### `useCategories.js`
- `useCategories(filters)` - Fetch categories
- `useCreateCategory()` - Create new category
- `useUpdateCategory()` - Update existing category
- `useDeleteCategory()` - Delete category

#### `useAuth.js` (Updated)
- `useRegister()` - User registration
- `useLogin()` - User login
- `useLogout()` - User logout
- Updated `useAuth()` to work with React Query

### 3. Component Updates

All components have been updated to use React Query hooks instead of Redux async thunks:

- **Tasks.jsx** - Uses `useTasks`, `useDeleteTask`, `useUpdateTaskStatus`
- **TaskForm.jsx** - Uses `useCreateTask`, `useUpdateTask`, `useCategories`
- **Login.jsx** - Uses `useLogin`
- **Register.jsx** - Uses `useRegister`
- **AdminCategories.jsx** - Uses `useCategories`, `useDeleteCategory`
- **CategoryForm.jsx** - Uses `useCreateCategory`, `useUpdateCategory`
- **Layout.jsx** - Uses `useLogout`

### 4. Redux Cleanup

- Removed all async thunks from Redux slices
- Kept only local state management in Redux:
  - **taskSlice**: Manages filters only
  - **authSlice**: Manages auth state (user, token, isAuthenticated)
  - **categorySlice**: Empty (categories managed by React Query)

## Benefits

### 1. Better Caching
- Automatic background refetching
- Intelligent cache invalidation
- Optimistic updates
- Stale-while-revalidate pattern

### 2. Improved Developer Experience
- Built-in loading states
- Error handling
- Retry logic
- DevTools for debugging

### 3. Performance
- Reduced unnecessary API calls
- Better memory management
- Automatic garbage collection of unused queries

### 4. Code Organization
- Separation of concerns (Redux for local state, React Query for server state)
- Cleaner component code
- Reusable query hooks

## Query Keys Structure

```javascript
// Tasks
['tasks'] // All tasks
['tasks', 'list'] // Task lists
['tasks', 'list', { userId: 1, status: 'todo' }] // Specific list with filters
['tasks', 'detail', 123] // Single task

// Categories
['categories'] // All categories
['categories', 'list'] // Category lists
['categories', 'detail', 123] // Single category

// Auth
['auth'] // All auth
['auth', 'user'] // User data
```

## Configuration

The QueryClient is configured with:
- 5-minute stale time for queries
- Smart retry logic (no retry on 401/403 errors)
- No retry for mutations
- React Query DevTools enabled in development

## Migration Notes

- All API calls now go through React Query hooks
- Redux is used only for local state (filters, auth)
- Components automatically refetch data when mutations succeed
- Error handling is built into the hooks
- Loading states are managed by React Query

## Future Enhancements

- Add optimistic updates for better UX
- Implement infinite queries for pagination
- Add query prefetching for better performance
- Consider adding query persistence for offline support
