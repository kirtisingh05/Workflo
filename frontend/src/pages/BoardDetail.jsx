import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getBoard } from "../services/boards";
import { getTasks, createTask, updateTask } from "../services/tasks";
import { getContributors } from "../services/contributors";
import { FiPlus, FiClock, FiCheckCircle, FiCircle, FiX, FiUsers } from "react-icons/fi";
import { invite } from "../services/invite";

const BoardDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("VIEWER");
  const [inviteSuccessful, setInviteSuccessful] = useState(null);
  const [inviteError, setInviteError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    status: "NOT STARTED",
    priority: "medium",
    subtasks: [],
    deadline: "",
  });

  const filteredContributors = contributors.filter((c) =>
    c.user.username.toLowerCase().includes(searchQuery),
  );

  useEffect(() => {
    loadBoardData();
  }, [id]);

  const loadBoardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [boardResponse, tasksResponse, contributorsResponse] =
        await Promise.all([getBoard(id), getTasks(id), getContributors(id)]);
      setBoard(boardResponse.data);
      setTasks(tasksResponse.data);
      setContributors(contributorsResponse.data);
    } catch (err) {
      console.error("Error loading board data:", err);
      setError("Error loading board data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTaskData,
        board_id: id,
        created_by: user._id,
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
        deadline: "",
      });
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Error creating task");
    }
  };
  const handleRemoveContributor = async (contributorId) => {
      try {
        setError("");
        await removeContributor(selectedBoard._id, contributorId);
        await loadBoardContributors(selectedBoard._id);
      } catch (error) {
        setError("Error removing contributor");
        console.error("Error removing contributor:", error);
      }
  };
  const handleInviteEmailChange = (e) => {
    setInviteEmail(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await invite(board._id, inviteEmail, board.title, user.username, role);
      setInviteSuccessful(true);
    } catch (err) {
      console.error("Error inviting new contributor:", err);
      setError("Error inviting new contributor");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    try {
      const taskToUpdate = tasks.find((t) => t._id === taskId);
      if (taskToUpdate.status !== newStatus) {
        const updated = await updateTask(taskId, { status: newStatus });
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? updated.data : t)),
        );
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      setError(err.message || "Error updating task status");
    }
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setInviteEmail("");
    setRole("VIEWER");
    setInviteError("");
    setInviteSuccessful(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const statusColumns = [
    { id: "NOT STARTED", icon: FiCircle, title: "Not Started", color: "gray" },
    { id: "IN PROGRESS", icon: FiClock, title: "In Progress", color: "yellow" },
    {
      id: "COMPLETED",
      icon: FiCheckCircle,
      title: "Completed",
      color: "green",
    },
  ];

  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusColors = {
    "NOT STARTED": "bg-slate-50 dark:bg-slate-800",
    "IN PROGRESS": "bg-blue-50 dark:bg-blue-900/30",
    "COMPLETED": "bg-green-50 dark:bg-green-900/30"
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {board?.title}
          </h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm text-sm transition-colors duration-200"
            >
              <FiPlus className="mr-2" /> New Task
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded shadow-sm text-sm transition-colors duration-200"
            >
              <FiUsers className="mr-2" /> Invite
            </button>
          </div>
        </div>

        {/* Task columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusColumns.map((column) => (
            <section
              key={column.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`${statusColors[column.id]} rounded shadow-sm`}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  <column.icon className={`h-5 w-5 text-${column.color}-500`} />
                  <h3 className="ml-2 font-medium text-gray-900 dark:text-white">{column.title}</h3>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                  {tasks.filter((t) => t.status === column.id).length}
                </span>
              </div>
              <div className="p-4 space-y-3">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className="p-4 border rounded shadow-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md"
                    >
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                        {task.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.subtasks?.filter((st) => st.completed).length || 0}/{task.subtasks?.length || 0} subtasks
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contributors Sidebar */}
        {showSidebar && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={handleCloseSidebar}
            />
            <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-xl z-40 transform transition-transform duration-300">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contributors</h3>
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    onClick={handleCloseSidebar}
                  >
                    <FiX className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">Invite Contributors</h4>
                    <button
                      onClick={() => {
                        setInviteEmail("");
                        setRole("VIEWER");
                        setInviteError("");
                        setInviteSuccessful(null);
                      }}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <FiX className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleInvite} className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter contributor's email"
                      value={inviteEmail}
                      onChange={handleInviteEmailChange}
                      onClick={() => {
                        setInviteSuccessful(null);
                        setError("");
                      }}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="VIEWER">Viewer</option>
                        <option value="EDITOR">Editor</option>
                      </select>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Sending..." : "Invite"}
                      </button>
                    </div>
                  </form>

                  {inviteSuccessful !== null && (
                    <div className={`mt-3 p-3 rounded ${
                      inviteSuccessful 
                        ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                        : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    }`}>
                      <p className="text-sm">
                        {inviteSuccessful
                          ? "Invitation sent successfully!"
                          : error}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Search Contributors
                  </h2>
                  <input
                    type="text"
                    placeholder="Search contributors..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mb-4 px-3 py-2 rounded border border-gray-300 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                    <ul className="space-y-2">
                      {filteredContributors.map((c) => {
                        {
                          /*TODO: Navigate to user's profile instead of own*/
                        }
                        return (
                          <li
                            key={c._id}
                            className="p-1 flex justify-between text-sm text-gray-700 dark:text-gray-300 truncate border border-zinc-300 rounded"
                            onClick={() => navigate("/profile")}
                          >
                            <span>
                              {c.user.username}{" "}
                              {c.user._id === user._id && "| You"}
                            </span>
                            <span>{c.role}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Task
              </h3>
              <button
                onClick={() => {
                  setShowNewTaskModal(false);
                  setNewTaskData({
                    title: "",
                    description: "",
                    status: "NOT STARTED",
                    priority: "medium",
                    subtasks: [],
                    deadline: "",
                  });
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <FiX className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newTaskData.title}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, title: e.target.value })
                }
                required
                className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <textarea
                placeholder="Description"
                rows={3}
                value={newTaskData.description}
                onChange={(e) =>
                  setNewTaskData({
                    ...newTaskData,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <select
                value={newTaskData.priority}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, priority: e.target.value })
                }
                className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="date"
                value={newTaskData.deadline}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, deadline: e.target.value })
                }
                className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardDetail;
