import type { ComuneConfig } from "../types";

// Comune di Pinerolo (TO) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const pinerolo: ComuneConfig = {
  slug: "pinerolo",
  tipo: "comune",
  nome: "Comune di Pinerolo",
  nomeBreve: "Pinerolo",
  delEnte: "del Comune di Pinerolo",
  soggetto: "Il Comune",
  provincia: "TO",
  regione: "Piemonte",

  ente: "Servizi Sociali",
  responsabile: "Settore Servizi alla Persona ed alle Imprese",
  indirizzo: "Via Cesare Battisti 6, 10064 Pinerolo (TO)",
  telefono: "0121 361232",
  email: "pol.sociali@comune.pinerolo.to.it",
  pec: "protocollo.pinerolo@cert.ruparpiemonte.it",
  orari: "Lun 14:30–15:30 · Mar e Gio 9:30–11:30 e 14:30–15:30 · Mer 9:30–11:30",
  sitoWeb: "https://www.comune.pinerolo.to.it/amministrazione/ufficio-politiche-sociali-abitative-lavoro",

  logo: null,

  theme: {
    warm: "#9CC5A1",
    warmSoft: "#E3F1E5",
    warmDark: "#3C6B43",
    cream: "#F4F7F2",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Pinerolo",
      subtitle: "Settore Servizi alla Persona ed alle Imprese · Via Cesare Battisti 6, 10064 Pinerolo (TO) · Tel. 0121 361232",
      action: { type: "tel", value: "0121361232" },
    },
    {
      icon: "business-outline",
      title: "C.I.S.S. Pinerolese",
      subtitle: "Consorzio intercomunale: servizi per minori, adulti, persone con disabilità e anziani · Via Cesare Battisti 6",
      action: { type: "tel", value: "0121325001" },
    },
    {
      icon: "medkit-outline",
      title: "ASL TO3",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.aslto3.piemonte.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Pinerolo (0121 361232) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ASL TO3 · Esenzioni ticket",
    url: "https://www.aslto3.piemonte.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
