import { useEffect, useState } from "react";
import { scanSteamGames } from "../utils/steam";
import { invoke } from "@tauri-apps/api/core";

export default function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const launchGame = async (id) => {
    try {
      await invoke("launch_game", { appId: id });
    } catch (e) {
      console.error("Failed to launch:", e);
    }
  };

  useEffect(() => {
    (async () => {
      const result = await scanSteamGames();
      setGames(result);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl text-slate-300 text-lg">
        Scanning Steam library...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl w-full">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent mb-8">
        Your Steam Library
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.filter((g) => g.app_id !== "228980")   // 👈 hide Steamworks
        .map((g) => {

          const coverUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${g.app_id}/library_600x900.jpg`;

          return (
            <div
              key={g.app_id}
              className="bg-slate-900/70 border border-white/5 rounded-2xl p-3 hover:border-purple-400/40 hover:-translate-y-1 transition cursor-pointer shadow-lg"
            >
              <img
                src={coverUrl}
                onError={(e) => (e.target.src = "/placeholder_game.png")}
                className="rounded-xl mb-3 w-full h-48 object-cover"
              />

              <h2 className="text-white font-semibold text-sm mb-2">
                {g.name}
              </h2>
              {g.installed ? (
              <span className="text-green-400 text-xs font-medium">Installed</span>
              ) : (
              <span className="text-red-400 text-xs font-medium">Not Installed</span>
            )}

              <button
                onClick={() => launchGame(g.app_id)}
                className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-lg text-sm font-semibold transition"
              >
                ▶ Play
              </button>
              

            </div>
          );
        })}
      </div>
    </div>
  );
}
