import React, { useState } from "react";
import heroEmpty from "../assets/photo/studio-without-1.jpg";
import heroAction from "../assets/photo/studio-with-1.jpg";
import "../styles/Home.css";

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="home">
      <div
        className="home-hero-image"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={() => setIsHovering((v) => !v)} // tap-to-toggle on touch devices
      >
        <img src={heroEmpty} alt="Atelier de l'artiste" className="home-hero-photo base" />
        <img
          src={heroAction}
          alt="La peintre en train de peindre dans son atelier"
          className={`home-hero-photo overlay ${isHovering ? "visible" : ""}`}
        />
      </div>

      <p className="home-hero-text">Bla bla bla Maeva chaix trop forte</p>
    </div>
  );
}