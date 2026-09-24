import type { ComuneConfig } from "../types";

// Comune di Città di Castello (PG) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const cittaDiCastello: ComuneConfig = {
  slug: "citta-di-castello",
  tipo: "comune",
  nome: "Comune di Città di Castello",
  nomeBreve: "Città di Castello",
  delEnte: "del Comune di Città di Castello",
  soggetto: "Il Comune",
  provincia: "PG",
  regione: "Umbria",

  ente: "Servizi Sociali",
  responsabile: "Settore Politiche Sociali · Ufficio della Cittadinanza",
  indirizzo: "Via dei Pinchitorzi 12, 06012 Città di Castello (PG)",
  telefono: "075 8529318",
  email: "comune.cittadicastello@postacert.umbria.it",
  pec: "comune.cittadicastello@postacert.umbria.it",
  orari: "Su appuntamento",
  sitoWeb: "https://trasparenza.comune.cittadicastello.pg.it/archivio13_strutture_-1_2558.html",

  logo: null,

  theme: {
    warm: "#A7C4D9",
    warmSoft: "#E6EFF6",
    warmDark: "#3A5870",
    cream: "#F4F6F8",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Città di Castello",
      subtitle: "Settore Politiche Sociali · Ufficio della Cittadinanza · Via dei Pinchitorzi 12, 06012 Città di Castello (PG) · Tel. 075 8529318",
      action: { type: "tel", value: "0758529318" },
    },
    {
      icon: "business-outline",
      title: "Zona Sociale n. 1",
      subtitle: "Servizi sociali associati della zona, con capofila Città di Castello · Centralino del Comune",
      action: { type: "tel", value: "07585291" },
    },
    {
      icon: "medkit-outline",
      title: "USL Umbria 1",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.uslumbria1.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Città di Castello (075 8529318) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "USL Umbria 1 · Esenzioni ticket",
    url: "https://www.uslumbria1.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
