import type { ComuneConfig } from "../types";

// Comune di Castelfranco Veneto (TV) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const castelfrancoVeneto: ComuneConfig = {
  slug: "castelfranco-veneto",
  tipo: "comune",
  nome: "Comune di Castelfranco Veneto",
  nomeBreve: "Castelfranco Veneto",
  delEnte: "del Comune di Castelfranco Veneto",
  soggetto: "Il Comune",
  provincia: "TV",
  regione: "Veneto",

  ente: "Servizi Sociali",
  responsabile: "Settore II · Servizi alla Persona",
  indirizzo: "Via Francesco Maria Preti 36, 31033 Castelfranco Veneto (TV)",
  telefono: "0423 735525",
  email: "attivitasociali@comune.castelfranco-veneto.tv.it",
  pec: "comune.castelfrancoveneto.tv@pecveneto.it",
  orari: "Lun, Mar, Ven 10:00–12:30 · Gio 10:00–12:30 e 16:00–17:00 (su appuntamento)",
  sitoWeb: "https://www.comune.castelfrancoveneto.tv.it/amministrazione/unita_organizzativa/ufficio-assistenza-sociale-erp-asilo-nido/",

  logo: null,

  theme: {
    warm: "#7FA7D6",
    warmSoft: "#E0EAF6",
    warmDark: "#2E4F7A",
    cream: "#F2F5F9",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Castelfranco Veneto",
      subtitle: "Settore II · Servizi alla Persona · Via Francesco Maria Preti 36, 31033 Castelfranco Veneto (TV) · Tel. 0423 735525",
      action: { type: "tel", value: "0423735525" },
    },
    {
      icon: "business-outline",
      title: "Informazioni sui Servizi Sociali",
      subtitle: "Scheda del Comune con i servizi disponibili e come accedervi · Tel. 0423 735518",
      action: { type: "web", value: "https://www.comune.castelfrancoveneto.tv.it/documento_pubblico/informazioni-servizi-sociali/" },
    },
    {
      icon: "medkit-outline",
      title: "ULSS 2 Marca Trevigiana",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.aulss2.veneto.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Castelfranco Veneto (0423 735525) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ULSS 2 Marca Trevigiana · Esenzioni ticket",
    url: "https://www.aulss2.veneto.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
