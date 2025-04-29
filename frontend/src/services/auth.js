import axios from "axios";

export const signUp = async (userData) => {
  try {
    const response = await axios.post("/api/auth/signup", userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create account",
    );
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await axios.post("/api/auth/signin", credentials, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to sign in");
  }
};

export const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await axios.get("/api/auth/me");
    return response.data.user;
  } catch (error) {
    if (error.response?.status === 401) {
      signOut();
      return null;
    }
    throw error;
  }
};

export const updateProfile = async (userId, userData) => {
  try {
    const response = await axios.post(`/api/user/update/${userId}`, userData);
    const updatedUser = response.data.user;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile",
    );
  }
};

export default axios;
