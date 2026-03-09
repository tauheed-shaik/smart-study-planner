import axios from "axios";

const API_Base_URL = "http://localhost:5001/api";

const api = axios.create({
    baseURL: API_Base_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
