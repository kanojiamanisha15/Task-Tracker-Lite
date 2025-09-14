import authService from "./authService";
import { API_BASE_URL } from "../utils/constants";

// API functions
const getTasks = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  });

  const url = `${API_BASE_URL}/tasks${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const headers = authService.getAuthHeaders();
  console.log("TaskService - Making request to:", url);
  console.log("TaskService - Headers:", headers);

  const response = await fetch(url, {
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch tasks");
  }

  return data;
};

const getTask = async (id) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    headers: authService.getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch task");
  }

  return data;
};

const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: authService.getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create task");
  }

  return data;
};

const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: authService.getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update task");
  }

  return data;
};

const deleteTask = async (id) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: authService.getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete task");
  }

  return data;
};

const updateTaskStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/status`, {
    method: "PATCH",
    headers: authService.getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update task status");
  }

  return data;
};

// Export the service object
const taskService = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};

export default taskService;
