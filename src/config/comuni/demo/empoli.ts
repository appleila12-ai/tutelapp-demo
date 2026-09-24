import type { ComuneConfig } from "../types";

// Comune di Empoli (FI) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const empoli: ComuneConfig = {
  slug: "empoli",
  tipo: "comune",
  nome: "Comune di Empoli",
  nomeBreve: "Empoli",
  delEnte: "del Comune di Empoli",
  soggetto: "Il Comune",
  provincia: "FI",
  regione: "Toscana",

  ente: "Servizi Sociali",
  responsabile: "Unione dei Comuni Circondario dell'Empolese Valdelsa · Servizio Sociale",
  indirizzo: "Piazza della Vittoria 54, 50053 Empoli (FI)",
  telefono: "0571 980311",
  email: "sociale@comune.empoli.fi.it",
  pec: "comune.empoli@postacert.toscana.it",
  orari: "Orari: vedi il sito del Comune o telefona",
  sitoWeb: "https://www.comune.empoli.fi.it/Servizi/Servizio-Sociale-e-Casa",

  logo: null,

  theme: {
    warm: "#9FA8DA",
    warmSoft: "#E6E8F6",
    warmDark: "#3A437A",
    cream: "#F4F4F9",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Empoli",
      subtitle: "Unione dei Comuni Circondario dell'Empolese Valdelsa · Servizio Sociale · Piazza della Vittoria 54, 50053 Empoli (FI) · Tel. 0571 980311",
      action: { type: "tel", value: "0571980311" },
    },
    {
      icon: "business-outline",
      title: "Società della Salute Empolese Valdarno Valdelsa",
      subtitle: "Servizi sociosanitari integrati · Via dei Cappuccini 79, Empoli",
      action: { type: "tel", value: "05717051" },
    },
    {
      icon: "medkit-outline",
      title: "Azienda USL Toscana Centro",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.uslcentro.toscana.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Empoli (0571 980311) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "Azienda USL Toscana Centro · Esenzioni ticket",
    url: "https://www.uslcentro.toscana.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
