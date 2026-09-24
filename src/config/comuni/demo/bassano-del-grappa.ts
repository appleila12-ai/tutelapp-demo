import type { ComuneConfig } from "../types";

// Comune di Bassano del Grappa (VI) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const bassanoDelGrappa: ComuneConfig = {
  slug: "bassano-del-grappa",
  tipo: "comune",
  nome: "Comune di Bassano del Grappa",
  nomeBreve: "Bassano del Grappa",
  delEnte: "del Comune di Bassano del Grappa",
  soggetto: "Il Comune",
  provincia: "VI",
  regione: "Veneto",

  ente: "Servizi Sociali",
  responsabile: "Servizi Sociali · Segretariato Sociale",
  indirizzo: "Via Jacopo da Ponte 37, 36061 Bassano del Grappa (VI)",
  telefono: "0424 519125",
  email: "protocollo.comune.bassanodelgrappa@pecveneto.it",
  pec: "protocollo.comune.bassanodelgrappa@pecveneto.it",
  orari: "Mar 9:00–13:00 · Gio 9:00–13:00 e 16:00–18:15",
  sitoWeb: "http://www.comune.bassano.vi.it/Comune/Struttura-Organizzativa/Uffici/Segretariato-Sociale",

  logo: null,

  theme: {
    warm: "#C9B26B",
    warmSoft: "#F3EDD6",
    warmDark: "#6B5A1F",
    cream: "#F7F5EC",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Bassano del Grappa",
      subtitle: "Servizi Sociali · Segretariato Sociale · Via Jacopo da Ponte 37, 36061 Bassano del Grappa (VI) · Tel. 0424 519125",
      action: { type: "tel", value: "0424519125" },
    },
    {
      icon: "medkit-outline",
      title: "ULSS 7 Pedemontana",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.aulss7.veneto.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Bassano del Grappa (0424 519125) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ULSS 7 Pedemontana · Esenzioni ticket",
    url: "https://www.aulss7.veneto.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
