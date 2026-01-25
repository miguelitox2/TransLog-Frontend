
import { badgeColorsByPriority } from "../../utils/BadgeColorStats";
import { api } from "../../services/api";
import { CteData } from "../../types/cte";
import { useEffect, useState } from "react";

export function LastCTEs() {
  const [recentCTEs, setRecentCTEs] = useState<CteData[]>([]);

  useEffect(() => {
    async function loadRecentCTEs() {
      try {
        const response = await api.get("/ctes");
        setRecentCTEs(response.data);
      } catch (error) {
        console.error("Erro ao carregar CTEs recentes:", error);
      }
    }
    loadRecentCTEs();
  }, []);

  const lastCTEs = recentCTEs.slice(0, 3);

  return (
    <div className="bg-slate-800 text-slate-50 p-6 rounded-lg shadow-lg flex-1">
      <h2 className="text-lg font-semibold">Ultimas Ocorrências</h2>
      <ul className="hover:border-slate-700">
        {lastCTEs.map((cte, index) => (
          <li key={index} className="flex flex-col gap-4 mt-4">
            <div className="flex bg-slate-900 border border-slate-900/40 hover:border-slate-500 items-center justify-between rounded-lg ease-in-out duration-300">
              <div className="flex flex-col py-3 px-4 gap-2">
                <span className="text-md font-bold">{cte.numberCte}</span>
                <span className="text-sm">{cte.clientName}</span>
              </div>
              <div className="flex flex-col items-end justify-end w-40 gap-2 pr-4">
                <span
                  className={` text-xs py-0.5 px-2 rounded-full
                    ${badgeColorsByPriority[cte.cause]} 
                    ${
                      cte.cause != "Urgente" ? "text-slate-50" : "text-white"
                    }`}
                >
                  {cte.cause}
                </span>
                <span className="text-xs">{cte.status}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
