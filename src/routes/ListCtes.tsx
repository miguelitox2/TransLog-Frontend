import { useEffect, useState, useCallback } from "react";
import { Header } from "../components/Header";
import { api } from "../services/api";
import {
  badgeColorsByStatus,
  badgeColorsByPriority,
} from "../utils/BadgeColorStats";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { CteModal } from "../components/dashboard/CteModal";
import { CteData } from "../types/cte";

export function ListCtes() {
  const [selectedCte, setSelectedCte] = useState<CteData | null>(null);
  const [ctes, setCtes] = useState<CteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState("");
  const [selectedStatus, setStatus] = useState("Todos");
  const [selectCause, setSelectCause] = useState("Todos");
  const itemsPerPage = 10;

  // 1. Função de busca com lógica de sincronização para o Modal aberto
  const loadCtes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/ctes");
      const updatedData = response.data;

      setCtes(updatedData);

      // VERIFICAÇÃO DE SINCRONISMO:
      // Se houver um CTE selecionado (modal aberto), encontramos a versão nova dele
      // e atualizamos o estado. Isso forçará o Modal a "recarregar" os dados salvos.
      if (selectedCte) {
        const freshData = updatedData.find(
          (item: CteData) => item.id === selectedCte.id,
        );
        if (freshData) {
          setSelectedCte(freshData);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar CTEs:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCte]); // Adicionado selectedCte como dependência para capturar o ID atual

  // 2. Carregamento inicial
  useEffect(() => {
    loadCtes();
  }, []); // Mantemos vazio aqui para carregar apenas no mount

  // 3. Lógica de Debounce para pesquisa
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTimeout(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // 4. Filtros aplicados sobre o estado 'ctes'
  const filteredItems = ctes.filter((item) => {
    const matchCte = String(item.numberCte || "")
      ?.toLowerCase()
      .includes(searchTimeout.toLowerCase());

    const searchTerm = searchTimeout.toLowerCase();

    const clientNameMatch = item.clientName?.toLowerCase().includes(searchTerm);

    const matchStatus =
      selectedStatus === "Todos" || item.status === selectedStatus;

    const matchCause = selectCause === "Todos" || item.cause === selectCause;

    return (matchCte || clientNameMatch) && matchStatus && matchCause;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  return (
    <main className="w-full h-screen px-6 overflow-auto text-slate-50 pb-10">
      <CteModal
        cte={selectedCte}
        onClose={() => setSelectedCte(null)}
        onUpdate={loadCtes}
      />

      <Header title="Lista de CTEs" subtitle="Gerenciador de CTE" />

      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-xl text-white">Ocorrências</h1>
        {loading && (
          <Loader2 className="animate-spin text-blue-500" size={20} />
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 pt-4 mb-6">
        <input
          type="text"
          placeholder="Pesquisar número..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border bg-slate-800 text-sm border-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-slate-700 w-64 text-white placeholder-slate-500"
        />

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-800 text-sm rounded-lg px-2 py-1.5 focus:outline-none border border-slate-700 text-white"
          >
            <option value="Todos">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Causa</label>
          <select
            value={selectCause}
            onChange={(e) => setSelectCause(e.target.value)}
            className="bg-slate-800 text-sm rounded-lg px-2 py-1.5 border border-slate-700 text-white"
          >
            <option value="Todos">Todos</option>
            <option value="Avaria">Avaria</option>
            <option value="Extravio">Extravio</option>
            <option value="Indenização">Indenização</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 shadow-2xl">
        <table className="w-full text-sm text-left">
          <thead className="text-slate-50 bg-slate-900/50">
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 font-medium">Chamado</th>
              <th className="px-4 py-3 font-medium">Data Abertura</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium text-center">Causa</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && ctes.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-blue-500" size={18} />
                    <span>Carregando dados...</span>
                  </div>
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedCte(item)}
                  className="hover:bg-slate-900/80 border-b border-slate-800 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3 font-bold text-blue-400 uppercase tracking-wider group-hover:text-blue-300 transition-colors">
                    {item.numberCte}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 uppercase text-xs text-slate-300">
                    {item.clientName}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${badgeColorsByPriority[item.cause]}`}
                    >
                      {item.cause}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${badgeColorsByStatus[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-500">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginação */}
        <footer className="flex justify-between items-center px-6 py-4 bg-slate-900/30 border-t border-slate-800">
          <span className="text-xs text-slate-500">
            Mostrando {currentItems.length} de {filteredItems.length} registros
          </span>
          <div className="flex items-center gap-2 text-white">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-slate-800 disabled:opacity-30 hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-slate-800 disabled:opacity-30 hover:bg-slate-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
