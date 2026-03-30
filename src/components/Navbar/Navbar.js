import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">AI Knowledge Assistant</div>

      <div className={`navLinks ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/upload" onClick={() => setMenuOpen(false)}>
          Upload
        </Link>
        <Link to="/chat" onClick={() => setMenuOpen(false)}>
          Chat
        </Link>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
          EXAM PRACTICE
        </Link>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}

export default Navbar;
