import api from './auth';

export const createBoard = async (boardData) => {
  try {
    const response = await api.post('/api/board/create', boardData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create board');
  }
};

export const fetchBoards = async (query, trashed = false) => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (trashed) params.append('trashed', 'true');
    
    const response = await api.get(`/api/board/fetch?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch boards');
  }
};

export const getBoard = async (boardId) => {
  try {
    const response = await api.get(`/api/board/fetch/${boardId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch board');
  }
};

export const updateBoard = async (boardId, boardData) => {
  try {
    const response = await api.post(`/api/board/update/${boardId}`, boardData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update board');
  }
};

export const deleteBoard = async (boardId) => {
  try {
    await api.delete(`/api/board/delete/${boardId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete board');
  }
};

export const moveToTrash = async (boardId) => {
  try {
    const response = await api.post(`/api/board/trash/${boardId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to move board to trash');
  }
};

export const restoreFromTrash = async (boardId) => {
  try {
    const response = await api.post(`/api/board/restore/${boardId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to restore board from trash');
  }
};

export const searchBoards = async (query) => {
  try {
    const response = await api.get('/api/board/fetch', { params: { query } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search boards');
  }
};