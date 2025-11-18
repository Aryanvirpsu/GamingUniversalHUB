import { Menu, X } from "lucide-react";

export default function MobileMenuButton({ isOpen, setIsOpen, isMobile }) {
  if (!isMobile) return null;
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="fixed left-6 top-6 z-[999] rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 p-4 text-white shadow-2xl transition-all hover:scale-110"
    >
      {isOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  );
}