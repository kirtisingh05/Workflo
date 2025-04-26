import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchBoards } from "../services/boards";
import {
	getTask,
	createTask,
	updateTask,
} from "../services/tasks";
import { getContributors } from "../services/contributors";
import styles from "./BoardDetail.module.css";

const BoardDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

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

			const [boardResponse, tasksResponse, contributorsResponse] =
				await Promise.all([
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
			const response = await updateTaskStatus(taskId, status);
			setTasks((prev) =>
				prev.map((task) => (task._id === taskId ? response.data : task)),
			);
		} catch (error) {
			setError("Error updating task status");
			console.error("Error updating task status:", error);
		}
	};

	if (loading) {
		return <div className={styles.loadingContainer}>Loading...</div>;
	}

	if (error) {
		return <div className={styles.error}>{error}</div>;
	}

	const statusColumns = ["NOT STARTED", "IN PROGRESS", "COMPLETED"];

	return (
		<div className={styles.boardDetailContainer}>
			<header className={styles.boardHeader}>
				<h1>{board?.title}</h1>
				<div className={styles.boardActions}>
					<button
						className={styles.newTaskBtn}
						onClick={() => setShowNewTaskModal(true)}
					>
						New Task
					</button>
				</div>
			</header>

			<div className={styles.boardContent}>
				<div className={styles.taskColumns}>
					{statusColumns.map((status) => (
						<div
							key={status}
							className={styles.taskColumn}
							onDragOver={handleDragOver}
							onDrop={(e) => handleDrop(e, status)}
						>
							<h2 className={styles.columnTitle}>{status}</h2>
							<div className={styles.taskList}>
								{tasks
									.filter((task) => task.status === status)
									.map((task) => (
										<div
											key={task._id}
											className={styles.taskCard}
											draggable
											onDragStart={(e) => handleDragStart(e, task._id)}
										>
											<h3>{task.title}</h3>
											<p>{task.description}</p>
											<div className={styles.taskMeta}>
												<span
													className={`${styles.badge} ${styles[task.priority]}`}
												>
													{task.priority}
												</span>
												<span className={styles.subtasks}>
													{task.subtasks?.filter((st) => st.completed).length ||
														0}
													/{task.subtasks?.length || 0}
												</span>
											</div>
										</div>
									))}
							</div>
						</div>
					))}
				</div>
			</div>

			{showNewTaskModal && (
				<div className={styles.modalOverlay}>
					<div className={styles.modalContent}>
						<h2>Create New Task</h2>
						<form onSubmit={handleCreateTask}>
							<div className={styles.formGroup}>
								<label htmlFor="title">Title</label>
								<input
									type="text"
									id="title"
									value={newTaskData.title}
									onChange={(e) =>
										setNewTaskData({ ...newTaskData, title: e.target.value })
									}
									required
								/>
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="description">Description</label>
								<textarea
									id="description"
									value={newTaskData.description}
									onChange={(e) =>
										setNewTaskData({
											...newTaskData,
											description: e.target.value,
										})
									}
								/>
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="priority">Priority</label>
								<select
									id="priority"
									value={newTaskData.priority}
									onChange={(e) =>
										setNewTaskData({ ...newTaskData, priority: e.target.value })
									}
								>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</select>
							</div>

							<div className={styles.modalActions}>
								<button type="submit" className={styles.saveBtn}>
									Create Task
								</button>
								<button
									type="button"
									className={styles.cancelBtn}
									onClick={() => setShowNewTaskModal(false)}
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

export default BoardDetail;
