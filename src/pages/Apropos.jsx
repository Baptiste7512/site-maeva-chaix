import React from "react";
import aboutVideo from "../assets/video/video-contact.mp4";
import "../styles/Apropos.css";


const PARAGRAPHS = [
  ["wallah grand pavé sur le sens de la vie et des animeaux."],
  [
    "tfacon l'espece humaine est de manière général bien moins intéressante que les espece animal exemple simple : le système des fourmis bien que baser sur une dictature il ",
    { text: "fonctionne", highlight: true },
    " bien mieux et efficacement, recemment une ",
    { text: "étude", highlight: true },
    " a permis de démontrer que sur un même problème les fourmis peuvent résoudre ce problème plus rapidement qu'un même groupe ",
    { text: "d'humain", highlight: true },
    ".",
  ],
  [
    "Encore, on c'est ",
    { text: "rendue", highlight: true },
    " compte que certains animeaux été capable de produire des ",
    { text: "sonorité", highlight: true },
    " par simple ",
    { text: "plaisir", highlight: true },
    ", les singes peuvent communiquer par le langage des signes des ",
    { text: "émotions", highlight: true },
    " semblable aux humains tel que la tristesse ou la joie.",
  ],
  [
    "La seul ",
    { text: "différence", highlight: true },
    " souvent résident dans la conception abstraite des éléments compliquer, exemple donner un billet a un singe il n'en voit pas l'interet ni la ",
    { text: "valeur", highlight: true },
    ", mais exprimer une émotions même complexe il peut le faire.",
  ],
  [
    "des théorie avancent que la courbe ",
    { text: "d'apprentissage", highlight: true },
    " des animeaux a été ralentie voir stoppé par ",
    { text: "l'évolution", highlight: true },
    " et l'espace fulgurant de l'etre humain, dans un royaume sans humain un autre avenir pourrait etre ",
    { text: "réalisable", highlight: true },
    ", mais de notre conception on ne ce soucie d'eux que par interet financier ou de distraction les remettre au coeur de l'attention pour qui ils sont et non pas pour ce qu'ils sont, est certainement le plus ",
    { text: "beau", highlight: true },
    " des messages possible.",
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