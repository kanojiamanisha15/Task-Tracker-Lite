import authService from "./authService";
import { API_BASE_URL } from "../utils/constants";

// API functions
const getUsers = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  });

  const url = `${API_BASE_URL}/admin/users${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    headers: authService.getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
};

const getUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    headers: authService.getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user");
  }

  return data;
};

// Export the service object
const userService = {
  getUsers,
  getUser,
};

export default userService;
