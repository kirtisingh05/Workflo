import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  fetchBoards,
  createBoard,
  moveToTrash,
  restoreFromTrash,
  updateBoard,
} from "../services/boards";
import {
  FiPlus,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiCalendar,
  FiArchive,
  FiEdit2,
} from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [boards, setBoards] = useState([]);
  const [trashedBoards, setTrashedBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTrashed, setShowTrashed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [editBoardData, setEditBoardData] = useState({
    id: "",
    title: "",
    description: "",
    createdAt: ""
  });
  const [newBoardData, setNewBoardData] = useState({
    title: "",
    description: "",
    createdAt: new Date().toISOString().slice(0, 16)


    
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBoards();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, showTrashed]);

  const loadBoards = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchBoards(searchQuery, showTrashed);
      console.log(response.data);
      if (showTrashed) {
        setTrashedBoards(response.data);
      } else {
        setBoards(response.data);
      }
    } catch (error) {
      setError("Error loading boards");
      console.error("Error loading boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await createBoard({
        ...newBoardData,
        owner: user.id,
      });
      loadBoards();
      setShowNewBoardModal(false);
      setNewBoardData({ title: "", description: "" });
    } catch (error) {
      setError("Error creating board");
      console.error("Error creating board:", error);
    }
  };

  const handleEditBoard = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const { id, ...updateData } = editBoardData;
      await updateBoard(id, updateData);
      
      setBoards(prev => prev.map(board => 
        board._id === id 
          ? { ...board, ...updateData }
          : board
      ));
      
      setShowEditBoardModal(false);
    } catch (error) {
      setError("Error updating board");
      console.error("Error updating board:", error);
    }
  };

  const handleMoveToTrash = async (boardId, e) => {
    e.stopPropagation();
    try {
      await moveToTrash(boardId);
      setBoards((prev) => prev.filter((board) => board._id !== boardId));
      loadBoards();
    } catch (error) {
      setError("Error moving board to trash");
      console.error("Error moving board to trash:", error);
    }
  };

  const handleRestoreFromTrash = async (boardId, e) => {
    e.stopPropagation();
    try {
      await restoreFromTrash(boardId);
      setTrashedBoards((prev) => prev.filter((board) => board._id !== boardId));
      loadBoards();
    } catch (error) {
      setError("Error restoring board from trash");
      console.error("Error restoring board from trash:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
              {showTrashed ? "Trash" : "My Boards"}
            </h1>
            <div className="flex flex-col sm:flex-row gap-3">
              {!showTrashed && (
                <button
                  onClick={() => setShowNewBoardModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <FiPlus className="mr-2 -ml-1 h-4 w-4" />
                  New Board
                </button>
              )}
              <button
                onClick={() => setShowTrashed(!showTrashed)}
                className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors ${
                  showTrashed
                    ? "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    : "border-transparent text-white bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                }`}
              >
                {showTrashed ? (
                  <>
                    <FiArchive className="mr-2 -ml-1 h-4 w-4" />
                    View Active Boards
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-2 -ml-1 h-4 w-4" />
                    View Trash
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search section */}
          <div className="mt-6 max-w-3xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          </div>
        )}

        {/* Boards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showTrashed ? trashedBoards : boards).map((board) => (
            <div
              key={board._id}
              onClick={() => !showTrashed && navigate(`/board/${board._id}`)}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {board.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {board.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FiCalendar className="h-4 w-4 mr-1" />
                    {new Date(board.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!showTrashed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditBoardData({
                            id: board._id,
                            title: board.title,
                            description: board.description,
                            createdAt: new Date(board.createdAt).toISOString().slice(0, 16)
                          });
                          setShowEditBoardModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm transition-colors text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <FiEdit2 className="mr-1 h-4 w-4" />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={(e) =>
                        showTrashed
                          ? handleRestoreFromTrash(board._id, e)
                          : handleMoveToTrash(board._id, e)
                      }
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
                        showTrashed
                          ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                          : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      }`}
                    >
                      {showTrashed ? (
                        <>
                          <FiRefreshCw className="mr-1 h-4 w-4" />
                          Restore
                        </>
                      ) : (
                        <>
                          <FiTrash2 className="mr-1 h-4 w-4" />
                          Trash
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Board Modal */}
        {showNewBoardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transform transition-all">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Create New Board
                </h3>
                <form onSubmit={handleCreateBoard}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={newBoardData.title}
                        onChange={(e) =>
                          setNewBoardData({
                            ...newBoardData,
                            title: e.target.value,
                          })
                        }
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={newBoardData.description}
                        onChange={(e) =>
                          setNewBoardData({
                            ...newBoardData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowNewBoardModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Create Board
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Board Modal */}
        {showEditBoardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transform transition-all">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Edit Board
                </h3>
                <form onSubmit={handleEditBoard}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="edit-title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="edit-title"
                        value={editBoardData.title}
                        onChange={(e) =>
                          setEditBoardData({
                            ...editBoardData,
                            title: e.target.value,
                          })
                        }
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="edit-description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Description
                      </label>
                      <textarea
                        id="edit-description"
                        value={editBoardData.description}
                        onChange={(e) =>
                          setEditBoardData({
                            ...editBoardData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="edit-createdAt"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Creation Time
                      </label>
                      <input
                        type="datetime-local"
                        id="edit-createdAt"
                        value={editBoardData.createdAt}
                        onChange={(e) =>
                          setEditBoardData({
                            ...editBoardData,
                            createdAt: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEditBoardModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Save Changes
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

export default Dashboard;
