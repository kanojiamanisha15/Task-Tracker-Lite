import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { clearAuth, setAuth } from "../store/slices/authSlice";
import { ROUTES } from "../utils/constants";

// Query keys for auth
export const authKeys = {
  all: ["auth"],
  user: () => [...authKeys.all, "user"],
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const logout = () => {
    dispatch(clearAuth());
    // Clear all React Query cache on logout
    queryClient.clear();
    navigate(ROUTES.LOGIN);
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (!requireAuth()) return false;
    if (user?.role !== "admin") {
      navigate(ROUTES.DASHBOARD);
      return false;
    }
    return true;
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    logout,
    requireAuth,
    requireAdmin,
  };
};

// Custom hook for user registration
export const useRegister = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => authService.register(userData),
    onSuccess: (data) => {
      // Update Redux store
      dispatch(setAuth(data));

      // Set user data in React Query cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

// Custom hook for user login
export const useLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (data) => {
      // Update Redux store
      dispatch(setAuth(data));

      // Set user data in React Query cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

// Custom hook for user logout
export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Update Redux store
      dispatch(clearAuth());

      // Clear all React Query cache
      queryClient.clear();

      // Navigate to login
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Even if logout fails on server, clear local state
      dispatch(clearAuth());
      queryClient.clear();
      navigate(ROUTES.LOGIN);
    },
  });
};
