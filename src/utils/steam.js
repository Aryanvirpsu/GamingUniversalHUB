import { invoke } from "@tauri-apps/api/core";

export async function scanSteamGames() {
  try {
    return await invoke("scan_steam_games");
  } catch (e) {
    console.error("Steam scan failed:", e);
    return [];
  }
}
