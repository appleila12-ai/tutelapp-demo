import type { ComuneConfig } from "../types";

// Comune di Alba (CN) — VERSIONE DIMOSTRATIVA.
// Il Comune NON ha aderito a TutelApp: l'app lo segnala ai cittadini con un avviso.
// Dati presi dal sito ufficiale del Comune/ente (settembre 2026), da verificare.
export const alba: ComuneConfig = {
  slug: "alba",
  tipo: "comune",
  nome: "Comune di Alba",
  nomeBreve: "Alba",
  delEnte: "del Comune di Alba",
  soggetto: "Il Comune",
  provincia: "CN",
  regione: "Piemonte",

  ente: "Servizi Sociali",
  responsabile: "Servizi socio educativi",
  indirizzo: "Via Generale Govone 11, 12051 Alba (CN)",
  telefono: "0173 292243",
  email: "servizisociali@comune.alba.cn.it",
  pec: "comune.alba@cert.legalmail.it",
  orari: "Lun e Mar 8:30–12:30 · Gio 8:30–12:30 e 14:30–16:30 · Ven 8:30–12:00",
  sitoWeb: "https://www.comune.alba.cn.it/it/vivere/servizi-sociali-2",

  logo: null,

  theme: {
    warm: "#B49AC7",
    warmSoft: "#EEE6F4",
    warmDark: "#5A3E73",
    cream: "#F6F3F8",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Servizi Sociali – Alba",
      subtitle: "Servizi socio educativi · Via Generale Govone 11, 12051 Alba (CN) · Tel. 0173 292243",
      action: { type: "tel", value: "0173292243" },
    },
    {
      icon: "business-outline",
      title: "Consorzio Socio Assistenziale Alba – Langhe – Roero",
      subtitle: "Servizi per minori, famiglie, anziani e persone con disabilità · Via Armando Diaz 8, Alba",
      action: { type: "tel", value: "0173361017" },
    },
    {
      icon: "medkit-outline",
      title: "ASL CN2 Alba-Bra",
      subtitle: "Esenzione ticket per patologia e invalidità, prenotazioni e distretti sanitari",
      action: { type: "web", value: "https://www.aslcn2.it" },
    },
  ],

  trasporto: "Chiedi ai Servizi Sociali di Alba (0173 292243) quali servizi di trasporto sociale sono attivi. Puoi rivolgerti anche alle associazioni di volontariato della zona (Croce Rossa, Pubbliche Assistenze, Misericordie).",

  esenzioneTicket: {
    label: "ASL CN2 Alba-Bra · Esenzioni ticket",
    url: "https://www.aslcn2.it",
  },

  daVerificare: true,
  dimostrativo: true,
};
