import { LazyStore } from "@tauri-apps/plugin-store";

export const profileStore = new LazyStore("profile.json");
