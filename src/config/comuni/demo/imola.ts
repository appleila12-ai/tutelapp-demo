import type { ComuneConfig } from "../types";

// Comune di Imola (BO) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const imola: ComuneConfig = {
  slug: "imola",
  tipo: "comune",
  nome: "Comune di Imola",
  nomeBreve: "Imola",
  delEnte: "del Comune di Imola",
  soggetto: "Il Comune",
  provincia: "BO",
  regione: "Emilia-Romagna",

  ente: "Servizi Sociali",
  responsabile: "ASP Circondario Imolese · Sportello Sociale",
  indirizzo: "Viale D'Agostino 2/a, 40026 Imola (BO)",
  telefono: "0542 606720",
  email: "asp@aspcircondarioimolese.bo.it",
  pec: "comune.imola@cert.provincia.bo.it",
  orari: "Lun–Ven 8:30–12:30 · Mar anche 15:00–17:45",
  sitoWeb: "https://aspcircondarioimolese.bo.it/servizi/servizi-sociali/sportelli-sociali-e-territoriali",

  logo: null,

  theme: {
    warm: "#8CC7B8",
    warmSoft: "#DFF2ED",
    warmDark: "#2D6657",
    cream: "#F2F7F5",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Imola",
      subtitle: "ASP Circondario Imolese · Sportello Sociale · Viale D'Agostino 2/a, 40026 Imola (BO) · Tel. 0542 606720",
      action: { type: "tel", value: "0542606720" },
    },
    {
      icon: "business-outline",
      title: "ASP Circondario Imolese – centralino",
      subtitle: "Azienda Servizi alla Persona · Piazza Pertini 4, Imola",
      action: { type: "tel", value: "0542655911" },
    },
    {
      icon: "medkit-outline",
      title: "AUSL di Imola",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.ausl.imola.bo.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Imola (0542 606720) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "AUSL di Imola · Esenzioni ticket",
    url: "https://www.ausl.imola.bo.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
