const API_URL = 'https://date-me-backend.onrender.com';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data
 */
export const register = async (userData) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  // Store the token
  localStorage.setItem('token', data.token);

  return data.user;
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data
 */
export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  // Store the token
  localStorage.setItem('token', data.token);

  return data.user;
};

/**
 * Make an authenticated fetch request
 * Automatically handles token expiry
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  // Token expired or invalid
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }

  return res;
};

/**
 * Get the current authenticated user
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  const res = await fetchWithAuth(`${API_URL}/api/auth/me`);
  if (!res) return null;
  return res.json();
};

/**
 * Logout the current user
 * Clears token and redirects to login
 */
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

/**
 * Check if user is currently logged in
 * @returns {boolean} True if logged in
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get the stored auth token
 * @returns {string|null} The auth token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Protect a route - redirects to login if not authenticated
 */
export const requireAuth = () => {
  if (!isLoggedIn()) {
    window.location.href = '/login';
    return false;
  }
  return true;
};

export default {
  register,
  login,
  logout,
  fetchWithAuth,
  getCurrentUser,
  isLoggedIn,
  getToken,
  requireAuth
};

