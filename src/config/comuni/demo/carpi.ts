import type { ComuneConfig } from "../types";

// Comune di Carpi (MO) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const carpi: ComuneConfig = {
  slug: "carpi",
  tipo: "comune",
  nome: "Comune di Carpi",
  nomeBreve: "Carpi",
  delEnte: "del Comune di Carpi",
  soggetto: "Il Comune",
  provincia: "MO",
  regione: "Emilia-Romagna",

  ente: "Servizi Sociali",
  responsabile: "Unione delle Terre d'Argine · Sportello Sociale di Carpi",
  indirizzo: "Casa della Comunità, Piazzale S. Allende 2, 41012 Carpi (MO)",
  telefono: "059 8635288",
  email: "carpi@sportellosociale.info",
  pec: "comune.carpi@pec.comune.carpi.mo.it",
  orari: "Lun–Ven 8:30–17:30 · Sab 8:30–12:30",
  sitoWeb: "https://www.terredargine.it/assistenza-sociale/sportelli-sociali-territoriali/carpi-sportello-sociale/",

  logo: null,

  theme: {
    warm: "#E3A94A",
    warmSoft: "#FAEBD0",
    warmDark: "#7A5212",
    cream: "#F8F4EB",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Carpi",
      subtitle: "Unione delle Terre d'Argine · Sportello Sociale di Carpi · Casa della Comunità, Piazzale S. Allende 2, 41012 Carpi (MO) · Tel. 059 8635288",
      action: { type: "tel", value: "0598635288" },
    },
    {
      icon: "business-outline",
      title: "ASP Terre d'Argine",
      subtitle: "Servizi domiciliari e residenziali per anziani e persone con disabilità",
      action: { type: "web", value: "https://www.aspterredargine.it/aspterredargine/come-accedere-ai-servizi/" },
    },
    {
      icon: "medkit-outline",
      title: "AUSL Modena",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.ausl.mo.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Carpi (059 8635288) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "AUSL Modena · Esenzioni ticket",
    url: "https://www.ausl.mo.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
