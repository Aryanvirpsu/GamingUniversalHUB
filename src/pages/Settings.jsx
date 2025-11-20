import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function Settings({ darkMode, setDarkMode, user, login, logout }) {
  const [compact, setCompact] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [steamLinked, setSteamLinked] = useState(null);

  useEffect(() => {
    async function loadSteam() {
      if (!user) return;

      const { getMyLinkedAccounts } = await import("../lib/accounts");
      const accounts = await getMyLinkedAccounts(user.id);

      const steam = accounts.find(a => a.provider === "steam");
      setSteamLinked(steam || null);
    }

    loadSteam();
  }, [user]);

  return (
    <div className="mx-auto max-w-4xl w-full space-y-8">

      {/* 🔥 ACCOUNT SECTION */}
      <section className="p-6 rounded-2xl bg-slate-900/70 border border-white/5">
        <h2 className="text-white text-lg font-semibold mb-4">👤 Account</h2>

        {user ? (
          <>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={user.user_metadata.picture}
                className="w-14 h-14 rounded-full border border-purple-500/40"
              />
              <div>
                <p className="text-white font-semibold text-lg">
                  {user.user_metadata.name}
                </p>
                <p className="text-slate-400 text-sm">{user.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full bg-red-500/20 border border-red-500/40 text-red-300 py-2 rounded-lg hover:bg-red-500/30 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={login}
            className="w-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Login with Google
          </button>
        )}
      </section>

      {/* 🎮 STEAM LINKING */}
      {user && (
  <section className="p-6 rounded-2xl bg-slate-900/70 border border-white/5">
    <h2 className="text-white text-lg font-semibold mb-4">🎮 Steam Integration</h2>

    {steamLinked ? (
      <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/40 mb-4">
        <p className="text-green-400 text-sm">
          ✔ Steam Linked: {steamLinked.provider_user_id}
        </p>
      </div>
    ) : (
      <p className="text-slate-400 text-sm mb-3">
        Auto-detect your Steam ID and link it to your cloud profile.
      </p>
    )}

    <button
      onClick={async () => {
        try {
          const steamId = await invoke("get_steam_id");

          if (!steamId || steamId === "") {
            alert("Steam ID not found.");
            return;
          }

          const { linkSteamForCurrentUser } = await import("../lib/accounts");
          const response = await linkSteamForCurrentUser(steamId);

          console.log("Link response:", response);

          setSteamLinked({ provider_user_id: steamId });

          alert("🟢 Steam linked: " + steamId);

        } catch (err) {
          console.error("❌ Steam Link Error:", err);
          alert("❌ Steam Link Error:\n" + JSON.stringify(err, null, 2));
        }
      }}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
    >
      {steamLinked ? "Update Steam ID" : "Detect & Link Steam ID"}
    </button>
  </section>
)}


      {/* 🎨 Appearance */}
      <section className="p-6 rounded-2xl bg-slate-900/70 border border-white/5">
        <h2 className="text-white text-lg font-semibold mb-4">🎨 Appearance</h2>

        <div className="flex justify-between items-center bg-purple-500/5 p-3 rounded-xl">
          <span className="text-slate-300 text-sm">Compact Mode</span>
          <input
            type="checkbox"
            checked={compact}
            onChange={() => setCompact(!compact)}
          />
        </div>
      </section>

      {/* 🔔 Notifications */}
      <section className="p-6 rounded-2xl bg-slate-900/70 border border-white/5">
        <h2 className="text-white text-lg font-semibold mb-4">🔔 Notifications</h2>

        <div className="flex justify-between items-center bg-purple-500/5 p-3 rounded-xl">
          <span className="text-slate-300 text-sm">Enable Alerts</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>
      </section>
    </div>
  );
}
