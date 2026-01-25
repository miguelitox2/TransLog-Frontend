export const badgeColorsByStatus: Record<string, string> = {
  Pendente: "bg-blue-600/20 text-blue-400 border border-blue-600/30",
  Finalizado: "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30",
  Total: "bg-slate-900 border border-slate-700/60 text-slate-300",
};

export const badgeColorsByPriority: Record<string, string> = {
  Avaria: "bg-orange-600/20 text-orange-400 border border-orange-600/30",
  Extravio: "bg-red-600/20 text-red-400 border border-red-600/30",
  Indenização: "bg-purple-600/20 text-purple-400 border border-purple-600/30",
  Ausente: "bg-slate-800 border border-slate-700/60 text-slate-300",
  // Se você ainda usa Urgente/Alta, mantenha-os:
  Urgente: "bg-red-600/20 text-red-400 border border-red-600/30",
};