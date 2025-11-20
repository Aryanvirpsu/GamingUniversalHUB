import { supabase } from "./supabase";
import { invoke } from "@tauri-apps/api/core";

export async function upsertUserProfile(session) {
  const user = session.user;
  if (!user) return;

  // 1. Steam auto-detection
  let steam_id = null;
  try {
    steam_id = await invoke("get_steam_id");
  } catch (err) {
    console.error("Steam ID detection failed:", err);
  }

  // 2. Fetch Steam details
  let steamData = null;
  if (steam_id) {
    try {
      steamData = await invoke("fetch_steam_profile", { steamId: steam_id });
    } catch (err) {
      console.error("Steam profile fetch failed:", err);
    }
  }

  // 3. Insert/update main profile
  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata.full_name,
    avatar_url: user.user_metadata.avatar_url
  });

  // 4. Insert/update steam_accounts
  if (steam_id) {
    await supabase.from("steam_accounts").upsert({
      id: user.id,
      steam_id,
      steam_username: steamData?.personaname,
      steam_avatar: steamData?.avatarfull,
      steam_profile_url: steamData?.profileurl,
      steam_created_at: steamData?.timecreated
    });
  }
}
