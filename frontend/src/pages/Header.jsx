import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiMoon, FiSun } from "react-icons/fi";
import "./Header.css";

const Header = ({ onToggleDarkMode, isDarkMode }) => {
	const navigate = useNavigate();
	const { isAuthenticated, user, logout } = useAuth();
	const [showProfileDropdown, setShowProfileDropdown] = useState(false);

	const toggleProfileDropdown = () => {
		setShowProfileDropdown((prev) => !prev);
	};

	const handleLogout = () => {
		logout();
		navigate("/sign-in");
		setShowProfileDropdown(false);
	};

	const handleViewProfile = () => {
		navigate("/profile");
		setShowProfileDropdown(false);
	};

	const handleLogoClick = () => {
		navigate("/");
	};

	return (
		<header className="header-container">
			<nav className="nav-bar">
				<div
					className="logo"
					onClick={handleLogoClick}
					role="button"
					tabIndex={0}
				>
					Workflo
				</div>
				<div className="nav-actions">
					<button
						className="dark-mode-toggle"
						onClick={onToggleDarkMode}
						title="Toggle Dark Mode"
					>
						{isDarkMode ? <FiSun /> : <FiMoon />}
					</button>

					{isAuthenticated ? (
						<div className="profile-section">
							<div className="profile-avatar" onClick={toggleProfileDropdown}>
								{user?.name?.[0] || "U"}
							</div>
							{showProfileDropdown && (
								<div className="profile-dropdown">
									<button onClick={handleViewProfile}>View Profile</button>
									<button onClick={handleLogout}>Logout</button>
								</div>
							)}
						</div>
					) : (
						<div className="auth-buttons">
							<button onClick={() => navigate("/sign-in")}>Login</button>
							<button onClick={() => navigate("/sign-up")}>Signup</button>
						</div>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;
