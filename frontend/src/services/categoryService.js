import authService from "./authService";
import { API_BASE_URL } from "../utils/constants";

// API functions
const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: authService.getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch categories");
  }

  return data;
};

const createCategory = async (categoryData) => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: authService.getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create category");
  }

  return data;
};

const updateCategory = async (id, categoryData) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: authService.getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update category");
  }

  return data;
};

const deleteCategory = async (id) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: authService.getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete category");
  }

  return data;
};

// Export the service object
const categoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
