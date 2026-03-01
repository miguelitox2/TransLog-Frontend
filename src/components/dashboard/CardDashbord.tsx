import { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  badgeColorsByStatus,
  badgeColorsByPriority,
} from "../../utils/BadgeColorStats";
import { CteData } from "../../types/cte";
import { Loader2 } from "lucide-react";

export function CardDashbord() {
  const [ctes, setCtes] = useState<CteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const response = await api.get("/ctes");
        setCtes(response.data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  // Calculando os valores com base nos dados reais do banco
  const stats = [
    {
      label: "CTEs Pendentes",
      value: ctes.filter((cte) => cte.status === "Pendente").length,
      color: badgeColorsByStatus["Pendente"],
    },
    {
      label: "Finalizados",
      value: ctes.filter((cte) => cte.status === "Finalizado").length,
      color: badgeColorsByStatus["Finalizado"],
    },
    {
      label: "CTEs Indenizados",
      // Ajuste conforme o nome do seu campo de prioridade/causa no banco
      value: ctes.filter(
        (cte) =>
          cte.cause === "Indenização" ||
          (cte as any).priority === "Indenização",
      ).length,
      color: badgeColorsByPriority["Indenização"],
    },
    {
      label: "Total de Ocorrências",
      value: ctes.length,
      color: badgeColorsByStatus["Total"],
    },
  ];

  if (loading) {
    return (
      <div className="flex gap-4 py-4">
        <Loader2 className="animate-spin text-blue-500" size={24} />
        <span className="text-slate-400">Carregando indicadores...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 text-slate-50">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`flex flex-1 bg-slate-800 border-l-4 border-l-${item.color} items-center justify-between py-3 px-5 rounded-md shadow-md min-w-[200px] gap-4 transition-all hover:border-slate-500`}
        >
          <span className="text-sm font-medium text-slate-300">
            {item.label}
          </span>
          <span
            className={`${item.color} py-1 px-4 rounded-lg text-lg font-bold shadow-sm`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
