import api from "./auth";

export const addContributor = async (boardId, { email, role }) => {
  try {
    const response = await api.post("/api/contributor/create", {
      email,
      board_id: boardId,
      role
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add contributor"
    );
  }
};

export const removeContributor = async (boardId, contributorId) => {
  try {
    await api.delete(`/api/contributor/delete/${contributorId}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to remove contributor"
    );
  }
};

export const getContributors = async (boardId) => {
  try {
    const response = await api.get(`/api/contributor/fetch/${boardId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch contributors"
    );
  }
};

export const updateContributorRole = async (boardId, contributorId, role) => {
  try {
    const response = await api.post(`/api/contributor/update/${contributorId}`, {
      role
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update contributor role"
    );
  }
};
