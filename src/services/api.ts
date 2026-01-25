import axios from "axios";

export const api = axios.create({
  // Se existir a variável de ambiente (Vercel), usa ela.
  // Caso contrário (Local), usa o localhost.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});

export const getUsers = () => api.get("/users/list");
export const getBranches = () => api.get("/users/branches");
export const registerUser = (userData: any) =>
  api.post("/users/register", userData);

// Este interceptor anexa o seu token JWT real em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rodonaves_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
