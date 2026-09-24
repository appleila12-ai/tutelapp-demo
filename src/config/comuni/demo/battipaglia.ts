import type { ComuneConfig } from "../types";

// Comune di Battipaglia (SA) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const battipaglia: ComuneConfig = {
  slug: "battipaglia",
  tipo: "comune",
  nome: "Comune di Battipaglia",
  nomeBreve: "Battipaglia",
  delEnte: "del Comune di Battipaglia",
  soggetto: "Il Comune",
  provincia: "SA",
  regione: "Campania",

  ente: "Servizi Sociali",
  responsabile: "Servizio Politiche Sociali e Servizi di Ambito S4_01",
  indirizzo: "Piazza Aldo Moro, 84091 Battipaglia (SA)",
  telefono: "0828 677417",
  email: "segreteriapolitichesociali@comune.battipaglia.sa.it",
  pec: "pecprotocollo@cert.comune.battipaglia.sa.it",
  orari: "Orari: vedi il sito del Comune o telefona",
  sitoWeb: "https://www.comune.battipaglia.sa.it/it/struttura/servizio-politiche-sociali-e-servizi-di-ambito-s4-01",

  logo: null,

  theme: {
    warm: "#C7A26B",
    warmSoft: "#F3E9D8",
    warmDark: "#6A4F22",
    cream: "#F8F5EF",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Battipaglia",
      subtitle: "Servizio Politiche Sociali e Servizi di Ambito S4_01 · Piazza Aldo Moro, 84091 Battipaglia (SA) · Tel. 0828 677417",
      action: { type: "tel", value: "0828677417" },
    },
    {
      icon: "business-outline",
      title: "Ambito Territoriale S04_1 – Piano di Zona",
      subtitle: "Servizi sociali associati con capofila Battipaglia",
      action: { type: "web", value: "https://www.comune.battipaglia.sa.it/it/argomenti/assistenza-sociale" },
    },
    {
      icon: "medkit-outline",
      title: "ASL Salerno",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.aslsalerno.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Battipaglia (0828 677417) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ASL Salerno · Esenzioni ticket",
    url: "https://www.aslsalerno.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
