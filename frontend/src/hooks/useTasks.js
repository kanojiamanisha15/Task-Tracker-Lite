import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import taskService from "../services/taskService";
import { useAuth } from "./useAuth";

// Query keys
export const taskKeys = {
  all: ["tasks"],
  lists: () => [...taskKeys.all, "list"],
  list: (filters) => [...taskKeys.lists(), filters],
  details: () => [...taskKeys.all, "detail"],
  detail: (id) => [...taskKeys.details(), id],
};

// Custom hook for fetching tasks
export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: taskKeys.list({ ...filters }),
    queryFn: () => taskService.getTasks({ ...filters }),
    select: (data) => data?.data || [],
  });
};

// Custom hook for fetching a single task
export const useTask = (id) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
    select: (data) => data.data || data,
  });
};

// Custom hook for creating a task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (taskData) => taskService.createTask(taskData),
    onSuccess: (data) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });

      // Add the new task to the cache
      queryClient.setQueryData(taskKeys.detail(data.data?.id || data.id), data);
    },
    onError: (error) => {
      console.error("Failed to create task:", error);
    },
  });
};

// Custom hook for updating a task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taskData }) => taskService.updateTask(id, taskData),
    onSuccess: (data, variables) => {
      // Update the specific task in cache
      queryClient.setQueryData(taskKeys.detail(variables.id), data);

      // Invalidate tasks list to ensure consistency
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
    },
  });
};

// Custom hook for deleting a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => taskService.deleteTask(id),
    onSuccess: (data, id) => {
      // Remove the task from cache
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });

      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete task:", error);
    },
  });
};

// Custom hook for updating task status
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => taskService.updateTaskStatus(id, status),
    onSuccess: (data, variables) => {
      // Update the specific task in cache
      queryClient.setQueryData(taskKeys.detail(variables.id), data);

      // Invalidate tasks list to ensure consistency
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to update task status:", error);
    },
  });
};
