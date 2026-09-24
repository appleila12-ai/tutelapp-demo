import type { ComuneConfig } from "../types";

// Comune di Pontedera (PI) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const pontedera: ComuneConfig = {
  slug: "pontedera",
  tipo: "comune",
  nome: "Comune di Pontedera",
  nomeBreve: "Pontedera",
  delEnte: "del Comune di Pontedera",
  soggetto: "Il Comune",
  provincia: "PI",
  regione: "Toscana",

  ente: "Servizi Sociali",
  responsabile: "Servizi Sociali · gestione associata Unione Valdera",
  indirizzo: "Via Fratelli Bandiera 11, 56025 Pontedera (PI)",
  telefono: "0587 299111",
  email: "sociale@unione.valdera.pi.it",
  pec: "pontedera@postacert.toscana.it",
  orari: "Segretariato Sociale: Ven 8:30–13:00",
  sitoWeb: "https://www.comune.pontedera.pi.it/servizi/assistenza/",

  logo: null,

  theme: {
    warm: "#C99A7F",
    warmSoft: "#F4E6DD",
    warmDark: "#6E4630",
    cream: "#F8F4F1",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Pontedera",
      subtitle: "Servizi Sociali · gestione associata Unione Valdera · Via Fratelli Bandiera 11, 56025 Pontedera (PI) · Tel. 0587 299111",
      action: { type: "tel", value: "0587299111" },
    },
    {
      icon: "business-outline",
      title: "Punto Insieme – Distretto di Pontedera",
      subtitle: "Primo accesso ai servizi socio-sanitari e alla non autosufficienza · Via Fleming 1 · Lun e Gio 10–12",
      action: { type: "web", value: "http://www.sdsvaldera.it/" },
    },
    {
      icon: "medkit-outline",
      title: "Azienda USL Toscana Nord Ovest",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.uslnordovest.toscana.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Pontedera (0587 299111) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "Azienda USL Toscana Nord Ovest · Esenzioni ticket",
    url: "https://www.uslnordovest.toscana.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
