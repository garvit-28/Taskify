import axios from "axios";

const api = axios.create({
  baseURL: "https://taskify-j8zj.onrender.com/api", // your Render backend
});

// Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

