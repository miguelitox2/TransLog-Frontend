import { NavLink } from "react-router-dom";

interface LinksProps {
  href: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
}

export function Links({ href, title, icon, isOpen }: LinksProps) {
  return (
    <NavLink
      to={href}
      className={({
        isActive,
      }) => `flex text-sm items-center rounded transition-all gap-1 py-1 px-4 
        ${
          isActive
            ? "bg-slate-50 text-slate-900"
            : "hover:bg-slate-700/60"
        }
        w-full overflow-hidden`}
    >
      <span className="min-w-[24px] flex items-center">{icon}</span>
      <span
        className={`whitespace-nowrap transition-all duration-300 font-light origin-left
          ${isOpen ? "scale-100" : "scale-0"}
        `}
      >
        {title}
      </span>
    </NavLink>
  );
}
