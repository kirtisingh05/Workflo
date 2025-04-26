import api from './auth';

export const createTask = async (boardId, taskData) => {
  try {
    const response = await api.post(`/boards/${boardId}/tasks`, taskData);
    return response.data.task;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create task');
  }
};

export const getTasks = async (boardId) => {
  try {
    const response = await api.get(`/boards/${boardId}/tasks`);
    return response.data.tasks;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
  }
};

export const getTask = async (boardId, taskId) => {
  try {
    const response = await api.get(`/boards/${boardId}/tasks/${taskId}`);
    return response.data.task;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch task');
  }
};

export const updateTask = async (boardId, taskId, taskData) => {
  try {
    const response = await api.put(`/boards/${boardId}/tasks/${taskId}`, taskData);
    return response.data.task;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update task');
  }
};

export const deleteTask = async (boardId, taskId) => {
  try {
    await api.delete(`/boards/${boardId}/tasks/${taskId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete task');
  }
};

export const moveTask = async (boardId, taskId, position) => {
  try {
    const response = await api.put(`/boards/${boardId}/tasks/${taskId}/move`, { position });
    return response.data.task;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to move task');
  }
};

export const assignTask = async (boardId, taskId, userId) => {
  try {
    const response = await api.put(`/boards/${boardId}/tasks/${taskId}/assign`, { userId });
    return response.data.task;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to assign task');
  }
};

export const unassignTask = async (boardId, taskId) => {
  try {
    const response = await api.put(`/boards/${boardId}/tasks/${taskId}/unassign`);
    return response.data.task;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to unassign task');
  }
};