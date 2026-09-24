import type { ComuneConfig } from "../types";

// Comune di Chiavari (GE) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const chiavari: ComuneConfig = {
  slug: "chiavari",
  tipo: "comune",
  nome: "Comune di Chiavari",
  nomeBreve: "Chiavari",
  delEnte: "del Comune di Chiavari",
  soggetto: "Il Comune",
  provincia: "GE",
  regione: "Liguria",

  ente: "Servizi Sociali",
  responsabile: "Settore Politiche per la persona",
  indirizzo: "Via Privata Nostra Signora dell'Orto 2, 16043 Chiavari (GE)",
  telefono: "0185 365499",
  email: "disabili@comune.chiavari.ge.it",
  pec: "comune.chiavari@cert.legalmail.it",
  orari: "Orari: vedi il sito del Comune o telefona",
  sitoWeb: "https://www.comune.chiavari.ge.it/it/vivere/ufficio-servizi-sociali-e-istruzione",

  logo: null,

  theme: {
    warm: "#E0A96D",
    warmSoft: "#F8EAD9",
    warmDark: "#7A4E1E",
    cream: "#F8F4EE",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Chiavari",
      subtitle: "Settore Politiche per la persona · Via Privata Nostra Signora dell'Orto 2, 16043 Chiavari (GE) · Tel. 0185 365499",
      action: { type: "tel", value: "0185365499" },
    },
    {
      icon: "business-outline",
      title: "Distretto Sociosanitario Chiavarese",
      subtitle: "Nella stessa sede dei Servizi Sociali · Via Privata N.S. dell'Orto 2",
      action: { type: "tel", value: "0185365393" },
    },
    {
      icon: "medkit-outline",
      title: "ASL4 Chiavarese",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.asl4.liguria.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Chiavari (0185 365499) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ASL4 Chiavarese · Esenzioni ticket",
    url: "https://www.asl4.liguria.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
