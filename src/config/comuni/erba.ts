import type { ComuneConfig } from "./types";

// Comune di Erba (CO).
// Fonti: pagina "Servizi Sociali" del sito del Comune (settembre 2026) e
// recapiti ricevuti dal Settore Servizi al Cittadino.
// DA VERIFICARE con il Comune prima del pilota: orari, responsabile, punti di supporto.
export const erba: ComuneConfig = {
  slug: "erba",
  tipo: "comune",
  nome: "Comune di Erba",
  nomeBreve: "Erba",
  delEnte: "del Comune di Erba",
  soggetto: "Il Comune",
  provincia: "CO",
  regione: "Lombardia",

  ente: "Servizi Sociali",
  responsabile: "Settore Servizi al Cittadino · Servizi Sociali e Scolastici",
  indirizzo: "Viale Magni 10, 22036 Erba (CO)",
  telefono: "031 615540",
  email: "servizi.sociali@comune.erba.co.it",
  pec: "comune.erba@pec.provincia.como.it",
  orari: "Lun 16:00–19:00 · Mar 11:00–13:00 · Mer 9:30–15:00 · Gio 10:00–13:00 · Ven 11:00–13:00",
  sitoWeb:
    "https://www.comune.erba.co.it/it/page/servizi-sociali-3f385814-5f2d-4e97-a353-bc526dbe7d49",

  logo: null,

  theme: {
    warm: "#A9C9A4", // verde salvia
    warmSoft: "#E4EFE1",
    warmDark: "#3F6B3C",
    cream: "#F5F4EC",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali del Comune di Erba",
      subtitle:
        "Primo ascolto, assistenza domiciliare, orientamento tra servizi e diritti · Viale Magni 10 · Tel. 031 615540 · servizi.sociali@comune.erba.co.it",
      action: { type: "tel", value: "031615540" },
    },
    {
      icon: "business-outline",
      title: "Settore Servizi al Cittadino",
      subtitle:
        "Riferimento del Comune per i servizi alla persona e scolastici · Tel. 031 615301",
      action: { type: "tel", value: "031615301" },
    },
    {
      icon: "document-text-outline",
      title: "Amministratore di Sostegno — Provincia di Como",
      subtitle:
        "Informazioni per nominare chi tutela gli interessi di un familiare fragile",
      action: {
        type: "web",
        value:
          "http://www.provincia.como.it/temi/attivita-sociali/servizi-sociali/amministratore-sostegno",
      },
    },
  ],

  trasporto:
    "Chiedi ai Servizi Sociali di Erba (031 615540) quali servizi di trasporto sociale sono attivi. In Lombardia puoi rivolgerti anche alla Croce Rossa o alla Pubblica Assistenza della tua zona.",

  esenzioneTicket: {
    label: "ATS Insubria · Esenzioni ticket",
    url: "https://www.ats-insubria.it",
  },

  daVerificare: true,
};
