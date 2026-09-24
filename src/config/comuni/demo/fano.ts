import type { ComuneConfig } from "../types";

// Comune di Fano (PU) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const fano: ComuneConfig = {
  slug: "fano",
  tipo: "comune",
  nome: "Comune di Fano",
  nomeBreve: "Fano",
  delEnte: "del Comune di Fano",
  soggetto: "Il Comune",
  provincia: "PU",
  regione: "Marche",

  ente: "Servizi Sociali",
  responsabile: "Settore 6 · Servizi Sociali",
  indirizzo: "Via Sant'Eusebio 32, loc. S. Orso, 61032 Fano (PU)",
  telefono: "0721 887483",
  email: "ups.ats6@comune.fano.pu.it",
  pec: "comune.fano@emarche.it",
  orari: "Lun, Mer, Gio 9:00–13:00 · Mar 15:30–17:30",
  sitoWeb: "https://www.comune.fano.pu.it/Amministrazione/Uffici/Servizi-Sociali-Dirigenza-e-Staff-di-Direzione",

  logo: null,

  theme: {
    warm: "#E6B566",
    warmSoft: "#FAEED6",
    warmDark: "#7A5516",
    cream: "#F9F5EC",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Fano",
      subtitle: "Settore 6 · Servizi Sociali · Via Sant'Eusebio 32, loc. S. Orso, 61032 Fano (PU) · Tel. 0721 887483",
      action: { type: "tel", value: "0721887483" },
    },
    {
      icon: "business-outline",
      title: "Ambito Territoriale Sociale n. 6",
      subtitle: "Servizi sociali associati dei Comuni dell'Ambito, con capofila Fano",
      action: { type: "web", value: "https://www.ambitofano.it/" },
    },
    {
      icon: "medkit-outline",
      title: "AST Pesaro Urbino",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.ast-pesarourbino.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Fano (0721 887483) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "AST Pesaro Urbino · Esenzioni ticket",
    url: "https://www.ast-pesarourbino.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
