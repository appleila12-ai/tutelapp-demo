import type { ComuneConfig } from "../types";

// Comune di Olbia (SS) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const olbia: ComuneConfig = {
  slug: "olbia",
  tipo: "comune",
  nome: "Comune di Olbia",
  nomeBreve: "Olbia",
  delEnte: "del Comune di Olbia",
  soggetto: "Il Comune",
  provincia: "SS",
  regione: "Sardegna",

  ente: "Servizi Sociali",
  responsabile: "Settore Servizi alla Persona",
  indirizzo: "Via Perugia 3, 07026 Olbia (SS)",
  telefono: "0789 52172",
  email: "servizi.alla.persona@pec.comuneolbia.it",
  pec: "protocollo@pec.comuneolbia.it",
  orari: "Lun–Ven 9:30–12:30 · Lun–Gio 15:00–17:00",
  sitoWeb: "https://www.comune.olbia.ot.it/it/page/14793",

  logo: null,

  theme: {
    warm: "#7FB5B5",
    warmSoft: "#DEEFEF",
    warmDark: "#2C6262",
    cream: "#F2F7F7",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Olbia",
      subtitle: "Settore Servizi alla Persona · Via Perugia 3, 07026 Olbia (SS) · Tel. 0789 52172",
      action: { type: "tel", value: "078952172" },
    },
    {
      icon: "business-outline",
      title: "PLUS – Distretto di Olbia",
      subtitle: "Programmazione unitaria dei servizi alla persona del distretto",
      action: { type: "web", value: "https://www.comune.olbia.ot.it/it/page/settore-servizi-alla-persona-2320431a-7688-4ac7-beb8-bdc96af489da" },
    },
    {
      icon: "medkit-outline",
      title: "ASL Gallura",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.aslgallura.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Olbia (0789 52172) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ASL Gallura · Esenzioni ticket",
    url: "https://www.aslgallura.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
