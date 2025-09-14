import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import { TASK_STATUS, TASK_STATUS_LABELS } from "../utils/constants";
import { formatDate, getStatusColor, isOverdue } from "../utils/helpers";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: tasks = {}, isLoading: tasksLoading } = useTasks({
    userId: user?.id,
  });

  useEffect(() => {
    console.log("tasks", tasks);
  }, [tasks]);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    doing: 0,
    done: 0,
    overdue: 0,
  });

  const loading = tasksLoading || categoriesLoading;

  useEffect(() => {
    if (tasks?.tasks?.length > 0) {
      const userTasks = tasks?.tasks?.filter(
        (task) => task.userId === user?.id
      );
      const newStats = {
        total: userTasks.length,
        todo: userTasks.filter((task) => task.status === TASK_STATUS.TODO)
          .length,
        doing: userTasks.filter((task) => task.status === TASK_STATUS.DOING)
          .length,
        done: userTasks.filter((task) => task.status === TASK_STATUS.DONE)
          .length,
        overdue: userTasks.filter(
          (task) => isOverdue(task.dueDate) && task.status !== TASK_STATUS.DONE
        ).length,
      };
      setStats(newStats);
    }
  }, [tasks, user?.id]);

  const getCategoryName = (categoryId) => {
    console.log("categories", categories);

    const category = categories?.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };
  console.log("tasks?.tasks", tasks?.tasks);
  console.log("user?.id", user?.id);

  const recentTasks = tasks?.tasks
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const overdueTasks = tasks?.tasks?.filter(
    (task) =>
      task.userId === user?.id &&
      isOverdue(task.dueDate) &&
      task.status !== TASK_STATUS.DONE
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
      {/* Welcome Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of your tasks and progress.
          </p>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Tasks
          </h3>
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {getCategoryName(task.categoryId)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {TASK_STATUS_LABELS[task.status]}
                    </span>
                    <span className="text-sm text-gray-500">
                      Due {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No tasks yet. Create your first task to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
