import logosidebar from "../../src/assets/Logo.svg";
import { useState } from "react";
import { Links } from "./Links";
import { useAuth } from "./AuthContext";
import {
  ChevronRight,
  LogOut,
  PlusCircle,
  Settings2,
  BarChart3,
  FileText,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";

// Itens base que todos podem ver
const menuItems = [
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    href: "/register-cte",
    title: "Registrar Ocorrência",
    icon: <PlusCircle size={18} />,
  },
  { href: "/list-ctes", title: "Listar CTEs", icon: <FileText size={18} /> },
  {
    href: "/list-clients",
    title: "Listar Clientes",
    icon: <Users size={18} />,
  },
  { href: "/financial", title: "Relatórios", icon: <BarChart3 size={18} /> },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { user, signOut } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const userAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`;

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <div className="flex text-white bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950">
      <div
        className={`h-screen flex flex-col px-4 pt-4 transition-all duration-300 ${isOpen ? "w-54" : "w-22"}`}
      >
        {/* Logo / Botão */}
        <div className="flex py-1.5 gap-4 items-center ml-2">
          <img src={logosidebar} alt="logo" className="size-10" />
          <div className="flex flex-col">
            <span
              className={`font-bold text-xl transition-all duration-300 ${isOpen ? "opacity-100 scale-100" : "opacity-0 overflow-hidden scale-0"}`}
            >
              TransLog
            </span>
            <span
              className={`font-extralight text-sm transition-all duration-300 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0 overflow-hidden"}`}
            >
              Gestão CTE
            </span>
          </div>
        </div>

        {/* Botão de Toggle */}
        <div className="w-full flex items-center relative py-4 ">
          <div className="border w-full border-slate-700/50 absolute"></div>
          <div
            className={`flex items-center transition-all duration-300 ${isOpen ? "translate-x-48" : "translate-x-16"}`}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white rounded shadow-md hover:shadow-lg"
            >
              <ChevronRight
                className={`text-blue-600 transition-transform duration-300 size-4.5 ${isOpen ? "rotate-0" : "rotate-180"}`}
              />
            </button>
          </div>
        </div>

        {/* Menu */}
        <span
          className={`text-zinc-100 w-full transition-all duration-300 text-sm ${isOpen ? "opacity-100" : "overflow-hidden ml-2"}`}
        >
          Menu
        </span>

        <div className="flex flex-col justify-between flex-1">
          <nav className="flex flex-col items-start gap-2 w-full mt-4">
            {/* Mapeia os itens comuns */}
            {menuItems.map((item) => (
              <Links
                key={item.href}
                href={item.href}
                title={item.title}
                icon={item.icon}
                isOpen={isOpen}
              />
            ))}

            {/* ITEM CONDICIONAL: Só aparece para o DEV */}
            {user?.role === "DEV" && (
              <Links
                href="/settings"
                title="Configurações"
                icon={<Settings2 size={18} />}
                isOpen={isOpen}
              />
            )}
          </nav>

          <div className="flex flex-col items-center w-full">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-slate-900 rounded-lg px-4 py-2 text-sm w-full cursor-pointer hover:bg-slate-700/60 hover:text-rose-600 transition-all duration-200"
            >
              <LogOut className="size-5" />
              <span
                className={`whitespace-nowrap transition-all duration-300 font-light ${!isOpen && "hidden"}`}
              >
                Sair
              </span>
            </button>

            <div className="border w-full border-blue-300/50 my-4"></div>

            {/* Avatar e Infos do Usuário */}
            <div className="w-full mb-4">
              <div className="flex items-center justify-center py-3 px-2 bg-slate-900 rounded-lg">
                <img
                  src={userAvatar}
                  alt="avatar"
                  className="size-8 rounded-full object-cover border border-slate-700"
                />
                <div
                  className={`flex flex-col transition-all duration-300 ${isOpen ? "opacity-100 ml-2" : "opacity-0 w-0 overflow-hidden"}`}
                >
                  <span className="text-xs font-bold text-start whitespace-nowrap">
                    {user?.name || "Usuário"}
                  </span>
                  <span className="text-[10px] rounded-sm text-slate-400 text-start whitespace-nowrap uppercase tracking-wider">
                    {user?.role || "Operador"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Encerrar Sessão"
        message={`Olá ${user?.name}, deseja realmente sair do sistema TransLog?`}
        confirmText="Sair Agora"
        variant="danger" // Mantemos o padrão de atenção para logout
        onConfirm={signOut} // Função vinda do seu AuthContext
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}
