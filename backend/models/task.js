import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			required: true,
		},
		description: {
			type: String,
		},
		status: {
			type: String,
			enum: ["NOT STARTED", "IN PROGRESS", "COMPLETED"],
			default: "NOT STARTED",
			required: true,
		},
		deadline: {
			required: true,
			type: Date,
		},
		board: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Board",
			required: true,
		},
		created_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		assigned_to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

async function getAllTasks(board_id) {
	try {
		const tasks = Task.find({ board: board_id });
		return tasks;
	} catch (error) {
		throw new Error(
			`Error fetching tasks for board with id ${board_id}: ${error.message}`,
		);
	}
}

async function createTask(taskData) {
	try {
		const { title, description, status, deadline, created_by, assigned_to } =
			taskData;

		const task = new Task({
			title,
			description,
			status,
			deadline,
			created_by,
			assigned_to,
		});
		await task.save();

		return task;
	} catch (error) {
		throw new Error(`Error creating task: ${error.message}`);
	}
}

async function updateTask(id, taskData) {
	try {
		const updatedTask = await Task.findByIdAndUpdate(id, taskData, {
			new: true,
			runValidators: true,
		});
		await updatedTask.save();
		return updatedTask;
	} catch (error) {
		throw new Error(`Error upding the board with id ${id}: ${error.message}`);
	}
}

async function deleteTask(id) {
	try {
		const deletedTask = await Task.findByIdAndDelete(id);
		return deletedTask;
	} catch (error) {
		throw new Error(`Error deleting task with id ${id}: ${error.message}`);
	}
}

async function deleteTasks(task_ids) {
	try {
		if (!Array.isArray(task_ids) || task_ids.length === 0) {
			throw new Error("task_ids must be a non-empty array");
		}

		const deletedTasks = await Task.deleteMany({
			_id: { $in: task_ids },
		});

		return deletedTasks;
	} catch (error) {
		throw new Error("Error deleting tasks");
	}
}

export default {
	getAllTasks,
	createTask,
	updateTask,
	deleteTask,
	deleteTasks,
};
