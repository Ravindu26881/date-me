const API_URL = 'https://date-me-backend.onrender.com';

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/api/users`);
  return response.json();
};

export const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/api/users/${id}`);
  if (!response.ok) return null;
  return response.json();
};

export default {
  getUsers,
  getUserById
};