import React from "react";
// 1. You need these three tools from the router
import { Routes, Route, Link } from "react-router-dom";

// 2. These are the "Page" components you are building
import Home from "./pages/Home/Home";
import Upload from "./pages/Upload/Upload";
import Chat from "./pages/Chat/Chat";
import Library from "./pages/Library/Library";
import Practice from "./pages/Practice/Practice";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddQuestion from "./pages/AddQuestion/AddQuestion";
import QuestionManager from "./pages/QuestionManager/QuestionManager";

function App() {
  return (
    <div style={appContainer}>
      {/* Mobile-First Navbar */}
      <nav style={navStyle}>
        <div style={navContent}>
          <h2 style={logoStyle}>AI Knowledge Assistant </h2>
          <div style={navLinks}>
            <Link to="/" style={navLink}>Home</Link>
            <Link to="/upload" style={navLink}>Upload</Link>
            <Link to="/chat" style={navLink}>Chat</Link>
            <Link to="/dashboard"style={navLink}>CUET PG</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/library" element={<Library />} />
        <Route path="/practice/:noteId" element={<Practice />} />
        <Route path="/add-question/:noteId"element={<AddQuestion/>}/>
        <Route path="/manage/:noteId" element={<QuestionManager/>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

const appContainer = {
  background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
  minHeight: '100vh',
  color: 'white',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

const navStyle = {
  background: 'rgba(12,12,12,0.95)',
  backdropFilter: 'blur(20px)',
  padding: '12px 20px',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const navContent = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const logoStyle = {
  margin: 0,
  fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
  background: 'linear-gradient(45deg, #00d4ff, #5a67d8)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold'
};

const navLinks = {
  display: 'flex',
  gap: '8px'
};

const navLink = {
  color: 'white',
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '0.95rem',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap'
};

export default App;