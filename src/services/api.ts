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
api.interceptors.response.use(
  (response) => {
    // Se a resposta for sucesso, apenas retorna ela normalmente
    return response;
  },
  (error) => {
    // Se o erro vier do servidor e for 401 (Token expirado ou inválido)
    if (error.response && error.response.status === 401) {
      // Limpa o token para o sistema saber que não está mais logado
      localStorage.removeItem("rodonaves_token");

      // Opcional: limpa dados do usuário se você salvar no storage
      localStorage.removeItem("user_data");

      // Redireciona para a raiz (Login) limpando o estado do navegador
      window.location.href = "/";
    }

    // Retorna o erro para que o componente (ex: Modal, Lista) saiba que falhou
    return Promise.reject(error);
  },
);
