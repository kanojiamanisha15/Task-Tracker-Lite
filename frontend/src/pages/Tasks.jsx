import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFilters, clearFilters } from "../store/slices/taskSlice";
import { useTasks, useDeleteTask } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import { useUsers } from "../hooks/useUsers";
import { TASK_STATUS, TASK_STATUS_LABELS } from "../utils/constants";
import { formatDate, isOverdue } from "../utils/helpers";
import TaskForm from "../components/TaskForm";

const Tasks = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.tasks);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user } = useSelector((state) => state.auth);

  // React Query hooks
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(filters);
  const { isLoading: categoriesLoading } = useCategories();
  const { data: users = [], isLoading: usersLoading } = useUsers(
    user?.role === "admin"
  );
  console.log("users", users);

  const deleteTaskMutation = useDeleteTask();

  const loading = tasksLoading || categoriesLoading || usersLoading;

  const userTasks = tasks?.tasks;

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  // Helper function to check if task matches due date filter
  const matchesDueDate = (task) => {
    if (!filters.dueDate) return true;

    const taskDate = new Date(task.due_date);
    const filterDate = new Date(filters.dueDate);

    // Compare dates by setting time to midnight to ignore time differences
    taskDate.setHours(0, 0, 0, 0);
    filterDate.setHours(0, 0, 0, 0);

    return taskDate.getTime() === filterDate.getTime();
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskMutation.mutateAsync(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const filteredTasks = userTasks?.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.category && task.categoryId !== filters.category) return false;
    if (!matchesDueDate(task)) return false;
    return true;
  });

  const sortedTasks = (filteredTasks ? [...filteredTasks] : []).sort((a, b) => {
    // Sort by due date by default
    const aValue = new Date(a.due_date || "9999-12-31");
    const bValue = new Date(b.due_date || "9999-12-31");

    return aValue > bValue ? 1 : -1;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        {user.role !== "admin" && (
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* User Filter */}
          {user.role === "admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <select
                value={filters.userId}
                onChange={(e) => handleFilterChange("userId", e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Users</option>
                {users?.map((user) => {
                  if (user?.role !== "admin") {
                    return (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
          )}

          {/* Due Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={filters.dueDate}
              onChange={(e) => handleFilterChange("dueDate", e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          {/* <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
                <option value="createdAt">Created Date</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div> */}
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white shadow rounded-lg">
        {sortedTasks.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {sortedTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {task.title}
                      </h3>
                      {isOverdue(task.dueDate) &&
                        task.status !== TASK_STATUS.DONE && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Category: {task.category_name ?? "N/A"}</span>
                      <span>Due: {formatDate(task.due_date)}</span>
                      <span>Created: {formatDate(task.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {new Date(task.due_date) < new Date() ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Overdue
                      </span>
                    ) : null}
                    {user.role !== "admin" &&
                      new Date(task.due_date) > new Date() && (
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Edit
                        </button>
                      )}

                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              {filteredTasks.length === 0 && userTasks.length > 0
                ? "No tasks match your current filters."
                : "No tasks yet. Create your first task to get started!"}
            </p>
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseTaskForm}
          onSuccess={handleCloseTaskForm}
        />
      )}
    </div>
  );
};

export default Tasks;
