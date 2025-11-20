import { useEffect, useState } from "react";
import { scanSteamGames } from "../utils/steam";
import { invoke } from "@tauri-apps/api/core";

export default function Home({ darkMode, user }) {
  const [games, setGames] = useState([]);
  const playerName = user?.user_metadata?.name || "Player One";

  const launchGame = async (id) => {
    try {
      await invoke("launch_game", { appId: id });
    } catch (e) {
      alert("Couldn't launch the game.");
    }
  };

  useEffect(() => {
    (async () => {
      const result = await scanSteamGames();

      // Filter out redistributables (appid 228980)
      const filtered = result.filter((g) => g.app_id !== "228980");

      // Only show last 6 games for Home page
      setGames(filtered.slice(0, 6));
    })();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">

      {/* Header */}
      <h1 className="text-center text-4xl font-extrabold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent mb-2">
        Ready!, {playerName} 👋
      </h1>
      <p className="text-center text-slate-400 mb-10">
        ungabungahub at your service.
      </p>

      {/* Steam Games */}
      <h2 className="text-center text-xl text-white mb-6">
        Your Steam Games 🎮
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {games.filter((g) => g.app_id !== "228980")   // 👈 hide Steamworks
        .map((g) => {
          const coverUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${g.app_id}/library_600x900.jpg`;

          return (
            <div
              key={g.app_id}
              className="bg-slate-900/70 border border-white/5 rounded-2xl p-4 hover:border-purple-400/40 hover:-translate-y-1 transition cursor-pointer shadow-xl"
            >
              {/* Game Cover */}
              <img
                src={coverUrl}
                onError={(e) => (e.target.src = "/placeholder_game.png")}
                className="rounded-xl mb-4 w-full h-52 object-cover"
                alt={g.name}
              />

              {/* Game Title */}
              <h3 className="text-white font-semibold text-lg mb-1">
                {g.name}
              </h3>

              {/* Installed Status */}
              {g.installed ? (
                <span className="text-green-400 text-sm font-medium">
                  Installed ✓
                </span>
              ) : (
                <span className="text-red-400 text-sm font-medium">
                  Not Installed
                </span>
              )}

              {/* Play Button */}
              {g.installed && (
                <button
                  onClick={() => launchGame(g.app_id)}
                  className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white py-2 rounded-lg text-sm font-semibold transition"
                >
                  ▶ Play
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
