import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  ChevronLeft,
  ChevronRight,
  PencilIcon,
  TrashIcon,
  UserPlus,
  Search,
  X,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import { ClientDetailsModal } from "../components/ClientDetailsModal"; // Importe o componente que criamos
import { ConfirmModal } from "../components/ConfirmModal";

export function ListClients() {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null); // Estado para o modal de edição+
  const [clientToDelete, setClientToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (error) {
      toast.error("Erro ao carregar lista de clientes.");
      console.error(error);
    }
  }

  const filteredClients = clients.filter((client: any) =>
    client.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentItems = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  async function confirmDelete() {
    if (!clientToDelete) return;
    const loading = toast.loading("Removendo cliente...");
    try {
      await api.delete(`/clients/${clientToDelete.id}`);
      toast.success("Cliente removido!", { id: loading });
      loadClients();
    } catch (error) {
      toast.error("Erro ao excluir cliente.", { id: loading });
    }
  }

  return (
    <main className="w-full h-screen px-6 overflow-auto text-slate-50">
      <Header
        title="Lista de Clientes"
        subtitle="Gerenciador de Clientes Rodonaves"
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-6 max-w-5xl mx-auto">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Pesquisar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-blue-600/20 w-full md:w-auto justify-center"
        >
          <UserPlus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="max-w-5xl mx-auto rounded-2xl border border-slate-800 overflow-hidden shadow-2xl bg-slate-950">
        <table className="w-full text-sm text-left">
          <thead className="text-slate-50 bg-slate-900/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">
                Nome
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">
                Telefone
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">
                Email
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {currentItems.map((client: any) => (
              <tr
                key={client.id}
                className="hover:bg-blue-600/[0.02] transition-colors group"
              >
                <td
                  className="px-6 py-4 font-bold text-slate-200 uppercase cursor-pointer hover:text-blue-500"
                  onClick={() => setSelectedClient(client)}
                >
                  {client.name}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {client.phone
                    ? client.phone.split(",")[0] // Pega apenas o que vem antes da primeira vírgula
                    : "---"}
                  {client.phone?.includes(",") && (
                    <span className="ml-2 text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                      +{client.phone.split(",").length - 1}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {client.email
                    ? client.email.split(",")[0] // Pega apenas o que vem antes da primeira vírgula
                    : "---"}
                  {client.email?.includes(",") && (
                    <span className="ml-2 text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                      +{client.email.split(",").length - 1}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="p-2 bg-slate-800/50 text-slate-400 rounded-lg hover:text-blue-500 cursor-pointer hover:bg-blue-500/10 transition-all"
                    >
                      <PencilIcon size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setClientToDelete({ id: client.id, name: client.name })
                      }
                      className="p-2 bg-slate-800/50 text-slate-400 rounded-lg hover:text-red-500 cursor-pointer hover:bg-red-500/10 transition-all"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginação */}
        <div className="flex justify-between items-center px-6 py-4 bg-slate-900/50 border-t border-slate-800">
          <span className="text-xs text-slate-500">
            Página {currentPage} de {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal para Adicionar Novo Cliente */}
      {isModalOpen && (
        <ClientModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            loadClients();
          }}
        />
      )}

      {/* Modal para Editar / Ver Detalhes (Múltiplos telefones/emails) */}
      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onRefresh={loadClients}
        />
      )}

      <ConfirmModal
        isOpen={!!clientToDelete}
        title="Excluir Cliente"
        message={`Tem certeza que deseja remover ${clientToDelete?.name}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
        onConfirm={confirmDelete}
        onClose={() => setClientToDelete(null)}
      />
    </main>
  );
}

// --- SUBCOMPONENTE: MODAL DE CADASTRO SIMPLES ---
function ClientModal({ onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  async function handleSubmit(e: any) {
    e.preventDefault();
    const loading = toast.loading("Salvando novo cliente...");
    try {
      await api.post("/clients", formData);
      toast.success("Cliente cadastrado!", { id: loading });
      onSuccess();
    } catch (error) {
      toast.error("Erro ao cadastrar cliente.", { id: loading });
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-100">Novo Cliente</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-100"
          >
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Nome da Empresa / Cliente
            </label>
            <input
              required
              className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-500 outline-none text-slate-100"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                Telefone
              </label>
              <input
                className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-500 outline-none text-slate-100"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-500 outline-none text-slate-100"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800/40 text-slate-300 rounded-xl hover:bg-slate-800 transition font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <Save size={18} /> Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
