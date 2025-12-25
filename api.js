import axios from "axios";

const api = axios.create({
  baseURL: "https://node-backend-eight-alpha.vercel.app/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
