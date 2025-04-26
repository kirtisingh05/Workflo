import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
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
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
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
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

async function get(id) {
  try {
    const task = await Task.findById(id)
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");
    return task;
  } catch (error) {
    throw new Error(`Error finding task with id ${id}: ${error.message}`);
  }
}

async function getAll(board_id) {
  try {
    const tasks = await Task.find({ board: board_id })
      .populate("created_by", "name email")
      .populate("assigned_to", "name email")
      .sort({ createdAt: -1 });
    return tasks;
  } catch (error) {
    throw new Error(
      `Error fetching tasks for board with id ${board_id}: ${error.message}`,
    );
  }
}

async function create(taskData) {
  try {
    const task = new Task(taskData);
    await task.save();
    const populatedTask = await get(task._id);
    return populatedTask;
  } catch (error) {
    throw new Error(`Error creating task: ${error.message}`);
  }
}

async function update(id, taskData) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { ...taskData },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");

    if (!updatedTask) {
      throw new Error(`Task with id ${id} not found`);
    }

    return updatedTask;
  } catch (error) {
    throw new Error(`Error updating task with id ${id}: ${error.message}`);
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

async function updateSubtasks(id, subtasks) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { subtasks },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");

    if (!updatedTask) {
      throw new Error(`Task with id ${id} not found`);
    }

    return updatedTask;
  } catch (error) {
    throw new Error(
      `Error updating subtasks for task with id ${id}: ${error.message}`,
    );
  }
}

async function updateStatus(id, status) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");

    if (!updatedTask) {
      throw new Error(`Task with id ${id} not found`);
    }

    return updatedTask;
  } catch (error) {
    throw new Error(
      `Error updating status for task with id ${id}: ${error.message}`,
    );
  }
}

export default {
  get,
  getAll,
  create,
  update,
  remove,
  updateSubtasks,
  updateStatus,
};
