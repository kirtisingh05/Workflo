import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiMoon, FiSun, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";

const Header = ({ onToggleDarkMode, isDarkMode }) => {
	const navigate = useNavigate();
	const { isAuthenticated, user, logout } = useAuth();
	const [showProfileDropdown, setShowProfileDropdown] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
		<header className="bg-white dark:bg-gray-800 shadow-md fixed w-full top-0 z-50">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<div
							onClick={handleLogoClick}
							className="flex-shrink-0 flex items-center cursor-pointer"
						>
							<span className="text-2xl font-bold text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-indigo-500 transition-all duration-200">
								Workflo
							</span>
						</div>
					</div>

					{/* Mobile menu button */}
					<div className="flex items-center sm:hidden">
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
						>
							{isMobileMenuOpen ? (
								<FiX className="h-6 w-6" />
							) : (
								<FiMenu className="h-6 w-6" />
							)}
						</button>
					</div>

					{/* Desktop nav */}
					<div className="hidden sm:flex sm:items-center sm:space-x-4">
						<button
							onClick={onToggleDarkMode}
							className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
							title="Toggle Dark Mode"
						>
							{isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
						</button>

						{isAuthenticated ? (
							<div className="relative">
								<button
									onClick={toggleProfileDropdown}
									className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
								>
									<div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white">
										{user?.name?.[0] || "U"}
									</div>
								</button>

								{showProfileDropdown && (
									<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all duration-200">
										<button
											onClick={handleViewProfile}
											className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
										>
											<FiUser className="mr-3 h-4 w-4" />
											View Profile
										</button>
										<button
											onClick={handleLogout}
											className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
										>
											<FiLogOut className="mr-3 h-4 w-4" />
											Logout
										</button>
									</div>
								)}
							</div>
						) : (
							<div className="flex items-center space-x-4">
								<button
									onClick={() => navigate("/sign-in")}
									className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none"
								>
									Login
								</button>
								<button
									onClick={() => navigate("/sign-up")}
									className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
								>
									Sign up
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Mobile menu */}
				<div className={`${isMobileMenuOpen ? "block" : "hidden"} sm:hidden`}>
					<div className="pt-2 pb-3 space-y-1">
						{isAuthenticated ? (
							<>
								<button
									onClick={handleViewProfile}
									className="w-full flex items-center px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
								>
									<FiUser className="mr-3 h-5 w-5" />
									Profile
								</button>
								<button
									onClick={handleLogout}
									className="w-full flex items-center px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
								>
									<FiLogOut className="mr-3 h-5 w-5" />
									Logout
								</button>
							</>
						) : (
							<>
								<button
									onClick={() => navigate("/sign-in")}
									className="w-full px-4 py-2 text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
								>
									Login
								</button>
								<button
									onClick={() => navigate("/sign-up")}
									className="w-full px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
								>
									Sign up
								</button>
							</>
						)}
						<button
							onClick={onToggleDarkMode}
							className="w-full flex items-center px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							{isDarkMode ? (
								<>
									<FiSun className="mr-3 h-5 w-5" />
									Light Mode
								</>
							) : (
								<>
									<FiMoon className="mr-3 h-5 w-5" />
									Dark Mode
								</>
							)}
						</button>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Header;
