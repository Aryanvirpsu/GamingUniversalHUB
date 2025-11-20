import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import AuthCallback from "./pages/AuthCallback";

import { supabase } from "./lib/supabase";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // --------- Responsive breakpoint ----------
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


// ------------------------------------
// A3 – Load cached profile instantly
// ------------------------------------
useEffect(() => {
  (async () => {
    try {
      const { profileStore } = await import("./lib/profileStore");
      const cached = await profileStore.get("profile");

      if (cached) {
        setUser(cached);
      }
    } catch (err) {
      console.error("Failed loading local cache:", err);
    }
  })();
}, []);


// ------------------------------------
// Supabase session listener
// ------------------------------------
useEffect(() => {
  // STEP 1: load current session ONCE
  supabase.auth.getSession().then(({ data }) => {
    setSessionLoaded(true);
    setUser(data.session?.user ?? null);
  });

  // STEP 2: real-time auth listener
  const { data: { subscription } } =
    supabase.auth.onAuthStateChange(async (_event, session) => {

      // Prevent race conditions:
      // Don't overwrite cached user before initial load finishes
      if (!sessionLoaded) return;

      // Update UI
      setUser(session?.user ?? null);

      // If logged out -> clear cache
      if (!session) {
        const { profileStore } = await import("./lib/profileStore");
        await profileStore.delete("profile");
        await profileStore.save();
        return;
      }

      // If logged in -> sync Google
      try {
        const { syncGoogleFromSession } = await import("./lib/accounts");
        await syncGoogleFromSession(session);
      } catch (err) {
        console.error("Google sync failed:", err);
      }

      // Cache user locally
      try {
        const { profileStore } = await import("./lib/profileStore");
        await profileStore.set("profile", session.user);
        await profileStore.save();
      } catch (err) {
        console.error("Failed caching local profile:", err);
      }
    });

  return () => subscription.unsubscribe();
}, [sessionLoaded]);


// ------------------------------------
// LOGIN / LOGOUT
// ------------------------------------
async function login() {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:5173/auth/callback",
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });
}


async function logout() {
  // 1. Clear UI instantly
  setUser(null);

  // 2. Clear local cache
  const { profileStore } = await import("./lib/profileStore");
  await profileStore.delete("profile");
  await profileStore.save();

  // 3. Supabase logout (async, event listener will not override UI now)
  await supabase.auth.signOut();
}

  // --------- Theming ----------
  const bgColor = darkMode
    ? "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)"
    : "linear-gradient(135deg, #ffffff 0%, #f3e8ff 50%, #ffffff 100%)";

  const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: bgColor,
        color: textColor,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        position: "relative",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      {/* SIDEBAR (fixed width on desktop, overlay feel on mobile) */}
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        login={login}
        logout={logout}
      />

      {/* MAIN AREA */}
      <div
        style={{
          flex: 1,
          marginLeft: isMobile ? 0 : 125, // matches your sidebar width
          padding: isMobile ? "1rem" : "1.5rem 2rem",
          paddingTop: isMobile ? "4.5rem" : "1.5rem",
          overflow: "hidden",
          position: "relative",
          width: "100%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Scrollable content area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            position: "relative",
          }}
        >
          {/* Decorative gradient orbs (sit behind everything) */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "min(500px, 80vw)",
                height: "min(500px, 80vw)",
                background:
                  "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
                borderRadius: "50%",
                top: "-200px",
                right: "-200px",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "min(400px, 70vw)",
                height: "min(400px, 70vw)",
                background:
                  "radial-gradient(circle, rgba(236, 72, 153, 0.10) 0%, transparent 70%)",
                borderRadius: "50%",
                bottom: "-150px",
                left: isMobile ? "-150px" : "110px",
              }}
            />
          </div>

          {/* Actual page content */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              paddingBottom: "2rem",
            }}
          >
            <Routes>
              <Route path="/" element={<Home darkMode={darkMode} user={user} />} />
              <Route path="/library" element={<Library darkMode={darkMode} />} />
              <Route path="/wallet" element={<Wallet darkMode={darkMode} />} />
              <Route
                path="/settings"
                element={
                  <Settings
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    user={user}
                    login={login}
                    logout={logout}
                  />
                }
              />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </div>
        </div>

        {/* Global CSS fixes */}
        <style>{`
          * {
            box-sizing: border-box;
          }

          body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100%;
            width: 100%;
          }

          #root {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  );
}
