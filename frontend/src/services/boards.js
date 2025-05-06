import axios from "axios";

export const createBoard = async (boardData) => {
  try {
    const response = await axios.post("/api/board/create", boardData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create board");
  }
};

export const fetchBoards = async (query, trashed = false) => {
  try {
    const params = new URLSearchParams();
    if (query) params.append("title", query);
    if (trashed) params.append("trashed", "true");

    const response = await axios.get(`/api/board/fetch?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch boards");
  }
};

export const getBoard = async (boardId) => {
  try {
    const response = await axios.get(`/api/board/fetch/${boardId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch board");
  }
};

export const updateBoard = async (boardId, boardData) => {
  try {
    const response = await axios.post(
      `/api/board/update/${boardId}`,
      boardData,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update board");
  }
};

export const deleteBoard = async (boardId) => {
  try {
    await axios.delete(`/api/board/delete/${boardId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete board");
  }
};

export const moveToTrash = async (boardId) => {
  try {
    const response = await axios.post(
      `/api/board/update/${boardId}`,
      { trashed: true },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to move board to trash",
    );
  }
};

export const restoreFromTrash = async (boardId) => {
  try {
    const response = await axios.post(
      `/api/board/update/${boardId}`,
      { trashed: false },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to restore board from trash",
    );
  }
};

export const searchBoards = async (query) => {
  try {
    const response = await axios.get("/api/board/fetch", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to search boards");
  }
};
