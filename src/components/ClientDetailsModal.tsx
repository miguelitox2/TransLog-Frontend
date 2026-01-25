import { useState } from "react";
import {
  X,
  Trash2,
  Save,
  Phone,
  Mail,
  User,
  Copy,
  MessageCircle,
} from "lucide-react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { ConfirmModal } from "./ConfirmModal";

interface ClientDetailsModalProps {
  client: any;
  onClose: () => void;
  onRefresh: () => void;
}

export function ClientDetailsModal({
  client,
  onClose,
  onRefresh,
}: ClientDetailsModalProps) {
  const [name, setName] = useState(client.name);
  const [phones, setPhones] = useState<string[]>(
    client.phone ? client.phone.split(", ") : [""],
  );
  const [emails, setEmails] = useState<string[]>(
    client.email ? client.email.split(", ") : [""],
  );
  const [phoneToWhatsApp, setPhoneToWhatsApp] = useState<string | null>(null);

  const addField = (setter: any, values: string[]) => setter([...values, ""]);

  const removeField = (index: number, setter: any, values: string[]) => {
    const updated = values.filter((_, i) => i !== index);
    setter(updated.length ? updated : [""]);
  };

  const updateValue = (
    index: number,
    value: string,
    setter: any,
    values: string[],
  ) => {
    const updated = [...values];
    updated[index] = value;
    setter(updated);
  };

  const handleCopy = (text: string) => {
    if (!text || text === "") return;

    // Remove formatação se quiser copiar apenas os números ou mantém como está
    navigator.clipboard.writeText(text);

    toast.success("Copiado para a área de transferência!", {
      icon: "📋",
      duration: 2000,
    });
  };

  const formatPhone = (value: string) => {
    if (!value) return "";
    const numbers = value.replace(/\D/g, ""); // Remove tudo que não é número

    if (numbers.length <= 10) {
      // Formato (00) 0000-0000
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    // Formato (00) 00000-0000
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const handleWhatsAppRedirect = (phone: string) => {
    const cleanNumber = phone.replace(/\D/g, ""); // Remove tudo que não é número
    // Adiciona o DDI 55 se o usuário não tiver colocado
    const formattedNumber =
      cleanNumber.length <= 11 ? `55${cleanNumber}` : cleanNumber;

    window.open(`https://wa.me/${formattedNumber}`, "_blank");
  };

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    const loading = toast.loading("Sincronizando com Rodonaves...");

    try {
      const phoneString = phones.filter((p) => p.trim() !== "").join(", ");
      const emailString = emails.filter((em) => em.trim() !== "").join(", ");

      await api.put(`/clients/${client.id}`, {
        name,
        phone: phoneString,
        email: emailString,
      });

      toast.success("Cadastro atualizado com sucesso!", { id: loading });
      onRefresh();
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar cadastro.", { id: loading });
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0b0f1a] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <User className="text-blue-500" size={20} /> Detalhes do Cliente
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleUpdate}
          className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar"
        >
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Nome / Razão Social
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-600 outline-none text-slate-200"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Phone size={12} /> Telefones de Contato
              </label>
              <button
                type="button"
                onClick={() => addField(setPhones, phones)}
                className="text-blue-500 hover:text-blue-400 text-[10px] font-bold cursor-pointer"
              >
                + ADICIONAR
              </button>
            </div>
            {phones.map((phone, index) => (
              <div
                key={index}
                className="flex gap-2 animate-in fade-in slide-in-from-top-1 w-full"
              >
                <div className="relative flex-1 group">
                  <input
                    value={phone}
                    onChange={(e) =>
                      updateValue(
                        index,
                        formatPhone(e.target.value),
                        setPhones,
                        phones,
                      )
                    }
                    className="w-full pl-4 pr-16 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 outline-none focus:border-blue-600 transition-all"
                  />

                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    {/* BOTÃO WHATSAPP */}
                    <button
                      type="button"
                      onClick={() => setPhoneToWhatsApp(phone)}
                      className="p-1.5 text-slate-500 hover:text-green-500 hover:bg-green-500/10 rounded-md cursor-pointer"
                      title="Abrir no WhatsApp"
                    >
                      <MessageCircle size={14} />{" "}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(phone)}
                      className="p-1.5 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-md cursor-pointer"
                      title="Copiar número"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeField(index, setPhones, phones)}
                  className="p-2 text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Mail size={12} /> Listagem de E-mails
              </label>
              <button
                type="button"
                onClick={() => addField(setEmails, emails)}
                className="text-blue-500 hover:text-blue-400 text-[10px] font-bold cursor-pointer"
              >
                + ADICIONAR
              </button>
            </div>
            {emails.map((email, index) => (
              <div
                key={index}
                className="flex gap-2 animate-in fade-in slide-in-from-top-1"
              >
                <div className="relative group w-full">
                  <input
                    value={email}
                    onChange={(e) =>
                      updateValue(index, e.target.value, setEmails, emails)
                    }
                    placeholder="contato@empresa.com"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 outline-none focus:border-slate-500 hover:text-blue-300 "
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(email)}
                    className=" absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-all opacity-0 cursor-pointer group-hover:opacity-100 focus:opacity-100"
                    title="Copiar número"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeField(index, setEmails, emails)}
                  className="p-2 text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-slate-400 font-bold text-sm hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              <Save size={18} /> Salvar Alterações
            </button>
          </div>
        </form>
      </div>
      <ConfirmModal
        isOpen={!!phoneToWhatsApp}
        title="Abrir WhatsApp"
        message={`Deseja iniciar uma conversa com o número ${phoneToWhatsApp}?`}
        confirmText="Abrir Chat"
        // Adicione a verificação e o operador '!' para o TypeScript entender que não será null aqui
        onConfirm={() => {
          if (phoneToWhatsApp) {
            handleWhatsAppRedirect(phoneToWhatsApp!);
          }
        }}
        onClose={() => setPhoneToWhatsApp(null)}
      />
    </div>
  );
}
