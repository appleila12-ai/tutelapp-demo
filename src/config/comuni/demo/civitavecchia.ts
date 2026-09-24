import type { ComuneConfig } from "../types";

// Comune di Civitavecchia (RM) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const civitavecchia: ComuneConfig = {
  slug: "civitavecchia",
  tipo: "comune",
  nome: "Comune di Civitavecchia",
  nomeBreve: "Civitavecchia",
  delEnte: "del Comune di Civitavecchia",
  soggetto: "Il Comune",
  provincia: "RM",
  regione: "Lazio",

  ente: "Servizi Sociali",
  responsabile: "Area 1 · Servizio Servizi Sociali",
  indirizzo: "Via Antonio da Sangallo 11, 00053 Civitavecchia (RM)",
  telefono: "0766 590790",
  email: "ufficiodipiano@comune.civitavecchia.rm.it",
  pec: "comune.civitavecchia@legalmail.it",
  orari: "Lun, Mer, Ven 10:00–12:00 · Mar e Gio 15:00–17:00",
  sitoWeb: "https://www.comune.civitavecchia.rm.it/it/unita_organizzative/sezione-servizi-sociali-ufficio-servizi-alla-persona-e-socio-assistenziali",

  logo: null,

  theme: {
    warm: "#88B3A0",
    warmSoft: "#E0EFE8",
    warmDark: "#355E4C",
    cream: "#F3F7F5",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Civitavecchia",
      subtitle: "Area 1 · Servizio Servizi Sociali · Via Antonio da Sangallo 11, 00053 Civitavecchia (RM) · Tel. 0766 590790",
      action: { type: "tel", value: "0766590790" },
    },
    {
      icon: "business-outline",
      title: "PUA – Punto Unico di Accesso, Distretto 1",
      subtitle: "Accesso ai servizi socio-sanitari · Viale Lazio 34/B · Lun–Sab 8–18",
      action: { type: "tel", value: "0696669353" },
    },
    {
      icon: "medkit-outline",
      title: "ASL Roma 4",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.aslroma4.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Civitavecchia (0766 590790) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ASL Roma 4 · Esenzioni ticket",
    url: "https://www.aslroma4.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
