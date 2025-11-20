import { supabase } from "./supabase";

// -------------------------------------------------
// Create/update the `linked_accounts` record
// -------------------------------------------------
export async function linkSteamForCurrentUser(steamId) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not logged in");

  const profileId = user.id;

  // 1️⃣ UPSERT into linked_accounts
  const { error: linkError } = await supabase
    .from("linked_accounts")
    .upsert(
      {
        provider: "steam",
        provider_user_id: steamId,
        profile_id: profileId,
      },
      { onConflict: "provider,profile_id" }
    );

  if (linkError) throw linkError;

  // 2️⃣ UPSERT into steam_accounts
  const { error: steamError } = await supabase
    .from("steam_accounts")
    .upsert(
      {
        id: profileId,      // MUST MATCH profiles.id
        profile_id: profileId,
        steam_id: steamId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (steamError) throw steamError;

  return true;
}
