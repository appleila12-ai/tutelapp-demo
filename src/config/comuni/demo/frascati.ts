import type { ComuneConfig } from "../types";

// Comune di Frascati (RM) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const frascati: ComuneConfig = {
  slug: "frascati",
  tipo: "comune",
  nome: "Comune di Frascati",
  nomeBreve: "Frascati",
  delEnte: "del Comune di Frascati",
  soggetto: "Il Comune",
  provincia: "RM",
  regione: "Lazio",

  ente: "Servizi Sociali",
  responsabile: "Settore III · Servizio Attività Sociali e Assistenziali",
  indirizzo: "Via Matteotti, 00044 Frascati (RM)",
  telefono: "06 94184552",
  email: "servizisociali@comune.frascati.rm.it",
  pec: "protocollofrascati@legalmail.it",
  orari: "Mar e Ven 9:00–12:00 · Gio 15:00–17:30",
  sitoWeb: "https://www.comune.frascati.rm.it/amministrazione/uffici/ufficio_35.html",

  logo: null,

  theme: {
    warm: "#D6A2B8",
    warmSoft: "#F6E4EC",
    warmDark: "#7A3656",
    cream: "#F9F3F6",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Frascati",
      subtitle: "Settore III · Servizio Attività Sociali e Assistenziali · Via Matteotti, 00044 Frascati (RM) · Tel. 06 94184552",
      action: { type: "tel", value: "0694184552" },
    },
    {
      icon: "business-outline",
      title: "PUA – Punto Unico di Accesso, Distretto di Frascati",
      subtitle: "Accesso integrato ai servizi socio-sanitari (ASL Roma 6)",
      action: { type: "web", value: "https://www.aslroma6.it" },
    },
    {
      icon: "medkit-outline",
      title: "ASL Roma 6",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.aslroma6.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Frascati (06 94184552) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ASL Roma 6 · Esenzioni ticket",
    url: "https://www.aslroma6.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
