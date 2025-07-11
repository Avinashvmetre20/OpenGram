import API from './api';

// Authentication endpoints
export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const updateDetails = async (userData) => {
  const response = await API.put('/auth/updatedetails', userData);
  return response.data;
};

export const updatePassword = async (passwordData) => {
  const response = await API.put('/auth/updatepassword', passwordData);
  return response.data;
};

// Admin user management endpoints
export const createAdminUser = async (userData) => {
  const response = await API.post('/auth/admin', userData);
  return response.data;
};

export const fetchAllUsers = async () => {
  const response = await API.get('/auth');
  return response.data;
};

export const fetchUserById = async (userId) => {
  const response = await API.get(`/auth/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await API.put(`/auth/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await API.delete(`/auth/${userId}`);
  return response.data;
};

export default {
  login,
  register,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  createAdminUser,
  fetchAllUsers,
  fetchUserById,
  updateUser,
  deleteUser,
};