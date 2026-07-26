import React from "react";
import aboutVideo from "../assets/video/video-contact.mp4";
import "../styles/Apropos.css";

const PARAGRAPHS = [
  [
    "Chaque tableau est réalisé entièrement à la main, avec des matériaux de qualité. Je peins exclusivement sur des ",
    { text: "toiles de lin montées sur châssis", highlight: true },
    ". Le lin est reconnu pour sa grande stabilité et sa résistance dans le temps, ce qui en fait un support ",
    { text: "durable", highlight: true },
    ", supérieur au coton.",
  ],
  [
    "J'utilise de la peinture à l'huile fine ",
    { text: "Lefranc Bourgeois", highlight: true },
    ", une gamme professionnelle que j'ai choisie après avoir testé différentes marques. Pour la réalisation de mes œuvres, j'utilise également une essence minérale ainsi qu'un médium Talens à séchage rapide, qui me permet de travailler les différentes couches tout en respectant les caractéristiques de la peinture à l'huile (le fameux ",
    { text: "gras sur maigre", highlight: true },
    ").",
  ],
  [
    "Chaque tableau demande du temps : plusieurs couches sont nécessaires, avec des temps de séchage entre chacune. C'est pourquoi il faut compter environ ",
    { text: "8 semaines", highlight: true },
    " avant l'expédition de votre commande.",
  ],
  [
    "Mes tableaux sont livrés prêts à être accrochés. Je ne vernis pas mes peintures avant leur envoi. Contrairement à une idée reçue, la peinture à l'huile ne sèche pas simplement : elle durcit progressivement par ",
    { text: "oxydation", highlight: true },
    ". Un vernissage final ne peut être réalisé qu'après un séchage complet, soit entre ",
    { text: "6 mois et 1 an", highlight: true },
    " selon l'épaisseur de la peinture.",
  ],
  [
    "Rassurez-vous, l'absence de vernis n'altère en rien la ",
    { text: "qualité de l'œuvre", highlight: true },
    ". Lorsqu'une peinture est réalisée avec des matériaux professionnels de qualité, le vernis constitue une finition esthétique et une protection supplémentaire, mais il n'est pas indispensable à la bonne conservation du tableau.",
  ],
];

export default function APropos() {
  return (
    <div className="apropos">
      <div className="apropos-video-col">
        <video
          src={aboutVideo}
          autoPlay
          muted
          loop
          playsInline
          className="apropos-video"
        />
      </div>

      <div className="apropos-text-col">
        {PARAGRAPHS.map((segments, i) => (
          <p key={i}>
            {segments.map((seg, j) =>
              typeof seg === "string" ? (
                seg
              ) : (
                <span key={j} className="apropos-highlight">
                  {seg.text}
                </span>
              )
            )}
          </p>
        ))}
      </div>
    </div>
  );
}