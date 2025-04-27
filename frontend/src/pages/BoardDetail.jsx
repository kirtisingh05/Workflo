import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchBoards } from "../services/boards";
import { getTask, createTask, updateTask } from "../services/tasks";
import { getContributors } from "../services/contributors";
import { FiPlus, FiClock, FiCheckCircle, FiCircle, FiAlertCircle } from "react-icons/fi";

const BoardDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    status: "NOT STARTED",
    priority: "medium",
    subtasks: [],
  });

  useEffect(() => {
    loadBoardData();
  }, [id]);

  const loadBoardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [boardResponse, tasksResponse, contributorsResponse] = await Promise.all([
        fetchBoards(id),
        getTask(id),
        getContributors(id),
      ]);

      setBoard(boardResponse.data);
      setTasks(tasksResponse.data);
      setContributors(contributorsResponse.data);
    } catch (error) {
      setError("Error loading board data");
      console.error("Error loading board data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const taskData = {
        ...newTaskData,
        board: id,
        created_by: user.id,
      };

      const response = await createTask(taskData);
      setTasks((prev) => [...prev, response.data]);
      setShowNewTaskModal(false);
      setNewTaskData({
        title: "",
        description: "",
        status: "NOT STARTED",
        priority: "medium",
        subtasks: [],
      });
    } catch (error) {
      setError("Error creating task");
      console.error("Error creating task:", error);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    try {
      const taskToUpdate = tasks.find((t) => t._id === taskId);
      if (taskToUpdate.status !== status) {
        const response = await updateTask(taskId, { status });
        setTasks((prev) =>
          prev.map((task) => (task._id === taskId ? { ...task, status } : task))
        );
      }
    } catch (error) {
      setError("Error updating task status");
      console.error("Error updating task status:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const statusColumns = [
    { id: "NOT STARTED", icon: FiCircle, title: "Not Started", color: "gray" },
    { id: "IN PROGRESS", icon: FiClock, title: "In Progress", color: "yellow" },
    { id: "COMPLETED", icon: FiCheckCircle, title: "Completed", color: "green" },
  ];

  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {board?.title}
          </h1>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <FiPlus className="mr-2 -ml-1 h-4 w-4" />
            New Task
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusColumns.map((column) => (
            <div
              key={column.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <column.icon className={`h-5 w-5 text-${column.color}-500`} />
                  <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                    {column.title}
                  </h2>
                  <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                    {tasks.filter((task) => task.status === column.id).length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-4 min-h-[200px]">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-4 cursor-move hover:shadow-md transition-shadow duration-200"
                    >
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.subtasks?.filter((st) => st.completed).length || 0}/
                          {task.subtasks?.length || 0} subtasks
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* New Task Modal */}
        {showNewTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transform transition-all">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Create New Task
                </h3>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={newTaskData.title}
                      onChange={(e) =>
                        setNewTaskData({ ...newTaskData, title: e.target.value })
                      }
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={newTaskData.description}
                      onChange={(e) =>
                        setNewTaskData({
                          ...newTaskData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={newTaskData.priority}
                      onChange={(e) =>
                        setNewTaskData({ ...newTaskData, priority: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowNewTaskModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardDetail;
