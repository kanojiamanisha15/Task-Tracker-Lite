export const API_BASE_URL = "http://localhost:3000/api";

export const TASK_STATUS = {
  TODO: "todo",
  DOING: "doing",
  DONE: "done",
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: "To Do",
  [TASK_STATUS.DOING]: "Doing",
  [TASK_STATUS.DONE]: "Done",
};

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.USER]: "User",
};

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  TASKS: "/tasks",
  // ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_CATEGORIES: "/admin/categories",
  PROFILE: "/profile",
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
  TASKS: "/tasks",
  CATEGORIES: "/categories",
};
