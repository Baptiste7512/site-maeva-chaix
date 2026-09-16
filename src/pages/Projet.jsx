import React, { useState, useMemo } from "react";
import "../styles/Projet.css";

/**
 * Liste des projets. Ajoute/modifie les entrées ici.
 * date au format ISO (YYYY-MM-DD) pour que le tri chronologique fonctionne bien.
 * slug = nom du dossier dans src/assets/projets/<slug>/
 */
const PROJETS = [
  { date: "2025-03-15", nom: "animaux", slug: "animaux" },
  { date: "2024-11-02", nom: "archive de rencontre", slug: "archive de rencontre" },
  { date: "2026-01-20", nom: "chateau", slug: "chateau" },
  { date: "2026-01-20", nom: "epuisement", slug: "epuisement" },
  { date: "2026-01-20", nom: "La muse", slug: "La Muse" },
]

const COLUMNS = [
  { key: "date", label: "Date" },
  { key: "nom", label: "Nom du projet" },
];

// --- Vidéos hébergées sur Cloudinary ---
// Les vidéos sont trop lourdes pour être versionnées dans le repo Git,
// elles sont donc hébergées sur Cloudinary et référencées ici manuellement,
// regroupées par slug de projet (voir PROJETS ci-dessus).
const CLOUDINARY_VIDEOS_BY_SLUG = {
  "archive de rencontre": [
    "https://res.cloudinary.com/ljauyojb/video/upload/v1789597473/Portrait_Maeva_-_Sternafilms.mp4",
  ],
  "epuisement": [
    "https://res.cloudinary.com/ljauyojb/video/upload/v1789598960/silhouette_me%CC%81moire_II_de%CC%81coupage_et_nume%CC%81risation_14_8_x_21_cm_vide%CC%81o_51_sec_2025.mp4",
    "https://res.cloudinary.com/ljauyojb/video/upload/v1789598862/Peindre_l_autre_jusqu_%C3%A0_l_%C3%A9puisement_IX_-_compressed2.mp4",
    "https://res.cloudinary.com/ljauyojb/video/upload/v1789597651/A%CC%80_la_me%CC%81moire_du_me%CC%81moire_II_de%CC%81coupage_et_combustion_d_un_me%CC%81moire_14_8_x_21_cm_vide%CC%81o_1m10_2025.mov",
    "https://res.cloudinary.com/ljauyojb/video/upload/v1789597646/A%CC%80_la_me%CC%81moire_du_me%CC%81moire_II_techniques_mixtes.mp4",
    "https://res.cloudinary.com/ljauyojb/video/upload/v1789597644/A%CC%80_la_me%CC%81moire_du_me%CC%81moire_I_techniques_mixtes.mp4",
    "https://res.cloudinary.com/ljauyojb/video/upload/v1789597564/silhouette_me%CC%81moire_I_feutre_et_nume%CC%81risation_14_8_x_21_cm_vide%CC%81o_42_sec_2025.mp4",
  ],
};

// --- Chargement automatique des images et descriptions ---
// Seules les images sont chargées automatiquement depuis src/assets/projets/*
// (eager: chargées tout de suite). Les vidéos viennent de Cloudinary, voir ci-dessus.
const imageModules = import.meta.glob(
  "/src/assets/projets/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" }
);
// Tous les fichiers description.txt, importés en texte brut
const textModules = import.meta.glob("/src/assets/projets/*/description.txt", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Mélange aléatoire d'un tableau (Fisher-Yates), sans modifier l'original
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// On regroupe tout ça par slug : { "chateau": { medias: [...], description: "..." } }
function buildAssetsBySlug() {
  const bySlug = {};

  for (const path in imageModules) {
    // path ressemble à /src/assets/projets/chateau/2.jpg
    const match = path.match(/\/projets\/([^/]+)\//);
    if (!match) continue;
    const slug = match[1];
    if (!bySlug[slug]) bySlug[slug] = { medias: [], description: "" };
    bySlug[slug].medias.push({
      src: imageModules[path],
      type: "image",
      path, // gardé pour référence
    });
  }

  // Ajout des vidéos Cloudinary
  for (const slug in CLOUDINARY_VIDEOS_BY_SLUG) {
    if (!bySlug[slug]) bySlug[slug] = { medias: [], description: "" };
    CLOUDINARY_VIDEOS_BY_SLUG[slug].forEach((url) => {
      bySlug[slug].medias.push({
        src: url,
        type: "video",
        path: url, // gardé pour référence / tri
      });
    });
  }

  for (const path in textModules) {
    const match = path.match(/\/projets\/([^/]+)\//);
    if (!match) continue;
    const slug = match[1];
    if (!bySlug[slug]) bySlug[slug] = { medias: [], description: "" };
    bySlug[slug].description = textModules[path];
  }

  // Tri par nom de fichier pour un ordre stable et prévisible en base
  // (le mélange aléatoire, lui, se fait à l'ouverture de la popup, voir ProjetModal)
  for (const slug in bySlug) {
    bySlug[slug].medias.sort((a, b) => a.path.localeCompare(b.path));
  }

  return bySlug;
}

const ASSETS_BY_SLUG = buildAssetsBySlug();

// --- Composant Modal ---
function ProjetModal({ projet, onClose }) {
  // On calcule assets et le mélange AVANT le early return, pour respecter
  // la règle des hooks (l'ordre des hooks doit être stable à chaque rendu).
  const assets = projet
    ? ASSETS_BY_SLUG[projet.slug] || { medias: [], description: "" }
    : { medias: [], description: "" };

  // Nouveau mélange à chaque changement de projet (donc à chaque ouverture de popup)
  const shuffledMedias = useMemo(() => shuffle(assets.medias), [projet?.slug]);

  if (!projet) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="projet-modal-backdrop" onClick={handleBackdropClick}>
      <div className="projet-modal">
        <button className="projet-modal-close" onClick={onClose} aria-label="Fermer">
          ×
        </button>
        <h2>{projet.nom}</h2>

        {assets.description && (
          <p className="projet-modal-description">{assets.description}</p>
        )}

        {shuffledMedias.length > 0 ? (
          <div className="projet-modal-gallery">
            {shuffledMedias.map((media, i) =>
              media.type === "video" ? (
                <video key={i} src={media.src} controls playsInline />
              ) : (
                <img key={i} src={media.src} alt={`${projet.nom} ${i + 1}`} />
              )
            )}
          </div>
        ) : (
          <p className="projet-modal-empty">Aucun média pour ce projet.</p>
        )}
      </div>
    </div>
  );
}

export default function Projets() {
  // direction: "asc" ou "desc". Par défaut la date trie du plus ancien
  // au plus récent (asc), nom et lieu trient alphabétiquement (asc).
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });
  const [selectedProjet, setSelectedProjet] = useState(null);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedProjets = useMemo(() => {
    const { key, direction } = sortConfig;
    const sorted = [...PROJETS].sort((a, b) => {
      let comparison = 0;
      if (key === "date") {
        comparison = new Date(a.date) - new Date(b.date);
      } else {
        comparison = a[key].localeCompare(b[key], "fr", { sensitivity: "base" });
      }
      return direction === "asc" ? comparison : -comparison;
    });
    return sorted;
  }, [sortConfig]);

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "numeric", year: "2-digit" });
  };

  return (
    <div className="projets">
      <table className="projets-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => {
              const isActive = sortConfig.key === col.key;
              return (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`projets-th ${isActive ? "projets-th-active" : ""}`}
                >
                  {col.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedProjets.map((expo, i) => (
            <tr key={i} className="projets-row">
              <td>{formatDate(expo.date)}</td>
              <td
                className="projets-nom-clickable"
                onClick={() => setSelectedProjet(expo)}
              >
                {expo.nom}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProjetModal projet={selectedProjet} onClose={() => setSelectedProjet(null)} />
    </div>
  );
}