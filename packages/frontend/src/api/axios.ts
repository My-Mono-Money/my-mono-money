import axios from 'axios';

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

axiosPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
