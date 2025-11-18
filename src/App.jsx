import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const bgColor = darkMode 
    ? "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)"
    : "linear-gradient(135deg, #ffffff 0%, #f3e8ff 50%, #ffffff 100%)";
  
  const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
  const cardBg = darkMode 
    ? "linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.8) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(243, 232, 255, 0.9) 100%)";

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: bgColor,
      color: textColor,
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      position: "relative",
      transition: "background 0.3s, color 0.3s"
    }}>
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div style={{
        flex: 1,
        marginLeft: isMobile ? "0" : "125px",
        padding: isMobile ? "1rem" : "1.5rem 2rem",
        paddingTop: isMobile ? "4.5rem" : "1.5rem",
        overflowY: "auto",
        overflowX: "hidden",
        position: "relative",
        width: isMobile ? "100%" : "calc(100% - 260px)",
        minWidth: 0,
        transition: "margin-left 0.3s ease",
        height: "100vh",
        display: "flex",
        justifyContent: "center"
      }}>
        {/* Decorative gradient orbs */}
        <div style={{
          position: "fixed",
          width: "min(500px, 80vw)",
          height: "min(500px, 80vw)",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          top: "-200px",
          right: "-200px",
          pointerEvents: "none",
          zIndex: 0
        }} />
        <div style={{
          position: "fixed",
          width: "min(400px, 70vw)",
          height: "min(400px, 70vw)",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          bottom: "-150px",
          left: isMobile ? "-150px" : "110px",
          pointerEvents: "none",
          zIndex: 0
        }} />
        
        <div style={{ 
          position: "relative", 
          zIndex: 1,
          width: "100%",
          maxWidth: "1200px"
        }}>
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/library" element={<Library darkMode={darkMode} />} />
            <Route path="/wallet" element={<Wallet darkMode={darkMode} />} />
            <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
          </Routes>
        </div>
      </div>

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
  );
}