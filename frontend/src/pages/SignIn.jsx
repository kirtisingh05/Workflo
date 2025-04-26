import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./SignIn.css";

export default function SignIn() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await login(formData.email, formData.password);
			navigate("/dashboard");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to sign in");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="signin-container">
			<div className="signin-card">
				<h1>Welcome Back</h1>
				<p className="subtitle">Sign in to continue to Workflo</p>

				{error && <div className="error-message">{error}</div>}

				<form onSubmit={handleSubmit} className="signin-form">
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							placeholder="Enter your email"
							autoComplete="email"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							placeholder="Enter your password"
							autoComplete="current-password"
						/>
					</div>

					<button
						type="submit"
						className={`signin-button ${isLoading ? "loading" : ""}`}
						disabled={isLoading}
					>
						{isLoading ? "Signing in..." : "Sign In"}
					</button>
				</form>

				<div className="auth-links">
					<p className="signup-link">
						Don't have an account? <Link to="/signup">Sign Up</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
