import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function finishAuth() {
      console.log("FULL URL:", window.location.href);

      // Extract hash fragment after "#"
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      console.log("ACCESS TOKEN:", access_token);
      console.log("REFRESH TOKEN:", refresh_token);

      if (access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        console.log("SET SESSION:", data, error);
      } else {
        console.warn("No tokens found in URL hash.");
      }

      setTimeout(() => navigate("/"), 300);
    }

    finishAuth();
  }, []);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
      <h1>Authenticating...</h1>
      <p>Please wait while we sign you in.</p>
    </div>
  );
}
