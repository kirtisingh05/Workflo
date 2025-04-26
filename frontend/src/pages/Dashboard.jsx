import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  fetchBoards,
  createBoard,
  moveToTrash,
  restoreFromTrash,
} from "../services/boards";
import styles from "./Dashboard.module.css";

const Dashboard = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [boards, setBoards] = useState([]);
  const [trashedBoards, setTrashedBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTrashed, setShowTrashed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [newBoardData, setNewBoardData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    loadBoards();
  }, [showTrashed]);

  const loadBoards = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchBoards(searchQuery, showTrashed);
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
      setBoards((prev) => [response.data, ...prev]);
      setShowNewBoardModal(false);
      setNewBoardData({ title: "", description: "" });
    } catch (error) {
      setError("Error creating board");
      console.error("Error creating board:", error);
    }
  };

  const handleMoveToTrash = async (boardId) => {
    try {
      await moveToTrash(boardId);
      setBoards((prev) => prev.filter((board) => board._id !== boardId));
      loadBoards();
    } catch (error) {
      setError("Error moving board to trash");
      console.error("Error moving board to trash:", error);
    }
  };

  const handleRestoreFromTrash = async (boardId) => {
    try {
      await restoreFromTrash(boardId);
      setTrashedBoards((prev) => prev.filter((board) => board._id !== boardId));
      loadBoards();
    } catch (error) {
      setError("Error restoring board from trash");
      console.error("Error restoring board from trash:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      loadBoards();
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <div
      className={`${styles.dashboardContainer} ${isDarkMode ? styles.darkMode : ""}`}
    >
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <h1>My Boards</h1>
          <div className={styles.headerActions}>
            <button
              className={styles.newBoardBtn}
              onClick={() => setShowNewBoardModal(true)}
            >
              New Board
            </button>
            <button
              className={`${styles.trashedBtn} ${showTrashed ? styles.active : ""}`}
              onClick={() => setShowTrashed(!showTrashed)}
            >
              {showTrashed ? "View Active Boards" : "View Trash"}
            </button>
          </div>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search boards..."
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.boardsGrid}>
        {boards &&
          (showTrashed ? trashedBoards : boards).map((board) => (
            <div
              key={board._id}
              className={styles.boardCard}
              onClick={() => !showTrashed && navigate(`/board/${board._id}`)}
            >
              <div className={styles.boardContent}>
                <h2>{board.title}</h2>
                <p>{board.description}</p>
                <div className={styles.boardMeta}>
                  <span className={styles.date}>
                    Created {new Date(board.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    className={styles.actionBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (showTrashed) {
                        handleRestoreFromTrash(board._id);
                      } else {
                        handleMoveToTrash(board._id);
                      }
                    }}
                  >
                    {showTrashed ? "Restore" : "Move to Trash"}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {showNewBoardModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Create New Board</h2>
            <form onSubmit={handleCreateBoard}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newBoardData.title}
                  onChange={(e) =>
                    setNewBoardData({ ...newBoardData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
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
                />
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveBtn}>
                  Create Board
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowNewBoardModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
