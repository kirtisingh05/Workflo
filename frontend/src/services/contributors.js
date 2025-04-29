import api from "./auth";

export const addContributor = async (boardId, userData) => {
  try {
    const response = await api.post(
      `/boards/${boardId}/contributors`,
      userData,
    );
    return response.data.contributor;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add contributor",
    );
  }
};

export const removeContributor = async (boardId, userId) => {
  try {
    await api.delete(`/boards/${boardId}/contributors/${userId}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to remove contributor",
    );
  }
};

export const getContributors = async (boardId) => {
  try {
    const response = await api.get(`/api/contributor/fetch/${boardId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch contributors",
    );
  }
};

export const updateContributorRole = async (boardId, userId, role) => {
  try {
    const response = await api.put(
      `/boards/${boardId}/contributors/${userId}`,
      { role },
    );
    return response.data.contributor;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update contributor role",
    );
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await api.get("/users/search", { params: { q: query } });
    return response.data.users;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to search users");
  }
};
