import type { ComuneConfig } from "../types";

// Comune di Monopoli (BA) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const monopoli: ComuneConfig = {
  slug: "monopoli",
  tipo: "comune",
  nome: "Comune di Monopoli",
  nomeBreve: "Monopoli",
  delEnte: "del Comune di Monopoli",
  soggetto: "Il Comune",
  provincia: "BA",
  regione: "Puglia",

  ente: "Servizi Sociali",
  responsabile: "Area V · Solidarietà Sociale",
  indirizzo: "Vico Acquaviva 19 (Palazzo San Giuseppe), 70043 Monopoli (BA)",
  telefono: "080 4140351",
  email: "comune@pec.comune.monopoli.ba.it",
  pec: "comune@pec.comune.monopoli.ba.it",
  orari: "Lun e Ven 8:30–11:30 · Gio 8:30–11:30 e 15:30–18:00",
  sitoWeb: "https://www.comune.monopoli.ba.it/Amministrazione/Uffici/Servizio-Sociale-Professionale",

  logo: null,

  theme: {
    warm: "#91B5D8",
    warmSoft: "#E3EDF7",
    warmDark: "#2F5476",
    cream: "#F3F6F9",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Monopoli",
      subtitle: "Area V · Solidarietà Sociale · Vico Acquaviva 19 (Palazzo San Giuseppe), 70043 Monopoli (BA) · Tel. 080 4140351",
      action: { type: "tel", value: "0804140351" },
    },
    {
      icon: "business-outline",
      title: "Ufficio di Piano – Ambito di Conversano",
      subtitle: "Assistenza domiciliare (SAD/ADI), centri diurni e RSA per Conversano, Monopoli, Polignano",
      action: { type: "tel", value: "0804140378" },
    },
    {
      icon: "medkit-outline",
      title: "ASL Bari",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.sanita.puglia.it/web/asl-bari" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Monopoli (080 4140351) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ASL Bari · Esenzioni ticket",
    url: "https://www.sanita.puglia.it/web/asl-bari",
  },

  daVerificare: true,
  dimostrativo: true,
};
