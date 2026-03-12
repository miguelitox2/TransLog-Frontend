import logo from "../../src/assets/Logo.svg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Inputs } from "../components/Inputs";
import { useAuth } from "../components/AuthContext";
import toast from "react-hot-toast";
import "../style.css";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Schema de validação
const signInSchema = z.object({
  email: z.string().email("Erro ao efetuar Login"),
  password: z.string().min(6, "Usuário ou senha inválidos"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignIn() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const html = document.documentElement;

    if (isDark) {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const handleLogin = async (data: SignInFormData) => {
    try {
      await signIn(data);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login");
    }
  };

  return (
    // Alterado para flex-col no mobile e flex-row no desktop (sm:flex-row)
    <main className="w-full flex flex-col sm:flex-row gap-10 items-center justify-center min-h-screen p-6 text-slate-950 dark:text-slate-50 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-50 dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
      <div className="flex flex-col items-center gap-1 text-center">
        <img src={logo} alt="logo" className="size-20 sm:size-24" />
        <h1 className="text-3xl sm:text-4xl text-slate-950 dark:text-slate-200 font-bold mt-2 mb-1.5">
          Translog
        </h1>
        <span className="text-slate-700 dark:text-slate-400 font-light text-base sm:text-lg">
          Sistema de Gestão CTE
        </span>
      </div>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="w-full max-w-[400px]"
      >
        {/* Removido w-96 fixo e adicionado w-full com max-w para responsividade */}
        <div className="w-full py-8 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl px-6 shadow-2xl">
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Inputs
                label="E-mail"
                placeholder="seu@email.com"
                id="email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-xs text-red-400 pl-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Inputs
                type="password"
                label="Senha"
                placeholder="*********"
                id="password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-xs text-red-400 pl-1">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="dark:bg-slate-200 bg-slate-900 hover:bg-slate-700 dark:hover:bg-slate-300 w-full rounded-lg py-3 mt-6 mb-4 cursor-pointer dark:text-slate-800 text-slate-50 font-bold transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {isSubmitting ? "Autenticando..." : "Entrar"}
          </button>

          <footer className="flex flex-col items-center gap-1 mt-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
              © 2025 TransLog - Gestão Profissional
            </span>
            <span className="text-[10px] text-slate-500">
              Desenvolvido por Vinicius de Souza
            </span>
          </footer>
        </div>
      </form>

      {/* Botão de tema ajustado para não sobrepor elementos no mobile */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 sm:top-6 sm:bottom-auto p-3 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-lg cursor-pointer transition-all active:scale-90 hover:opacity-80 z-50"
      >
        {isDark ? (
          <Sun size={20} className="text-amber-500" />
        ) : (
          <Moon size={20} />
        )}
      </button>
    </main>
  );
}
