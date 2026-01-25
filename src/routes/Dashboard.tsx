import { CardDashbord } from "../components/dashboard/CardDashbord";
import { Header } from "../components/Header";
import { LastCTEs } from "../components/dashboard/LastCTEs";
export function Dashboard() {
  return (
    <div className="w-full h-screen px-6 overflow-auto">
      <div>
        <Header title="Dashboard" subtitle="Gerenciador de CTE" />
      </div>
      <div>
        <main className="w-full">
          <CardDashbord />
          <section className="pt-4">
            <div className="flex flex-col md:flex-row gap-4 w-full overflow-auto">
              <LastCTEs />
              <div className="border border-slate-700/40 bg-slate-800 p-6 rounded-lg shadow-lg flex-1">
                <span className="text-lg text-slate-50 font-semibold">
                  Ações Rápidas
                </span>
                <div className="flex flex-col gap-4 mt-4">
                  <a
                    href="/register-cte"
                    className="flex bg-blue-50 border border-blue-200 items-center justify-between rounded-lg hover:bg-blue-200 ease-in-out duration-300"
                  >
                    <div className="flex flex-col gap-2 py-3 px-4">
                      <span className="text-sm font-bold text-blue-800">
                        Registrar Nova Ocorrência
                      </span>
                      <span className="text-sm text-blue-700">
                        Criar novo registro CTE
                      </span>
                    </div>
                  </a>
                  <a
                    href="/list-ctes"
                    className="flex bg-orange-50 border border-orange-200 items-center justify-between rounded-lg hover:bg-orange-200 ease-in-out duration-300"
                  >
                    <div className="flex flex-col gap-2 py-3 px-4">
                      <span className="text-sm font-bold text-orange-800">
                        Ver Chamados
                      </span>
                      <span className="text-sm text-orange-700">
                        Listar CTEs
                      </span>
                    </div>
                  </a>
                  <a
                    href="/financial"
                    className="flex bg-green-50 border border-green-200 items-center justify-between rounded-lg hover:bg-green-200 ease-in-out duration-300"
                  >
                    <div className="flex flex-col gap-2 py-3 px-4">
                      <span className="text-sm font-bold text-green-800">
                        Relatórios
                      </span>
                      <span className="text-sm text-green-700">
                        Gerar relatórios
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
