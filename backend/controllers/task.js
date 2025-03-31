import Task from "../models/task.js";

// GET endpoints:
//
// - /task/fetch/board/:board_id : gets all tasks of a board by board_id
async function fetchTasksByBoard(req, res) {
  const { board_id } = req.params;
  try {
    const tasks = await Task.getByBoardId(board_id);
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

// - /task/fetch/:id : gets a task by id
async function fetchTask(req, res) {
  const { id } = req.params;
  try {
    const task = await Task.getById(id);
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

// POST endpoints:
//
// - /task/create : creates a task
async function createTask(req, res) {
  try {
    const taskData = req.body;
    const newTask = await Task.create(taskData);
    res
      .status(201)
      .json({ data: newTask, message: "Task created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while creating task" });
  }
}

// - /task/update/:id : updates a task by id
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

// DELETE endpoint:
//
// - /task/delete/:id : deletes a task by id
async function deleteTask(req, res) {
  const { id } = req.params;
  try {
    const deletedTask = await Task.delete(id);
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
