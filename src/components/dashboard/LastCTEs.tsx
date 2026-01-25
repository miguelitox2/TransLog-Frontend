import { badgeColorsByPriority } from "../../utils/BadgeColorStats"; // Verifique se o caminho é ../ ou ../../
import { api } from "../../services/api";
import { CteData } from "../../types/cte";
import { useEffect, useState } from "react";

export function LastCTEs() {
  const [recentCTEs, setRecentCTEs] = useState<CteData[]>([]);

  useEffect(() => {
    async function loadRecentCTEs() {
      try {
        const response = await api.get("/ctes");
        // Garantimos que a data vinda da API é um array
        setRecentCTEs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao carregar CTEs recentes:", error);
      }
    }
    loadRecentCTEs();
  }, []);

  // Pegamos os 3 primeiros.
  // Dica: Se quiser os últimos criados, garanta que o backend venha ordenado por data decrescente.
  const lastCTEs = recentCTEs.slice(0, 3);

  return (
    <div className="bg-slate-800 text-slate-50 p-6 rounded-lg shadow-lg flex-1">
      <h2 className="text-lg font-semibold">Últimas Ocorrências</h2>
      <ul>
        {lastCTEs.map(
          (
            cte: CteData, // <-- Definindo o tipo aqui para evitar o erro TS7006
          ) => (
            <li
              key={cte.id || cte.numberCte}
              className="flex flex-col gap-4 mt-4"
            >
              {/* Use o id do banco como key em vez do index para melhor performance */}
              <div className="flex bg-slate-900 border border-slate-900/40 hover:border-slate-500 items-center justify-between rounded-lg ease-in-out duration-300">
                <div className="flex flex-col py-3 px-4 gap-2">
                  <span className="text-md font-bold">{cte.numberCte}</span>
                  <span className="text-sm text-slate-400">
                    {cte.clientName}
                  </span>
                </div>
                <div className="flex flex-col items-end justify-end w-40 gap-2 pr-4">
                  <span
                    className={`text-[10px] font-bold py-0.5 px-2 rounded-full uppercase
                    ${badgeColorsByPriority[cte.cause || ""]} 
                    text-white`}
                  >
                    {cte.cause}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    {cte.status}
                  </span>
                </div>
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
