import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LazyStore } from "@tauri-apps/plugin-store";

const settingsStore = new LazyStore("settings.json");

export default function Sidebar({ darkMode, setDarkMode }) {
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

  // Load darkMode + profile from Tauri Store
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
        console.error("Failed to load settings from store:", err);
      }
    };
    loadSettings();
  }, [setDarkMode]);

  // Persist darkMode
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

  // Persist profile
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
      {/* Mobile toggle */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="fixed left-4 top-4 z-[1000] rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 px-3 py-2 text-xl text-white shadow-lg transition-transform hover:scale-105"
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

        {/* Nav */}
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
                  "border border-transparent",
                  isActive
                    ? "border-purple-500/40 bg-gradient-to-tr from-purple-500/20 to-pink-500/10 text-white"
                    : "text-gray-400 hover:translate-x-1 hover:bg-purple-500/5 hover:text-gray-100",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-xl transition",
                    isActive ? "grayscale-0" : "grayscale",
                  ].join(" ")}
                >
                  {link.icon}
                </span>
                <span>{link.name}</span>

                {isActive && (
                  <span className="absolute right-0 top-1/2 h-3/5 w-[3px] -translate-y-1/2 rounded-l bg-gradient-to-b from-purple-500 to-pink-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-white/5 pt-4">
          <DarkModeToggle darkMode={darkMode} onToggle={handleDarkToggle} />

          <div
            className="group relative mt-3 flex cursor-pointer items-center gap-3 rounded-2xl bg-[#29223e] px-6 py-3.5 transition-shadow hover:shadow-[0_4px_32px_#836fff66]"
            onClick={() => setIsProfileModalOpen(true)}
            onMouseEnter={() => setIsProfileHovered(true)}
            onMouseLeave={() => setIsProfileHovered(false)}
          >
            <div className="text-3xl">🎮</div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">
                {profile.username}
              </div>
              <div className="text-[0.75rem] text-purple-200">Level 42</div>
            </div>

            {/* Hover popup (desktop only) */}
            {isProfileHovered && !isMobile && (
              <ProfilePopup username={profile.username} />
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
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
        type="button"
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

function ProfilePopup({ username }) {
  return (
    <div className="absolute bottom-20 left-full z-[1000] ml-4 w-72 rounded-3xl bg-[#29223e] p-6 text-white shadow-[0_12px_32px_#836fff66]">
      <div className="mb-4 flex items-center">
        <span className="mr-4 text-5xl">🎮</span>
        <div>
          <div className="text-lg font-bold">{username}</div>
          <div className="text-sm text-purple-200">Level 42 → Level 43</div>
        </div>
      </div>

      <div className="mb-1 text-[0.7rem] text-gray-300">XP Progress</div>
      <div className="mb-4 h-[18px] overflow-hidden rounded-xl bg-[#453a66] shadow-inner">
        <div className="flex h-full w-[88.75%] items-center justify-end rounded-xl bg-gradient-to-r from-[#b15cff] to-[#786cff] pr-3 text-[0.8rem] font-bold shadow-[0_0_3px_#b15cff,0_0_12px_#b15cff22]">
          88.75%
        </div>
      </div>

      <div className="flex gap-9 text-sm">
        <div>
          <div className="text-xl font-bold">124</div>
          <div className="text-xs text-gray-200">Games</div>
        </div>
        <div>
          <div className="text-xl font-bold">89</div>
          <div className="text-xs text-gray-200">Trophies</div>
        </div>
      </div>
    </div>
  );
}

function EditProfileModal({ profile, onClose, onChange }) {
  const handleSave = () => {
    alert(
      `Profile updated!\nUsername: ${profile.username}\nBio: ${profile.bio}`
    );
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-md"
      />
      <div className="fixed left-1/2 top-1/2 z-[9999] w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-purple-500/40 bg-gradient-to-tr from-[#1a1a2e] to-[#0f0f1e] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">✏️ Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-4xl shadow-[0_8px_24px_rgba(168,85,247,0.4)]">
            🎮
          </div>
          <button className="rounded-md border border-purple-500/50 bg-purple-500/20 px-3 py-1.5 text-xs font-semibold text-purple-300 transition hover:border-purple-400 hover:bg-purple-500/30">
            Change Avatar
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold text-gray-300">
            Username
          </label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, username: e.target.value }))
            }
            className="w-full rounded-lg border border-purple-500/40 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-purple-400"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-xs font-semibold text-gray-300">
            Bio
          </label>
          <textarea
            rows={3}
            value={profile.bio}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="w-full rounded-lg border border-purple-500/40 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-purple-400"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_24px_rgba(168,85,247,0.4)] transition-transform hover:scale-[1.02]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
