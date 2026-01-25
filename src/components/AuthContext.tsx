import React, { createContext, useState, useEffect, useContext } from "react";
import { api } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  signIn(credentials: { email: string; password: string }): Promise<void>;
  signOut(): void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica se já existe um usuário logado ao carregar a página
  useEffect(() => {
    async function loadStorageData() {
      const storagedToken = localStorage.getItem("@TransLog:token");
      const storagedUser = localStorage.getItem("@TransLog:user");

      if (storagedToken && storagedUser) {
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        setUser(JSON.parse(storagedUser));
      }
      
      setLoading(false); // Finaliza o carregamento independente de achar usuário ou não
    }

    loadStorageData();
  }, []);

  async function signIn({ email, password }: any) {
    try {
      const response = await api.post("/users/login", { email, password });
      const { token, user: userData } = response.data;

      // 1. Salva no Estado
      setUser(userData);

      // 2. Injeta no Axios para as próximas chamadas
      api.defaults.headers.Authorization = `Bearer ${token}`;

      // 3. Salva no LocalStorage
      localStorage.setItem("@TransLog:token", token);
      localStorage.setItem("@TransLog:user", JSON.stringify(userData));
    } catch (error) {
      throw new Error("E-mail ou senha inválidos.");
    }
  }

  function signOut() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para facilitar o uso
export function useAuth() {
  return useContext(AuthContext);
}