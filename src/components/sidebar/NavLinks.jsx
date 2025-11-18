import { Link } from "react-router-dom";
import { Home, Library, Wallet, Settings, ChevronRight } from "lucide-react";

const links = [
  { to: "/", Icon: Home, label: "Home" },
  { to: "/library", Icon: Library, label: "Library" },
  { to: "/wallet", Icon: Wallet, label: "Wallet" },
  { to: "/settings", Icon: Settings, label: "Settings" },
];

export default function NavLinks({ isActive, collapsed, onNav }) {
  return (
    <nav className="flex-1 px-6 py-8 space-y-3">
      {links.map(({ to, Icon, label }) => {
        const active = isActive(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNav}
            className={`group relative flex items-center gap-5 rounded-2xl px-5 py-4 text-lg font-medium transition-all
              ${active ? "bg-gradient-to-r from-purple-600/40 to-pink-600/40 text-white shadow-lg" : "text-gray-400 hover:bg-white/5 hover:text-white"}
            `}
          >
            <Icon size={26} strokeWidth={2.2} />
            <span className={`transition-opacity ${collapsed ? "opacity-0" : ""}`}>{label}</span>
            {active && <div className="absolute right-0 w-1 h-12 bg-gradient-to-b from-purple-400 to-pink-400 rounded-l-full" />}
            {collapsed && (
              <div className="absolute left-full ml-3 whitespace-nowrap rounded-lg bg-gray-900/95 px-4 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                {label}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}