import Task from "../models/task.js";

async function fetchTasksByBoard(req, res) {
  const { board_id } = req.params;
  try {
    const tasks = await Task.getAll(board_id);
    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: `No tasks found for board id ${board_id}` });
    }
    res
      .status(200)
      .json({ data: tasks, message: `Tasks fetched for board id ${board_id}` });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching tasks" });
  }
}

async function fetchTask(req, res) {
  const { id } = req.params;
  try {
    const task = await Task.get(id);
    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: task, message: "Task fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching task" });
  }
}

async function createTask(req, res) {
  try {
    const taskData = req.body;
    const task = await Task.create(taskData);
    res
      .status(201)
      .json({ data: task, message: "Task created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while creating task" });
  }
}

async function updateTask(req, res) {
  const { id } = req.params;
  try {
    const updateData = req.body;
    const updatedTask = await Task.update(id, updateData);
    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: `Task with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: updatedTask, message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating task" });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;
  try {
    const deletedTask = await Task.remove(id);
    if (!deletedTask) {
      return res
        .status(404)
        .json({ message: `Task with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: deletedTask, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting task" });
  }
}

export default {
  fetchTasksByBoard,
  fetchTask,
  createTask,
  updateTask,
  deleteTask,
};
