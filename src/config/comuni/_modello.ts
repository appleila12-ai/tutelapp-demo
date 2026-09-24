import type { ComuneConfig } from "./types";

// ============================================================================
// MODELLO — copia questo file per aggiungere un nuovo Comune.
// Poi aggiungi il nuovo Comune all'elenco in `index.ts`.
// (Questo modello NON è nell'elenco: non compare nell'app.)
// ============================================================================
export const modello: ComuneConfig = {
  slug: "nome-comune", // → link: <indirizzo-app>/nome-comune
  tipo: "comune",
  nome: "Comune di Nome",
  nomeBreve: "Nome",
  delEnte: "del Comune di Nome",
  soggetto: "Il Comune",
  provincia: "XX",
  regione: "Liguria", // deve essere scritta come nell'elenco delle regioni

  ente: "Servizi Sociali",
  responsabile: "Ufficio / Area di riferimento",
  indirizzo: "Via ..., CAP Città (XX)",
  telefono: "000 000000",
  email: "servizi.sociali@comune.nome.it",
  pec: "",
  orari: "Lun–Ven 9:00–12:00",
  sitoWeb: "https://www.comune.nome.it",

  logo: null, // es. require("@/assets/images/comuni/nome.png")

  theme: {
    warm: "#E3A94A",
    warmSoft: "#F7E7C6",
    warmDark: "#A86F1F",
    cream: "#F7F3EA",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Segretariato Sociale",
      subtitle: "Primo ascolto gratuito · Tel. ...",
      action: { type: "tel", value: "0000000000" },
    },
  ],

  trasporto:
    "Chiedi ai Servizi Sociali del Comune quali servizi di trasporto sociale sono attivi.",

  esenzioneTicket: {
    label: "ASL di riferimento · Esenzione ticket",
    url: "https://www.salute.gov.it",
  },

  daVerificare: true,
};
