import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchResearch = async (params) => {
  const response = await axios.get(`${API_BASE_URL}/research`, { params });
  return response.data;
};