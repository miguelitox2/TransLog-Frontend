import logosidebar from "../../src/assets/Logo.svg";
import { useState } from "react";
import { Links } from "./Links";
import { useAuth } from "./AuthContext";
import {
  ChevronLeft,
  LogOut,
  PlusCircle,
  Settings2,
  BarChart3,
  FileText,
  Users,
  LayoutDashboard,
  Box,
  Menu,
  X,
} from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";

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
  { href: "/stock", title: "Estoque", icon: <Box size={18} /> },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const userAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`;

  return (
    <>
      {/* BOTÃO MOBILE - Fica fixo apenas em telas pequenas */}
      <div className="lg:hidden fixed top-4 right-4 z-[60]">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* OVERLAY MOBILE */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR ESTRUTURA */}
      <aside
        className={`
          /* Comportamento Mobile */
          fixed inset-y-0 left-0 z-[80] transition-all duration-300
          ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full"}
          
          /* Comportamento Desktop - Volta a ser relativa e respeitar o seu isOpen */
          lg:relative lg:translate-x-0 lg:z-10
          ${isOpen ? "lg:w-64" : "lg:w-22"}
          
          bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 flex flex-col text-white
        `}
      >
        <div className="h-screen flex flex-col px-4 pt-4 sticky top-0">
          {/* Logo e Fechar Mobile */}
          <div className="flex py-1.5 gap-4 items-center ml-2 justify-between">
            <div className="flex items-center gap-4">
              <img src={logosidebar} alt="logo" className="size-10" />
              {(isOpen || isMobileOpen) && (
                <div className="flex flex-col whitespace-nowrap">
                  <span className="font-bold text-xl">TransLog</span>
                  <span className="font-extralight text-sm">Gestão CTE</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Botão de Toggle - Visível apenas no Desktop */}
          <div className="hidden lg:flex w-full items-center relative py-4">
            <div className="border w-full border-slate-700/50 absolute"></div>
            <div
              className={`flex items-center transition-all duration-300 ${isOpen ? "translate-x-48" : "translate-x-12"}`}
            >
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white rounded shadow-md hover:scale-110 transition-transform p-0.5"
              >
                <ChevronLeft
                  className={`text-blue-600 size-4 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}
                />
              </button>
            </div>
          </div>

          <span
            className={`text-zinc-100 text-sm mt-4 ${isOpen || isMobileOpen ? "opacity-100" : "opacity-0 overflow-hidden"}`}
          >
            Menu
          </span>

          <nav className="flex flex-col items-start gap-2 w-full mt-4 flex-1">
            {menuItems.map((item) => (
              <Links
                key={item.href}
                href={item.href}
                title={item.title}
                icon={item.icon}
                isOpen={isOpen || isMobileOpen}
              />
            ))}

            {user?.role === "DEV" && (
              <Links
                href="/settings"
                title="Configurações"
                icon={<Settings2 size={18} />}
                isOpen={isOpen || isMobileOpen}
              />
            )}
          </nav>

          {/* Footer Usuário */}
          <div className="flex flex-col items-center w-full pb-6">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-slate-900 rounded-lg px-4 py-2 text-sm w-full cursor-pointer hover:bg-slate-700/60 hover:text-rose-600 transition-all"
            >
              <LogOut className="size-5" />
              {(isOpen || isMobileOpen) && (
                <span className="whitespace-nowrap font-light">Sair</span>
              )}
            </button>

            <div className="border w-full border-blue-300/20 my-4"></div>

            <div
              className={`flex items-center justify-center py-3 px-2 bg-slate-900 rounded-lg w-full`}
            >
              <img
                src={userAvatar}
                alt="avatar"
                className="size-8 rounded-full border border-slate-700"
              />
              {(isOpen || isMobileOpen) && (
                <div className="flex flex-col ml-2 overflow-hidden">
                  <span className="text-xs font-bold truncate">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                    {user?.role}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Encerrar Sessão"
        message={`Olá ${user?.name}, deseja sair do TransLog?`}
        confirmText="Sair Agora"
        variant="danger"
        onConfirm={signOut}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
