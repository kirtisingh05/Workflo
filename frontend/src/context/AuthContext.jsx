import { useEffect, useState, createContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("/api/user/me", { withCredentials: true });
        const user = res.data;
        setUser(user);
        setLoading(loading);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logout();
        } else {
          console.log("Error fetching user");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();

    const interval = setInterval(() => {
      fetchUserInfo();
    }, 1000 * 50);

    return () => clearInterval(interval);
  }, [user]);

  const saveUserInfo = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user/me", {
        withCredentials: true,
      });
      const user = res.data;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      setUser(null);
      console.error("Error fetching user:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    axios.post("/api/auth/signout", {
      withCredentials: true,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, saveUserInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
