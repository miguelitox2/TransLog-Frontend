import { useEffect, useState } from "react";
import { getUsers, getBranches, registerUser } from "../services/api";
import { UserPlus, Settings as SettingsIcon, X, Save } from "lucide-react";
import toast from "react-hot-toast";

// --- COMPONENTE DO MODAL (ESTILIZADO SEGUNDO O PRINT) ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: any[];
  onSuccess: () => void;
}

function UserModal({ isOpen, onClose, branches, onSuccess }: ModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    branchId: "",
  });

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await registerUser(formData);
      onSuccess();
      onClose();
      toast.success("Usuário cadastrado com sucesso!");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "USER",
        branchId: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro ao cadastrar");
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-950/50 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header no tom escuro do print */}
        <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
              <UserPlus size={20} />
            </div>
            Novo Usuário
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-100 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-slate-300">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Nome Completo
            </label>
            <input
              required
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-slate-100"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              E-mail
            </label>
            <input
              required
              type="email"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-500 outline-none text-slate-100"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Senha Provisória
            </label>
            <input
              required
              type="password"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-500 outline-none text-slate-100"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Cargo
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none cursor-pointer text-slate-100"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="DEV">Desenvolvedor</option>
                <option value="DIRECTOR">Gestor</option>
                <option value="MANAGER">Gerente</option>
                <option value="USER">Pesquisa</option>
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
                  Unidade
                </label>
                <div className="relative">
                  <select
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none cursor-pointer text-slate-100 focus:border-blue-500 appearance-none transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, branchId: e.target.value })
                    }
                    value={formData.branchId}
                  >
                    <option value="" className="bg-[#0b0f1a]">
                      Selecione...
                    </option>
                    {branches && branches.length > 0 ? (
                      branches.map((b: any) => (
                        <option
                          key={b.id}
                          value={b.id}
                          className="bg-[#0b0f1a]"
                        >
                          {b.name}
                        </option>
                      ))
                    ) : (
                      <option disabled className="bg-[#0b0f1a]">
                        Carregando unidades...
                      </option>
                    )}
                  </select>
                  {/* Seta do select personalizada para o tema dark */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 cursor-pointer py-2 bg-slate-800/40 text-slate-300 rounded-xl hover:bg-slate-800 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 cursor-pointer bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 font-bold transition shadow-lg shadow-blue-600/20"
            >
              <Save size={18} /> Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL SETTINGS ---
export function Settings() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [usersRes, branchesRes] = await Promise.all([
        getUsers(),
        getBranches(),
      ]);
      console.log("Unidades carregadas:", branchesRes.data);
      setUsers(usersRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  }

  return (
    <div className="px-6 py-6 min-h-screen text-slate-100">
      <div className="flex justify-between items-center mb-7">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600/20 rounded-xl text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-500/10">
            <SettingsIcon size={18} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Configurações
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Gerencie o acesso e unidades da Rodonaves
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600/60 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-blue-600/20"
        >
          <UserPlus size={18} /> Novo Usuário
        </button>
      </div>
      <div className="border w-full border-slate-700 mb-6"></div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-slate-800/50">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-6 py-5 text-left text-[12px] font-black text-slate-50 uppercase tracking-[0.2em]">
                Usuário
              </th>
              <th className="px-6 py-5 text-left text-[12px] font-black text-slate-50 uppercase tracking-[0.2em]">
                E-mail
              </th>
              <th className="px-6 py-5 text-left text-[12px] font-black text-slate-50 uppercase tracking-[0.2em]">
                Cargo
              </th>
              <th className="px-6 py-5 text-left text-[12px] font-black text-slate-50 uppercase tracking-[0.2em]">
                Unidade
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {users.map((user: any) => (
              <tr
                key={user.id}
                className="hover:bg-blue-600/[0.02] transition-colors group"
              >
                <td className="px-6 py-5 text-sm font-bold text-slate-100">
                  {user.name}
                </td>
                <td className="px-6 py-5 text-sm text-slate-400 font-medium">
                  {user.email}
                </td>
                <td className="px-6 py-5 text-sm">
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight border ${
                      user.role === "DEV"
                        ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                        : "bg-slate-800/50 text-slate-400 border-slate-700/50"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400">
                  <div className="flex items-center gap-2 font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                    {user.branch?.name || "Global"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        branches={branches}
        onSuccess={loadData}
      />
    </div>
  );
}
