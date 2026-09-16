import React from "react";
import contactImage from "../assets/projets/archive de rencontre/Mur des archive, huile et acrylique sur toile, taille variable, 2022-toujuors en cours.jpeg";
import "../styles/Contact.css";

export default function Contact() {
  return (
    <div className="contact">
      <div className="contact-image-col">
        <img src={contactImage} alt="Atelier de l'artiste" className="contact-image" />
      </div>

      <div className="contact-info-col">
        <h2 className="contact-title">Me contacter</h2>
        <p className="contact-intro">
          Une question, une envie de commande, ou simplement l'envie d'échanger ? N'hésitez pas
          à me contacter.
        </p>

        <div className="contact-links">
          <a
            href="mailto:contact@mauve-chaix.fr?subject=Demande de contact via le site"
            className="contact-link"
          >
            <span className="contact-link-label">Email</span>
            <span className="contact-link-value">contact@mauve-chaix.fr</span>
          </a>

          <a href="tel:+33600000000" className="contact-link">
            <span className="contact-link-label">Téléphone</span>
            <span className="contact-link-value">+33 6 00 00 00 00</span>
          </a>

          <a
            href="https://www.instagram.com/votre_compte"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="contact-link-label">Instagram</span>
            <span className="contact-link-value">@votre_compte</span>
          </a>

          <div className="contact-link contact-link-static">
            <span className="contact-link-label">Localisation</span>
            <span className="contact-link-value">Paris, France</span>
          </div>
        </div>
      </div>
    </div>
  );
}