import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "../components/Header";
import { Inputs } from "../components/Inputs";
import { api } from "../services/api";
import { cteSchema, CteFormData } from "../utils/schema";
import toast from "react-hot-toast";

export function CreatePending() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CteFormData>({
    resolver: zodResolver(cteSchema),
  });

  const onSubmit = async (data: CteFormData) => {
    try {
      // Criamos o objeto exatamente como o Prisma espera
      const formattedData = {
        ...data,
        // Converte RO para número inteiro (ou undefined se estiver vazio)
        ro: data.ro ? parseInt(data.ro) : undefined,
        // Converte Valor para float (tratando a vírgula brasileira)
        value: data.value
          ? parseFloat(data.value.toString().replace(",", "."))
          : 0,
        accountable: data.accountable || "Undefined",
        // Garante que o status inicial seja Pendente
        status: "Pendente",
      };

      await api.post("/ctes", formattedData);

      toast.success("CTE registrado com sucesso no sistema!");
      reset();
    } catch (error: any) {
      console.error("Erro completo do backend:", error.response?.data);
      toast.error(
        `Erro ao salvar: ${error.response?.data?.error || "Verifique os campos"}`,
      );
    }
  };

  return (
    <main className="w-full px-6 text-slate-50 overflow-hidden">
      <Header
        title="Registrar Ocorrência"
        subtitle="Cadastro de nova ocorrência CTE"
      />

      <section className="w-full bg-slate-800 p-6 border border-slate-700 rounded-xl shadow-lg scroll-auto">
        <header>
          <h1 className="text-lg font-semibold">Dados da Ocorrência</h1>
          <hr className="border-slate-700 mt-4" />
        </header>

        {/* Tag Semântica Form com onSubmit do Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3 py-3">
            <div className="flex flex-col gap-1">
              <Inputs
                label="Número CTE *"
                placeholder="Ex: 123456-w-231"
                id="numberCte"
                {...register("numberCte")}
              />
              {errors.numberCte && (
                <span className="text-xs text-red-400 ml-1">
                  {errors.numberCte.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Inputs
                label="Nome Remetente *"
                placeholder="Nome/Empresa remetente"
                id="shipperName"
                {...register("shipperName")}
              />
              {errors.shipperName && (
                <span className="text-xs text-red-400 ml-1">
                  {errors.shipperName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Inputs
                label="Nome Destinatário *"
                placeholder="Nome/Empresa destinatário"
                id="clientName"
                {...register("clientName")}
              />
              {errors.clientName && (
                <span className="text-xs text-red-400 ml-1">
                  {errors.clientName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Inputs
                label="R.O"
                placeholder="Ex: 123456789"
                id="ro"
                {...register("ro")}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Inputs
                label="Valor da Indenização"
                placeholder="Ex: 100.00"
                id="value"
                type="text"
                {...register("value")}
              />
            </div>
          </div>

          <fieldset className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="cause" className="text-sm ml-1 text-slate-50">
                Tipo de Ocorrência *
              </label>
              <select
                id="cause"
                {...register("cause")}
                className="bg-slate-950 text-slate-400 text-sm rounded-lg px-3 py-3 border border-slate-700 focus:outline-none focus:border-slate-400"
              >
                <option value="">Selecione o tipo de ocorrência</option>
                <option value="Avaria">Avaria</option>
                <option value="Extravio">Extravio</option>
                <option value="Ausente">Ausente</option>
                <option value="Indenização">Indenização</option>
                <option value="Etiquetagem">Etiquetagem Errada</option>
              </select>
              {errors.cause && (
                <span className="text-xs text-red-400 ml-1">
                  {errors.cause.message}
                </span>
              )}
              <div className="flex flex-col gap-2 w-full">
                <label
                  htmlFor="accountable"
                  className="text-sm ml-1 text-slate-50"
                >
                  Causador
                </label>
                <select
                  id="accountable"
                  {...register("accountable")}
                  className="bg-slate-950 text-slate-400 text-sm rounded-lg px-3 py-3 border border-slate-700 focus:outline-none focus:border-slate-400"
                >
                  <option value="">Selecione quem causou</option>{" "}
                  {/* Valor vazio aqui é essencial */}
                  <option value="Administrativo">Administrativo</option>
                  <option value="Operacional">Operacional</option>
                  <option value="Undefined">Não definido</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="description"
                className="text-sm font-medium text-zinc-200 ml-1"
              >
                Observações
              </label>
              <textarea
                id="description"
                {...register("description")}
                placeholder="Descreva com detalhes da ocorrência..."
                className="w-full h-16 rounded-lg border border-slate-700 bg-slate-950 text-sm text-zinc-100 placeholder-zinc-400 p-3 focus:outline-none focus:ring-1 focus:ring-slate-600 resize-none shadow-sm"
              />
              {errors.description && (
                <span className="text-xs text-red-400 ml-1">
                  {errors.description.message}
                </span>
              )}
            </div>
          </fieldset>

          <footer className="mt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600/70 hover:bg-blue-700 cursor-pointer transition-all duration-200 text-slate- w-full py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? "Processando..." : "Registrar Ocorrência"}
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
}
