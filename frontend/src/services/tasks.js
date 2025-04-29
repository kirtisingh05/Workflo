import api from "./auth";

export const createTask = async (taskData) => {
  try {
    const response = await api.post(`/api/task/create`, taskData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create task");
  }
};

export const getTasks = async (boardId) => {
  try {
    const response = await api.get(`/api/task/fetch/board/${boardId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
};

export const getTask = async (taskId) => {
  try {
    const response = await api.get(`/api/task/fetch/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch task");
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.post(`/api/task/update/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update task");
  }
};

export const deleteTask = async (taskId) => {
  try {
    await api.delete(`/api/task/delete/${taskId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete task");
  }
};
