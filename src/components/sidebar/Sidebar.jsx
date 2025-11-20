import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LazyStore } from "@tauri-apps/plugin-store";

const settingsStore = new LazyStore("settings.json");

export default function Sidebar({ darkMode, setDarkMode, user, login, logout }) {
  const { pathname } = useLocation();

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  const [profile, setProfile] = useState({
    username: "Player One",
    bio: "🏆 Achievement Hunter",
  });

  const links = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Library", path: "/library", icon: "📚" },
    { name: "Wallet", path: "/wallet", icon: "💰" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  // Responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load darkMode + profile
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedDarkMode = await settingsStore.get("darkMode");
        if (typeof savedDarkMode === "boolean") {
          setDarkMode(savedDarkMode);
        }

        const savedProfile = await settingsStore.get("profile");
        if (savedProfile && typeof savedProfile === "object") {
          setProfile((prev) => ({ ...prev, ...savedProfile }));
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    loadSettings();
  }, [setDarkMode]);

  // Save dark mode
  useEffect(() => {
    const saveDarkMode = async () => {
      try {
        await settingsStore.set("darkMode", darkMode);
        await settingsStore.save();
      } catch (err) {
        console.error("Failed to save darkMode:", err);
      }
    };
    saveDarkMode();
  }, [darkMode]);

  // Save profile
  useEffect(() => {
    const saveProfile = async () => {
      try {
        await settingsStore.set("profile", profile);
        await settingsStore.save();
      } catch (err) {
        console.error("Failed to save profile:", err);
      }
    };
    saveProfile();
  }, [profile]);

  const handleDarkToggle = () => setDarkMode((prev) => !prev);

  return (
    <>
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="fixed left-4 top-4 z-[1000] rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 px-3 py-2 text-xl text-white shadow-lg"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Sidebar */}
      <aside
        data-tauri-drag-region
        className={[
          "flex h-screen flex-col bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e]",
          "border-r border-purple-500/10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]",
          "px-6 py-8 transition-all duration-300",
          isMobile
            ? `fixed top-0 z-[999] w-64 ${
                isMobileMenuOpen ? "left-0" : "-left-64"
              }`
            : "relative w-64",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="mb-10 text-center">
          <h1 className="bg-gradient-to-tr from-purple-500 to-pink-500 bg-clip-text text-2xl font-extrabold tracking-wide text-transparent">
            JUXCTION
          </h1>
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-gray-500">
            Gaming Hub
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
                className={[
                  "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-tr from-purple-500/20 to-pink-500/10 text-white border border-purple-500/30"
                    : "text-gray-400 hover:bg-purple-500/5 hover:text-gray-100",
                ].join(" ")}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.name}</span>

                {isActive && (
                  <span className="absolute right-0 top-1/2 h-3/5 w-[3px] -translate-y-1/2 rounded-l bg-gradient-to-b from-purple-500 to-pink-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER SECTION */}
        <div className="mt-auto border-t border-white/5 pt-4">
          <DarkModeToggle darkMode={darkMode} onToggle={handleDarkToggle} />

          {/* ACCOUNT SECTION (Google login / profile) */}
          <div className="mt-3">
            {user ? (
              <div className="p-3 rounded-xl bg-[#29223e] border border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={user.user_metadata.picture}
                    className="w-10 h-10 rounded-full border border-purple-500/40"
                  />
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {user.user_metadata.name}
                    </p>
                    <p className="text-purple-300 text-xs">Online</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="w-full mt-3 bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs py-1.5 rounded-lg hover:bg-purple-600/30 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="w-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white p-3 rounded-xl font-semibold hover:scale-[1.02] transition shadow-md"
              >
                Login with Google
              </button>
            )}
          </div>
        </div>

        {/* PROFILE MODAL */}
        {isProfileModalOpen && (
          <EditProfileModal
            profile={profile}
            onClose={() => setIsProfileModalOpen(false)}
            onChange={setProfile}
          />
        )}
      </aside>

      {/* Mobile overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

/* ---------- Subcomponents ---------- */

function DarkModeToggle({ darkMode, onToggle }) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-xl bg-purple-500/5 px-3 py-2.5">
      <span className="text-xs font-semibold text-gray-300">🌙 Dark Mode</span>
      <button
        onClick={onToggle}
        className={[
          "relative inline-flex h-[28px] w-[52px] items-center rounded-full border border-white/10 px-[3px] transition",
          darkMode
            ? "bg-gradient-to-r from-purple-500 to-pink-500"
            : "bg-white/5",
        ].join(" ")}
      >
        <span
          className={[
            "h-[20px] w-[20px] rounded-full bg-white shadow transition-transform",
            darkMode ? "translate-x-[22px]" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
