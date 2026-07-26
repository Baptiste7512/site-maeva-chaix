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

      <div className="home-text-container">
        <div className="home-hero-text">
          <h2 className="home-hero-title">Bienvenue dans mon univers</h2>
          <p>
            Je m'appelle Mauve. Titulaire d'un Master en Arts Plastiques — mention Écologie des
            arts et des médias — de l'Université Paris 8, je place la{" "}
            <span className="highlight">sensibilité</span> et l'attention au vivant au cœur de
            ma démarche artistique.
          </p>
          <p>
            Je me consacre aujourd'hui à la création de{" "}
            <span className="highlight">portraits personnalisés peints à la main</span>. Qu'il
            s'agisse de capturer le regard de votre animal de compagnie ou d'immortaliser le
            lien unique qui vous unit à lui, chaque peinture raconte une histoire.
          </p>

          <h2 className="home-hero-title">Une démarche sur-mesure et durable</h2>
          <p>
            Toutes mes œuvres sont réalisées sur commande au sein de mon atelier. J'accorde une
            importance toute particulière au choix de mes matériaux, sélectionnés pour leur
            qualité professionnelle, garantissant ainsi des tableaux durables que vous pourrez
            chérir longtemps. Pour ces projets je travaille à partir de photos, la composition
            pourra être amenée à changer (avec votre validation évidemment).
          </p>

          <h2 className="home-hero-title">Aux origines de ma démarche</h2>
          <p>
            C'est au cours d'une exposition de mes portraits qu'est né ce projet. Un visiteur
            m'a abordée avec une requête particulière : réaliser le portrait d'un ami et de son
            chien, tragiquement disparu, afin de lui offrir une œuvre en guise d'hommage.
          </p>
          <p>
            Répondre à cette demande a été un déclic absolu. J'ai réalisé à quel point peindre
            la complicité entre un être humain et son animal dépassait le simple travail
            artistique : c'était une manière d'accompagner, d'honorer une mémoire et d'apporter
            du baume au cœur.
          </p>
          <p>
            Depuis ce jour, je mets ma <span className="highlight">sensibilité</span> au
            service de vos souvenirs, pour que les êtres qui comptent le plus pour vous restent
            à jamais gravés dans la matière.
          </p>
        </div>
      </div>
    </div>
  );
}