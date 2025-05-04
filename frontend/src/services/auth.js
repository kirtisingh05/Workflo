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

export const googleAuth = async ({ email, name, photo }) => {
  try {
    const response = await axios.post("/api/auth/google", { 
      email,
      name,
      photo
    }, {
      withCredentials: true
    });
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to authenticate with Google"
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

    const response = await axios.get("/api/user/me");
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
