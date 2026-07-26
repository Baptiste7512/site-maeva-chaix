import React, { useState } from "react";
import "../styles/Carousel.css";

const modules = import.meta.glob("../assets/photo/gallerie/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});
const IMAGES = Object.values(modules);

export default function Carousel() {
  const [index, setIndex] = useState(0);

  if (IMAGES.length === 0) return null;

  const goPrev = () => setIndex((i) => (i === 0 ? IMAGES.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === IMAGES.length - 1 ? 0 : i + 1));

  return (
    <div className="carousel">
      <div className="carousel-frame">
        <img src={IMAGES[index]} alt={`Œuvre ${index + 1}`} className="carousel-img" />

        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={goPrev}
          aria-label="Œuvre précédente"
        >
          ‹
        </button>
        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={goNext}
          aria-label="Œuvre suivante"
        >
          ›
        </button>
      </div>
    </div>
  );
}