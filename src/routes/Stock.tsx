import { useState, useEffect } from "react";
import { Maximize, RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { BarcodeItem } from "../types/barcode";
import { ConfirmModal } from "../components/ConfirmModal";
import { Header } from "../components/Header";

// Validação rigorosa com Zod para evitar envios desnecessários
const barcodeSchema = z.object({
  barcode: z
    .string()
    .min(21, "Código inválido (mínimo 21 caracteres)")
    .regex(/^[a-zA-Z0-9]+$/, "Apenas letras e números são permitidos"),
});

type BarcodeFormData = z.infer<typeof barcodeSchema>;

/**
 * Formata o código bruto no padrão Rodonaves: 590207-P-207/231-0012-0015
 */
const formatBarcode = (raw: string) => {
  const clean = raw.trim();
  if (clean.length < 21) return clean;

  const origem = clean.substring(0, 3); // 207
  const destino = clean.substring(3, 6); // 231
  const cte = clean.substring(6, 12); // 590207
  const letra = clean.substring(13, 14).toUpperCase(); // P
  const volAtu = clean.substring(14, 18); // 0012
  const volTot = clean.substring(18, 22); // 0015

  // Ajustado para colocar a letra logo após o número do CTE
  return `${cte}-${letra}-${origem}/${destino}-${volAtu}-${volTot}`;
};

export function Stock() {
  const [items, setItems] = useState<BarcodeItem[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BarcodeFormData>({
    resolver: zodResolver(barcodeSchema),
  });

  const fetchDailyItems = async () => {
    try {
      const response = await api.get("/barcode/list");
      setItems(response.data);
    } catch (error) {
      console.error("Erro ao carregar lista", error);
    }
  };

  useEffect(() => {
    fetchDailyItems();
  }, []);

  // Monitora erros do Zod para exibir Toast imediato
  useEffect(() => {
    if (errors.barcode) {
      toast.error(errors.barcode.message as string);
    }
  }, [errors.barcode]);

  const onAddBarcode = async (data: BarcodeFormData) => {
    try {
      const response = await api.post("/barcode/read", {
        barcode: data.barcode,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Código processado!");
        reset();
        await fetchDailyItems();
      }
    } catch (error) {
      toast.error("Código inválido ou não autorizado na unidade.");
    }
  };

  const handleSyncStatus = async () => {
    try {
      const response = await api.post("/barcode/sync");
      if (response.status === 200) {
        toast.success("Sincronização concluída!");
        await fetchDailyItems();
        setIsSyncModalOpen(false);
      }
    } catch (error) {
      toast.error("Erro ao sincronizar status.");
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "ALL") return true;
    return item.status === filter;
  });

  const stats = {
    pending: items.filter((i) => i.status === "PENDING").length,
    urgent: items.filter((i) => i.status === "URGENT").length,
    finished: items.filter((i) => i.status === "FINISHED").length,
  };

  const statusStyles = {
    PENDING: "bg-blue-600 text-white",
    URGENT: "bg-red-500 text-white animate-pulse",
    FINISHED: "bg-emerald-500 text-white",
  };

  return (
    <div className="px-6 space-y-6 overflow-hidden ">
      <Header title="Controle de Estoque" subtitle="Gerenciador Rodonaves" />

      {/* Input de Leitura Direta */}
      <form
        onSubmit={handleSubmit(onAddBarcode)}
        className="bg-slate-900 p-3 rounded-lg border border-slate-800 shadow-sm flex gap-2"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
            <Maximize size={20} className="text-blue-500" />
          </div>
          <input
            {...register("barcode")}
            type="text"
            placeholder="Escaneie o código de barras..."
            className={`w-full pl-12 pr-4 py-3 bg-slate-950 text-slate-50 border rounded-lg outline-none transition-colors ${
              errors.barcode
                ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]"
                : "border-slate-800 focus:border-blue-500"
            }`}
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold rounded-lg transition-colors shadow-md"
        >
          {isSubmitting ? "Lendo..." : "Adicionar"}
        </button>
      </form>

      {/* Cards de Filtro/Estatísticas */}
      <div className="grid grid-cols-3 gap-6">
        <button
          onClick={() => setFilter("PENDING")}
          className={`bg-slate-900 p-2 rounded-xl border-2 transition-all ${filter === "PENDING" ? "border-blue-500" : "border-transparent"}`}
        >
          <span className="block text-3xl font-bold text-slate-50">
            {stats.pending}
          </span>
          <span className="text-sm text-slate-500 uppercase font-medium">
            Ativos
          </span>
        </button>
        <button
          onClick={() => setFilter("URGENT")}
          className={`bg-slate-900 p-2 rounded-xl border-2 transition-all ${filter === "URGENT" ? "border-red-500" : "border-transparent"}`}
        >
          <span className="block text-3xl font-bold text-red-500">
            {stats.urgent}
          </span>
          <span className="text-sm text-slate-500 uppercase font-medium">
            Urgentes
          </span>
        </button>
        <button
          onClick={() => setFilter("FINISHED")}
          className={`bg-slate-900 p-3 rounded-xl border-2 transition-all ${filter === "FINISHED" ? "border-emerald-500" : "border-transparent"}`}
        >
          <span className="block text-3xl font-bold text-green-500">
            {stats.finished}
          </span>
          <span className="text-sm text-slate-500 uppercase font-medium">
            Finalizados
          </span>
        </button>
      </div>

      {/* Listagem Final */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3 ">
        <h2 className="text-xl font-bold text-slate-50">
          Listagem ({filteredItems.length})
        </h2>
        <div className="flex items-center gap-4">
          {filter !== "ALL" && (
            <button
              onClick={() => setFilter("ALL")}
              className="text-sm bg-slate-900 text-slate-50 px-4 py-2 rounded hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Limpar Filtro
            </button>
          )}
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 text-sm font-bold hover:bg-blue-700 transition-all cursor-pointer"
          >
            <RotateCcw size={16} /> Sincronizar Releituras
          </button>
        </div>
      </div>
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-6 custom-scrollbar max-h-[500px] overflow-y-auto ">
        <div className="space-y-3 pr-2 custom-scrollbar">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-xl bg-slate-950 flex items-center justify-between border-l-4 transition-all ${item.status === "PENDING" ? "border-l-blue-500" : item.status === "URGENT" ? "border-l-red-500" : "border-l-emerald-500"}`}
            >
              <div className="space-y-1">
                <p className="font-bold text-lg text-slate-50 tracking-tight">
                  {formatBarcode(item.barcode)}
                </p>
                <div className="text-xs text-slate-400">
                  Lido em: {new Date(item.lastReadAt).toLocaleTimeString()} •
                  Leituras: {item.readCount}
                </div>
              </div>
              <span
                className={`px-4 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${statusStyles[item.status as keyof typeof statusStyles]}`}
              >
                {item.status === "PENDING"
                  ? "Ativo"
                  : item.status === "URGENT"
                    ? "Urgente"
                    : "Finalizado"}
              </span>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="text-center py-10 text-slate-500 italic">
              Nenhum item encontrado.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação para Sincronização */}
      <ConfirmModal
        isOpen={isSyncModalOpen}
        title="Encerrar Dia Operacional"
        message="Deseja sincronizar as releituras? Itens não bipados hoje serão movidos para 'Finalizados'."
        confirmText="Confirmar Sincronização"
        variant="primary"
        onConfirm={handleSyncStatus}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </div>
  );
}
