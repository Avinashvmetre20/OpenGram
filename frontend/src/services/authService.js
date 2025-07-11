import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const getMe = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateDetails = async (userData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/auth/updatedetails`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updatePassword = async (passwords) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/auth/updatepassword`, passwords, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

export default {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  logout,
};