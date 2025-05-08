import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import { FiEdit3, FiSave, FiX, FiCamera, FiMail } from "react-icons/fi";
import { updateProfile } from "../services/auth";
import api from "../services/auth";

const Profile = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userId) {
          const response = await api.get(`/api/user/${userId}`);
          setProfileUser(response.data);
          setFormData({
            username: response.data.username || "",
            email: response.data.email || "",
            password: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          setProfileUser(user);
          setFormData({
            username: user?.username || "",
            email: user?.email || "",
            password: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch (err) {
        setError("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("New passwords do not match");
      return;
    }

    try {
      // TODO: Replace with actual API call
      const updatedUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      const res = updateProfile(user._id, updatedUser);
      // saveUserInfo(res.data);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError("Error updating profile");
    }
  };

  const toggleEdit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setFormData({
        username: user?.username || "",
        email: user?.email || "",
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isOwnProfile = !userId || userId === user?._id;

  return (
    <div className="min-h-screen py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg sm:rounded-lg overflow-hidden">
          <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700 shadow-lg">
                  <div className="h-full w-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {profileUser?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  {isOwnProfile && !isEditing && (
                    <button
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors transform hover:scale-105"
                      aria-label="Change profile picture"
                    >
                      <FiCamera className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 px-4 sm:px-8 pb-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg shadow-sm animate-fade-in">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900 rounded-lg shadow-sm animate-fade-in">
                <p className="text-sm text-green-600 dark:text-green-400 text-center">
                  {success}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 
                      ${!isEditing ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                      disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                      transform hover:shadow-md transition-all duration-200`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg 
                        ${!isEditing ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                        disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                        transform hover:shadow-md transition-all duration-200`}
                    />
                    {!isOwnProfile && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                      >
                        <FiMail className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {isOwnProfile && isEditing && (
                  <>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                          transform hover:shadow-md transition-all duration-200 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                          transform hover:shadow-md transition-all duration-200 dark:text-white"
                      />
                    </div>

                    {formData.newPassword && (
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your new password"
                          className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                            transform hover:shadow-md transition-all duration-200 dark:text-white"
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-end space-x-4 mt-8">
                  {isOwnProfile && (isEditing ? (
                    <>
                      <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 
                          transform hover:translate-y-[-1px] hover:shadow-lg"
                      >
                        <FiSave className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={(e) => toggleEdit(e)}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium 
                          text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200
                          transform hover:translate-y-[-1px] hover:shadow-lg"
                      >
                        <FiX className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => toggleEdit(e)}
                      className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium 
                        text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                        transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg"
                    >
                      <FiEdit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
