import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.name || '',
    email: user?.email || '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // For now, just update the context
      const updatedUser = {
        name: formData.username,
        email: formData.email,
      };
      login(updatedUser);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError('Error updating profile');
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Reset form data when canceling edit
      setFormData({
        username: user?.name || '',
        email: user?.email || '',
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {user?.name?.[0] || 'U'}
          </div>
          {!isEditing && (
            <button className={styles.changeAvatarBtn}>
              Change Avatar
            </button>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          {isEditing && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="password">Current Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter current password to confirm changes"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password (optional)</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              {formData.newPassword && (
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                  />
                </div>
              )}
            </>
          )}

          <div className={styles.formActions}>
            {isEditing ? (
              <>
                <button type="submit" className={styles.saveBtn}>
                  Save Changes
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={toggleEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className={styles.editBtn}
                onClick={toggleEdit}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;