import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      required: true,
    },
    description: { type: String },
    subtasks: [
      {
        description: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
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
      ref: "Contributor",
      required: true,
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contributor",
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

async function get(id) {
  try {
    const task = await Task.findById(id);
    return task;
  } catch (error) {
    throw new Error(`Error finding task with id ${id}: ${error.message}`);
  }
}

async function getAll(board_id, filter = {}) {
  try {
    const query = { board: board_id, ...filter };
    const tasks = await Task.find(query);
    return tasks;
  } catch (error) {
    throw new Error(
      `Error fetching tasks for board with id ${board_id}: ${error.message}`,
    );
  }
}

async function create(taskData) {
  try {
    const {
      title,
      description,
      board_id,
      status,
      subtasks,
      deadline,
      created_by,
      assigned_to,
    } = taskData;

    const task = new Task({
      title,
      description,
      board: board_id,
      status,
      subtasks,
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

async function update(id, taskData) {
  try {
    const { title, description, status, subtasks, deadline, assigned_to } =
      taskData;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, subtasks, deadline, assigned_to },
      {
        new: true,
        runValidators: true,
      },
    );
    await updatedTask.save();
    return updatedTask;
  } catch (error) {
    throw new Error(`Error upding the board with id ${id}: ${error.message}`);
  }
}

async function remove(id) {
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    return deletedTask;
  } catch (error) {
    throw new Error(`Error deleting task with id ${id}: ${error.message}`);
  }
}

export default {
  get,
  getAll,
  create,
  update,
  remove,
};
