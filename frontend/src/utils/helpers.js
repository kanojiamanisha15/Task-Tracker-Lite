import { TASK_STATUS, TASK_STATUS_LABELS } from "./constants";

export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

export const canEditTask = (task) => {
  if (!task || !task.dueDate) return true;
  return !isOverdue(task.dueDate);
};

export const getStatusColor = (status) => {
  const colors = {
    [TASK_STATUS.TODO]: "bg-gray-100 text-gray-800",
    [TASK_STATUS.DOING]: "bg-yellow-100 text-yellow-800",
    [TASK_STATUS.DONE]: "bg-green-100 text-green-800",
  };
  return colors[status] || colors[TASK_STATUS.TODO];
};

export const getStatusLabel = (status) => {
  return TASK_STATUS_LABELS[status] || status;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const sortTasks = (tasks, sortBy = "dueDate", sortOrder = "asc") => {
  return [...tasks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "dueDate") {
      aValue = new Date(aValue || "9999-12-31");
      bValue = new Date(bValue || "9999-12-31");
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const filterTasks = (tasks, filters) => {
  return tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.category && task.categoryId !== filters.category) return false;
    if (filters.userId && task.userId !== filters.userId) return false;
    if (filters.dueDate) {
      const taskDate = new Date(task.dueDate).toDateString();
      const filterDate = new Date(filters.dueDate).toDateString();
      if (taskDate !== filterDate) return false;
    }
    return true;
  });
};
