import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import categoryService from "../services/categoryService";

// Query keys
export const categoryKeys = {
  all: ["categories"],
  lists: () => [...categoryKeys.all, "list"],
  list: (filters) => [...categoryKeys.lists(), filters],
  details: () => [...categoryKeys.all, "detail"],
  detail: (id) => [...categoryKeys.details(), id],
};

// Custom hook for fetching categories
export const useCategories = (filters = {}) => {
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: () => categoryService.getCategories(),
    select: (data) => data.data?.categories || [],
  });
};

// Custom hook for creating a category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData) => categoryService.createCategory(categoryData),
    onSuccess: (data) => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });

      // Add the new category to the cache
      queryClient.setQueryData(
        categoryKeys.detail(data.data?.id || data.id),
        data
      );
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
    },
  });
};

// Custom hook for updating a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, categoryData }) =>
      categoryService.updateCategory(id, categoryData),
    onSuccess: (data, variables) => {
      // Update the specific category in cache
      queryClient.setQueryData(categoryKeys.detail(variables.id), data);

      // Invalidate categories list to ensure consistency
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to update category:", error);
    },
  });
};

// Custom hook for deleting a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => categoryService.deleteCategory(id),
    onSuccess: (data, id) => {
      // Remove the category from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });

      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete category:", error);
    },
  });
};
