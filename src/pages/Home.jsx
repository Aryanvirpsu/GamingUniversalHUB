import { useState, useEffect } from "react";
import { scanSteamGames } from "../utils/steam";
import { invoke } from "@tauri-apps/api/core";

export default function Home() {
  const featuredGames = [
    { title: "Cyberpunk 2077", playtime: "45h", image: "🌃" },
    { title: "Elden Ring", playtime: "120h", image: "⚔️" },
    { title: "Spider-Man", playtime: "32h", image: "🕷️" },
  ];

  const [steamGames, setSteamGames] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const games = await scanSteamGames();

        // Hide Steamworks Common Redistributables
        const filtered = games.filter((g) => g.app_id !== "228980");

        setSteamGames(filtered);
      } catch (e) {
        console.error("Steam scan failed:", e);
      }
    })();
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
            fontWeight: "800",
            background: "linear-gradient(135deg, #fff 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem",
          }}
        >
          Welcome Back, Player One 👋
        </h1>
        <p
          style={{
            color: "#888",
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
          }}
        >
          Continue your gaming journey
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
          gap: "1rem",
          marginBottom: "3rem",
          maxWidth: "900px",
          margin: "0 auto 3rem auto",
        }}
      >
        {[
          { label: "Games Owned", value: "124", icon: "🎮", color: "#a855f7" },
          { label: "Hours Played", value: "1,247", icon: "⏱️", color: "#ec4899" },
          { label: "Achievements", value: "89", icon: "🏆", color: "#f59e0b" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background:
                "linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.8) 100%)",
              padding: "clamp(1rem, 3vw, 1.5rem)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              transition: "transform 0.3s, border-color 0.3s",
              cursor: "pointer",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = `${stat.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor =
                "rgba(255, 255, 255, 0.05)";
            }}
          >
            <div
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                marginBottom: "0.5rem",
              }}
            >
              {stat.icon}
            </div>
            <div
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                fontWeight: "700",
                color: stat.color,
                marginBottom: "0.25rem",
              }}
            >
              {stat.value}
            </div>
            <div style={{ color: "#888", fontSize: "0.9rem" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Featured Games */}
      <div>
        <h2
          style={{
            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
            fontWeight: "700",
            marginBottom: "1.5rem",
            color: "#fff",
            textAlign: "center",
          }}
        >
          Continue Playing
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: "1.5rem",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {featuredGames.map((game) => (
            <div
              key={game.title}
              style={{
                background:
                  "linear-gradient(135deg, rgba(26, 26, 46, 0.6) 0%, rgba(15, 15, 30, 0.6) 100%)",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.borderColor =
                  "rgba(168, 85, 247, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor =
                  "rgba(255, 255, 255, 0.05)";
              }}
            >
              <div
                style={{
                  height: "clamp(120px, 20vw, 160px)",
                  background:
                    "linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.3) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(2.5rem,6vw,4rem)",
                }}
              >
                {game.image}
              </div>

              <div style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#fff",
                    marginBottom: "0.5rem",
                  }}
                >
                  {game.title}
                </h3>
                <p style={{ color: "#888", fontSize: "0.9rem" }}>
                  Played {game.playtime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Installed Steam Games */}
      {steamGames.length > 0 && (
        <div style={{ marginTop: "4rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              color: "#fff",
              textAlign: "center",
            }}
          >
            Installed Steam Games
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
              gap: "1.5rem",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            {steamGames.map((g) => {
              const cover =
                "https://steamcdn-a.akamaihd.net/steam/apps/" +
                g.app_id +
                "/library_600x900.jpg";

              return (
                <div
                  key={g.app_id}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(26, 26, 46, 0.6) 0%, rgba(15, 15, 30, 0.6) 100%)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.borderColor =
                      "rgba(168, 85, 247, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.05)";
                  }}
                >
                  <img
                    src={cover}
                    alt={g.name}
                    onError={(e) =>
                      (e.target.src = "/placeholder_game.png")
                    }
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ padding: "1rem" }}>
                    <h3
                      style={{
                        color: "#fff",
                        fontSize: "1rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {g.name}
                    </h3>

                    {/* Play Button */}
                    <button
                      onClick={() => invoke("launch_game", { appId: g.app_id })}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0",
                        borderRadius: "10px",
                        marginBottom: "0.5rem",
                        background:
                          "linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(236,72,153,0.25) 100%)",
                        border: "1px solid rgba(168,85,247,0.4)",
                        color: "#fff",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(168,85,247,0.8)";
                        e.currentTarget.style.transform = "scale(1.03)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(168,85,247,0.4)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      ▶ Play
                    </button>

                    <p
                      style={{
                        color: "#8a8a8a",
                        fontSize: "0.75rem",
                      }}
                    >
                      Installed
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
