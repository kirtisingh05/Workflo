import api from "./auth";

export const decode = async (inviteHash) => {
  try {
    const response = await api.post(
      `/api/invite/decode`,
      { inviteHash },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to decode invitation hash",
    );
  }
};

export const invite = async (
  boardId,
  inviteEmail,
  boardName,
  senderName,
  role,
) => {
  try {
    await api.post(
      `/api/invite/${boardId}`,
      { inviteEmail, boardName, senderName, role },
      { withCredentials: true },
    );
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to invite new contributor",
    );
  }
};

export const acceptInvite = async (boardId, userId, role) => {
  try {
    const res = await api.post(
      `/api/invite/accept/${boardId}/user/${userId}`,
      { role },
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to accept invitation",
    );
  }
};
