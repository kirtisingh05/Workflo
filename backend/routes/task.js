import { Router } from "express";
import taskController from "../controllers/task.js";

const router = Router();

// GET endpoints:
// Use a distinct route prefix for fetching tasks by board id to avoid conflict with fetching by task id.
router.get("/fetch/board/:board_id", taskController.fetchTasksByBoard);
router.get("/fetch/:id", taskController.fetchTask);

// POST endpoints:
// /task/create -> Creates a task
// /task/update/:id -> Updates a task by id
router.post("/create", taskController.createTask);
router.post("/update/:id", taskController.updateTask);

// DELETE endpoint:
// /task/delete/:id -> Deletes a task by id
router.delete("/delete/:id", taskController.deleteTask);

export default router;
