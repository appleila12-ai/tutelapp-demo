import type { ComuneConfig } from "../types";

// Comune di Lerici (SP) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const lerici: ComuneConfig = {
  slug: "lerici",
  tipo: "comune",
  nome: "Comune di Lerici",
  nomeBreve: "Lerici",
  delEnte: "del Comune di Lerici",
  soggetto: "Il Comune",
  provincia: "SP",
  regione: "Liguria",

  ente: "Servizi Sociali",
  responsabile: "Servizio Politiche Sociali e Istruzione",
  indirizzo: "Via Gerini 18, 19032 Lerici (SP)",
  telefono: "0187 960277",
  email: "sportello@comune.lerici.sp.it",
  pec: "comunedilerici@postecert.it",
  orari: "Mar e Ven 9:00–12:00",
  sitoWeb: "https://www.comune.lerici.sp.it/amministrazione/uffici/ufficio_22.html",

  logo: null,

  theme: {
    warm: "#8FB8C9",
    warmSoft: "#E2EEF3",
    warmDark: "#2F5F73",
    cream: "#F3F6F7",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Lerici",
      subtitle: "Servizio Politiche Sociali e Istruzione · Via Gerini 18, 19032 Lerici (SP) · Tel. 0187 960277",
      action: { type: "tel", value: "0187960277" },
    },
    {
      icon: "business-outline",
      title: "Sportello di Cittadinanza – Distretto Sociosanitario 18",
      subtitle: "Punto di accesso sociale: informazioni e orientamento sui servizi socio-sanitari · Mar, Gio, Sab 10–12",
      action: { type: "tel", value: "0187960237" },
    },
    {
      icon: "medkit-outline",
      title: "ASL5 Spezzino",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.asl5.liguria.it/PerilCittadino/Prenotazioniticketesenzioni/Esenzioneticket.aspx" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Lerici (0187 960277) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ASL5 Spezzino · Esenzioni ticket",
    url: "https://www.asl5.liguria.it/PerilCittadino/Prenotazioniticketesenzioni/Esenzioneticket.aspx",
  },

  daVerificare: true,
  dimostrativo: true,
};
