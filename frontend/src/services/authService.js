import { API_BASE_URL } from "../utils/constants";

// State management for auth data
let token = localStorage.getItem("token");
let user = JSON.parse(localStorage.getItem("user") || "null");

// Helper functions
const setAuthData = (newToken, newUser) => {
  token = newToken;
  user = newUser;
  localStorage.setItem("token", newToken);
  localStorage.setItem("user", JSON.stringify(newUser));
};

const clearAuthData = () => {
  token = null;
  user = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const getToken = () => token;

const getUser = () => user;

const isAuthenticated = () => !!token;

const isAdmin = () => user?.role === "admin";

const getAuthHeaders = () => {
  // Always get the latest token from localStorage to ensure it's current
  const currentToken = localStorage.getItem("token");
  console.log(
    "AuthService - Getting headers with token:",
    currentToken ? "Token exists" : "No token"
  );
  return {
    Authorization: `Bearer ${currentToken}`,
    "Content-Type": "application/json",
  };
};

// API functions
const register = async (userData) => {
  const { name, email, password, confirmPassword } = userData;

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  setAuthData(data.data.token, data.data.user);
  return data.data;
};

const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  setAuthData(data.data.token, data.data.user);
  console.log(data);
  return data.data;
};

const logout = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearAuthData();
  }
};

// Export the service object
const authService = {
  register,
  login,
  logout,
  setAuthData,
  clearAuthData,
  getToken,
  getUser,
  isAuthenticated,
  isAdmin,
  getAuthHeaders,
};

export default authService;
