import type { ComuneConfig } from "../types";

// Comune di Lecco (LC) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const lecco: ComuneConfig = {
  slug: "lecco",
  tipo: "comune",
  nome: "Comune di Lecco",
  nomeBreve: "Lecco",
  delEnte: "del Comune di Lecco",
  soggetto: "Il Comune",
  provincia: "LC",
  regione: "Lombardia",

  ente: "Servizi Sociali",
  responsabile: "Area 4 · Politiche sociali, per la casa e per il lavoro",
  indirizzo: "Largo Caleotto 29/30, 23900 Lecco (LC)",
  telefono: "0341 481207",
  email: "servizi.sociali@comune.lecco.it",
  pec: "comune@pec.comunedilecco.it",
  orari: "Lun–Ven 9:00–12:00",
  sitoWeb: "https://www.comune.lecco.it/Amministrazione/Uffici/Politiche-sociali",

  logo: null,

  theme: {
    warm: "#D98C8C",
    warmSoft: "#F6E1E1",
    warmDark: "#7A3434",
    cream: "#F8F2F2",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Lecco",
      subtitle: "Area 4 · Politiche sociali, per la casa e per il lavoro · Largo Caleotto 29/30, 23900 Lecco (LC) · Tel. 0341 481207",
      action: { type: "tel", value: "0341481207" },
    },
    {
      icon: "business-outline",
      title: "Segretariato Sociale",
      subtitle: "Informazioni e accompagnamento ai servizi sociali e socio-sanitari · Via Marco d'Oggiono 15 · Lun–Ven 9–12",
      action: { type: "tel", value: "0341481235" },
    },
    {
      icon: "medkit-outline",
      title: "ASST Lecco",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.asst-lecco.it/esenzioni/" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Lecco (0341 481207) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ASST Lecco · Esenzioni ticket",
    url: "https://www.asst-lecco.it/esenzioni/",
  },

  daVerificare: true,
  dimostrativo: true,
};
