import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCategories, useDeleteCategory } from "../hooks/useCategories";
import CategoryForm from "../components/CategoryForm";

const AdminCategories = () => {
  const { user } = useAuth();
  const { data: categories = [], isLoading: loading } = useCategories();
  const deleteCategoryMutation = useDeleteCategory();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteCategory = async (categoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Failed to delete category. It may be in use by existing tasks.");
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleCloseCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleCategoryFormSuccess = () => {
    // React Query will automatically refetch categories due to cache invalidation
    // No need to manually refetch
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Categories Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage task categories. Only administrators can create, edit, and
            delete categories.
          </p>
        </div>
        <button
          onClick={() => setShowCategoryForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create New Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search categories..."
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white shadow rounded-lg">
        {filteredCategories.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <div key={category.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        Created:{" "}
                        {new Date(category.createdAt).toLocaleDateString()}
                      </span>
                      {category.updatedAt &&
                        category.updatedAt !== category.createdAt && (
                          <span>
                            Updated:{" "}
                            {new Date(category.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "No categories match your search."
                : "No categories yet. Create your first category to get started!"}
            </p>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onClose={handleCloseCategoryForm}
          onSuccess={handleCategoryFormSuccess}
        />
      )}
    </div>
  );
};

export default AdminCategories;
