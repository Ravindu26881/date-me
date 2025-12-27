import { fetchWithAuth } from './authService';

const API_URL = 'https://date-me-backend.onrender.com';

/**
 * Get all users (authenticated)
 * @returns {Promise<Array>} List of users
 */
export const getUsers = async () => {
  const response = await fetchWithAuth(`${API_URL}/api/users`);
  if (!response) return [];
  return response.json();
};

/**
 * Get a user by ID (authenticated)
 * @param {string} id - User ID
 * @returns {Promise<Object|null>} User data or null
 */
export const getUserById = async (id) => {
  const response = await fetchWithAuth(`${API_URL}/api/users/${id}`);
  if (!response || !response.ok) return null;
  return response.json();
};

/**
 * Update user profile (authenticated)
 * @param {string} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (id, userData) => {
  const response = await fetchWithAuth(`${API_URL}/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
  if (!response) return null;
  return response.json();
};

/**
 * Like a user (authenticated)
 * @param {string} userId - ID of user to like
 * @returns {Promise<Object>} Response data
 */
export const likeUser = async (userId) => {
  const response = await fetchWithAuth(`${API_URL}/api/users/${userId}/like`, {
    method: 'POST'
  });
  if (!response) return null;
  return response.json();
};

/**
 * Dislike/pass on a user (authenticated)
 * @param {string} userId - ID of user to pass
 * @returns {Promise<Object>} Response data
 */
export const dislikeUser = async (userId) => {
  const response = await fetchWithAuth(`${API_URL}/api/users/${userId}/dislike`, {
    method: 'POST'
  });
  if (!response) return null;
  return response.json();
};

export default {
  getUsers,
  getUserById,
  updateUser,
  likeUser,
  dislikeUser
};
