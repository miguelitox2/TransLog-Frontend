import {
  X,
  Calendar,
  House,
  Tag,
  FileText,
  DollarSign,
  Hash,
  Factory,
  ShieldX,
  Edit3,
  Save,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { CteData } from "../../types/cte";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { badgeColorsByPriority } from "../../utils/BadgeColorStats";
import toast from "react-hot-toast";

interface CteModalProps {
  cte: CteData | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function CteModal({ cte, onClose, onUpdate }: CteModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<CteData>>({});

  useEffect(() => {
    if (cte) {
      setEditData(cte);
      setIsEditing(false);
    }
  }, [cte]);

  // Se não houver CTE, o componente não renderiza nada,
  // mas as referências acima precisam de proteção opcional (?.)
  if (!cte) return null;

  const handleFinalize = async () => {
    try {
      const response = await api.put(`/ctes/${cte.id}`, {
        ...editData,
        status: "Finalizado",
      });

      if (response.status === 200) {
        setEditData((prev) => ({ ...prev, status: "Finalizado" }));
        if (onUpdate) await onUpdate();
        toast.success("Chamado finalizado com sucesso!");
      }
    } catch (error) {
      toast.error("Não foi possível finalizar o chamado.");
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...editData,
        ro: editData.ro ? Number(editData.ro) : undefined,
        value: editData.value ? Number(editData.value) : 0,
        cause: editData.cause,
      };

      const response = await api.put(`/ctes/${cte.id}`, payload);

      if (response.status === 200) {
        setEditData(payload);
        setIsEditing(false);
        if (onUpdate) await onUpdate();
        toast.success("Alterações aplicadas com sucesso!");
      }
    } catch (error: any) {
      toast.error("Erro ao salvar as alterações.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-950 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2 rounded-lg text-blue-400">
              <Hash size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase">
                {cte?.numberCte}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? "Editando Informações" : "Detalhes da Ocorrência"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full ml-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-2 gap-12">
          <section className="space-y-6">
            <div className="flex items-start gap-3">
              <Calendar className="text-slate-500 mt-1" size={18} />
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                  Abertura
                </p>
                <p className="text-slate-200">
                  {cte?.createdAt
                    ? new Date(cte.createdAt).toLocaleDateString("pt-BR")
                    : ""}{" "}
                  {cte?.createdAt
                    ? new Date(cte.createdAt).toLocaleTimeString("pt-BR")
                    : ""}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Factory className="text-slate-500 mt-1" size={18} />
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                  Remetente
                </p>
                <p className="text-slate-200 font-semibold uppercase">
                  {cte?.shipperName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldX className="text-slate-500 mt-1" size={18} />
              <div className="flex-1">
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                  Causador
                </p>
                {isEditing ? (
                  <select
                    value={editData.accountable || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, accountable: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 mt-1 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    <option value="Administrativo">Administrativo</option>
                    <option value="Operacional">Operacional</option>
                  </select>
                ) : (
                  <p className="text-slate-200 font-semibold uppercase">
                    {editData.accountable || "Não informado"}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-start gap-3">
              <Tag className="text-slate-500 mt-1" size={18} />
              <div className="flex-1">
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                  Causa & R.O
                </p>
                <div className="flex flex-col gap-2 mt-1">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <select
                        value={editData.cause || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, cause: e.target.value })
                        }
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
                      >
                        <option value="Avaria">Avaria</option>
                        <option value="Ausente">Ausente</option>
                        <option value="Indenização">Indenização</option>
                        <option value="Extravio">Extravio</option>
                      </select>
                      <input
                        type="text"
                        value={editData.ro || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            ro: Number(e.target.value),
                          })
                        }
                        placeholder="Nº R.O"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeColorsByPriority[editData.cause || ""]}`}
                      >
                        {editData.cause}
                      </span>
                      <span className="text-slate-400 text-xs">
                        #{editData.ro || "N/A"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <House className="text-slate-500 mt-1" size={18} />
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                  Destinatário
                </p>
                <p className="text-slate-200 font-semibold uppercase">
                  {cte?.clientName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="text-slate-500 mt-1" size={18} />
              <div className="flex-1">
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                  Valor de Indenização
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.value || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        value: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 mt-1 text-sm text-green-400 focus:border-blue-500 outline-none font-mono"
                  />
                ) : (
                  <p className="text-green-400 font-mono">
                    {editData.value
                      ? editData.value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "R$ 0,00"}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="p-4 w-full bg-slate-900/50 border-t border-slate-800 ">
          <section className="space-y-4">
            <div className="w-full">
              <div className="flex items-center gap-2">
                <FileText className="text-slate-500" size={18} />
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                  Observações
                </p>
              </div>
              {isEditing ? (
                <textarea
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full bg-slate-950 p-3 rounded-lg border border-slate-700 mt-2 min-h-[100px] text-sm text-slate-300 focus:border-blue-500 outline-none resize-none"
                  placeholder="Descreva os detalhes da ocorrência..."
                />
              ) : (
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-2 min-h-[100px]">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    {editData.description ||
                      "Nenhuma observação registrada para este CTE."}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <Save size={16} /> Salvar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-all"
                  >
                    <RotateCcw size={16} /> Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
                >
                  <Edit3 size={16} /> Editar
                </button>
              )}
              {cte?.status === "Pendente" && !isEditing && (
                <button
                  onClick={handleFinalize}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-green-900/20"
                >
                  <CheckCircle size={18} /> Finalizar Chamado
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
