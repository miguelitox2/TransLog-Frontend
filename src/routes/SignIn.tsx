import logo from "../../src/assets/Logo.svg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Inputs } from "../components/Inputs";
import { useAuth } from "../components/AuthContext";
import toast from "react-hot-toast";

// Schema de validação
const signInSchema = z.object({
  email: z.string().email("Erro ao efetuar Login"),
  password: z.string().min(6, "Usuário ou senha inválidos"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignIn() {
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
    <main className="w-full flex gap-10 items-center justify-center h-screen text-slate-50 bg-gradient-to-br from-slate-800 via-slate-950 to-slate-950">
      <div className="flex flex-col items-center gap-1">
        <img src={logo} alt="logo" className="size-24" />
        <h1 className="text-4xl font-bold mt-2 mb-1.5">Translog</h1>
        <span className="text-slate-400 font-light text-lg">
          Sistema de Gestão CTE
        </span>
      </div>

      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="w-96 py-4 border border-slate-800 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-center rounded-xl px-5 shadow-2xl">
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Inputs
                label="E-mail"
                placeholder="seu@email.com"
                id="email"
                {...register("email")}
              />
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
                <span className="text-xs text-red-400">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-slate-200 hover:bg-slate-300 w-full rounded-md py-2 my-4 cursor-pointer text-slate-800 font-bold transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Autenticando..." : "Entrar"}
          </button>

          <footer className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-slate-500">
              © 2025 TransLog - Gestão Profissional
            </span>
            <span className="text-[10px] text-slate-500">
              Desenvolvido por Vinicius de Souza
            </span>
          </footer>
        </div>
      </form>
    </main>
  );
}
