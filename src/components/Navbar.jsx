import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Gallerie", path: "/gallerie" },
  { label: "A propos", path: "/a-propos" },
  { label: "Exposition", path: "/exposition" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="navbar-wrapper">
      <div className="navbar-container">
        <nav className="navbar">
          <div className="navbar-links">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-link ${location.pathname === item.path ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className="navbar-burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>
      </div>

      <div className={`navbar-mobile-menu ${menuOpen ? "open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="navbar-link"
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}