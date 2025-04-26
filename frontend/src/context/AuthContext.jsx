import { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

/**
 * AuthProvider is a component which wraps its children with AuthContext
 * and provides authToken, user details and login-logout functions.
 */
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState({});
	const [role, setRole] = useState("");
	const [loading, setLoading] = useState(true);
	//const navigate = useNavigate();

	useEffect(() => {
		// get user details
		let user = localStorage.getItem("user");

		const getRole = async () => {
			try {
				setLoading(true);
				const res = await axios.get(`/api/users/role/${user._id}`);
				setRole(res.data.data);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.log(error.message);
			}
		};

		if (user) {
			user = JSON.parse(user);
			setUser(user);
			getRole();
		}

		setLoading(false);
	}, []);

	const saveUserInfo = async (user, callback) => {
		localStorage.setItem("user", JSON.stringify(user));
		setUser(user);
		try {
			const res = await axios.get(`/api/users/role/${user._id}`);
			const fetchedRole = res.data.data;
			setRole(fetchedRole);
			if (callback) callback(fetchedRole);
		} catch (error) {
			console.error("Error fetching role:", error);
			if (callback) callback(null);
		}
	};

	const logout = () => {
		localStorage.clear();
		axios.post("/api/auth/signout", { withCredentials: true });
		//navigate("/login");
	};

	return (
		<AuthContext.Provider value={{ user, role, loading, saveUserInfo, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
