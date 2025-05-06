import Task from "../models/task.js";
import Contributor from "../models/contributor.js";

function filterBuilder(query, boardId) {
  const filter = { board: boardId };

  if (query.title) {
    filter.title = { $regex: query.title, $options: "i" };
  }

  if (query.description) {
    filter.description = { $regex: query.description, $options: "i" };
  }

  return filter;
}

async function fetchTask(req, res) {
  const { id } = req.params;

  try {
    const task = await Task.get(id);
    if (!task) {
      return res.status(404).json({ message: `Task with id ${id} not found` });
    }
    res.status(200).json({ data: task, message: "Task fetched successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching task", error: error.message });
  }
}

async function fetchTasksByBoard(req, res) {
  const { board_id } = req.params;
  const query = req.query;

  try {
    const filter = filterBuilder(query, board_id);
    const tasks = await Task.getAll(board_id, filter);
    res
      .status(200)
      .json({ data: tasks, message: "Tasks fetched successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching tasks", error: error.message });
  }
}

async function createTask(req, res) {
  const userId = req.user_id;
  const boardId = req.body.board_id;

  const contributor = await Contributor.getOne(boardId, userId);
  if (contributor?.role !== "ADMIN" && contributor?.role !== "EDITOR") {
    return res.status(403).json({ message: "Unauthorized to create task" });
  }

  try {
    const taskData = req.body;
    const task = await Task.create({ created_by: userId, ...taskData });
    res.status(201).json({ data: task, message: "Task created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while creating task", error: error.message });
  }
}

async function updateTask(req, res) {
  const { id } = req.params;
  const userId = req.user_id;

  try {
    const task = await Task.get(id);
    if (!task) {
      return res.status(404).json({ message: `Task with id ${id} not found` });
    }
    const boardId = task.board;
    const contributor = await Contributor.getOne(boardId, userId);
    if (contributor?.role !== "ADMIN" && contributor?.role !== "EDITOR") {
      return res.status(403).json({ message: "Unauthorized to create task" });
    }

    const updateData = req.body;
    const updatedTask = await Task.update(id, updateData);
    res
      .status(200)
      .json({ data: updatedTask, message: "Task updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while updating task", error: error.message });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;
  const userId = req.user_id;

  try {
    const task = await Task.get(id);
    if (!task) {
      return res.status(404).json({ message: `Task with id ${id} not found` });
    }
    const boardId = task.board;
    const contributor = await Contributor.getOne(boardId, userId);
    if (contributor?.role !== "ADMIN" || contributor?.role !== "EDITOR") {
      return res.status(403).json({ message: "Unauthorized to delete task" });
    }

    const deletedTask = await Task.remove(id);
    res
      .status(200)
      .json({ data: deletedTask, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting task" });
  }
}

export default {
  fetchTask,
  fetchTasksByBoard,
  createTask,
  updateTask,
  deleteTask,
};
