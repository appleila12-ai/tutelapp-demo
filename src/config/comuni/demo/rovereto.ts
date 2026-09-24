import type { ComuneConfig } from "../types";

// Comune di Rovereto (TN) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const rovereto: ComuneConfig = {
  slug: "rovereto",
  tipo: "comune",
  nome: "Comune di Rovereto",
  nomeBreve: "Rovereto",
  delEnte: "del Comune di Rovereto",
  soggetto: "Il Comune",
  provincia: "TN",
  regione: "Trentino-Alto Adige",

  ente: "Servizi Sociali",
  responsabile: "Comunità della Vallagarina · Servizio Socio-Assistenziale",
  indirizzo: "Via Pasqui 10, 38068 Rovereto (TN)",
  telefono: "0464 089910",
  email: "servizio.sociale@comunitadellavallagarina.tn.it",
  pec: "comunerovereto.tn@legalmail.it",
  orari: "Orari: vedi il sito del Comune o telefona",
  sitoWeb: "https://www.comunitadellavallagarina.tn.it/Amministrazione/Uffici/Socio-Assistenziale",

  logo: null,

  theme: {
    warm: "#A3B86C",
    warmSoft: "#EBF1DA",
    warmDark: "#4B5E1E",
    cream: "#F5F7EF",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Rovereto",
      subtitle: "Comunità della Vallagarina · Servizio Socio-Assistenziale · Via Pasqui 10, 38068 Rovereto (TN) · Tel. 0464 089910",
      action: { type: "tel", value: "0464089910" },
    },
    {
      icon: "business-outline",
      title: "Spazio Argento – Comunità della Vallagarina",
      subtitle: "Punto di riferimento per anziani, familiari e caregiver",
      action: { type: "web", value: "https://www.comunitadellavallagarina.tn.it/Novita/Avvisi/SPAZIO-ARGENTO" },
    },
    {
      icon: "medkit-outline",
      title: "APSS Trento",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.apss.tn.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Rovereto (0464 089910) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "APSS Trento · Esenzioni ticket",
    url: "https://www.apss.tn.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
