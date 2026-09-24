import type { ComuneConfig } from "../types";

// Comune di Marsala (TP) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const marsala: ComuneConfig = {
  slug: "marsala",
  tipo: "comune",
  nome: "Comune di Marsala",
  nomeBreve: "Marsala",
  delEnte: "del Comune di Marsala",
  soggetto: "Il Comune",
  provincia: "TP",
  regione: "Sicilia",

  ente: "Servizi Sociali",
  responsabile: "Settore V · Servizi alla Persona",
  indirizzo: "Via Giuseppe Garibaldi 30, 91025 Marsala (TP)",
  telefono: "0923 993111",
  email: "protocollo@pec.comune.marsala.tp.it",
  pec: "protocollo@pec.comune.marsala.tp.it",
  orari: "Orari: vedi il sito del Comune o telefona",
  sitoWeb: "https://www.comune.marsala.tp.it/it/organizational_unit/settore-v-servizi-alla-persona",

  logo: null,

  theme: {
    warm: "#D4956F",
    warmSoft: "#F6E4D8",
    warmDark: "#77401F",
    cream: "#F9F4F0",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Marsala",
      subtitle: "Settore V · Servizi alla Persona · Via Giuseppe Garibaldi 30, 91025 Marsala (TP) · Tel. 0923 993111",
      action: { type: "tel", value: "0923993111" },
    },
    {
      icon: "business-outline",
      title: "Distretto Socio-Sanitario D52 Marsala–Petrosino",
      subtitle: "Servizi sociali associati e integrazione con l'ASP",
      action: { type: "web", value: "https://www.comune.marsala.tp.it/it/topics/assistenza-sociale" },
    },
    {
      icon: "medkit-outline",
      title: "ASP Trapani",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.asptrapani.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Marsala (0923 993111) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ASP Trapani · Esenzioni ticket",
    url: "https://www.asptrapani.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
