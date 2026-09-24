import type { ComuneConfig } from "./types";

// Comune di Ventimiglia (IM).
// Fonti: pagina "Servizi Sociali" del sito del Comune e pagina del Distretto
// sanitario ventimigliese di ASL1 Liguria (settembre 2026).
// DA VERIFICARE con il Comune prima del pilota: email ordinaria dei Servizi
// Sociali (per ora è indicata la PEC), responsabile, punti di supporto.
export const ventimiglia: ComuneConfig = {
  slug: "ventimiglia",
  tipo: "comune",
  nome: "Comune di Ventimiglia",
  nomeBreve: "Ventimiglia",
  delEnte: "del Comune di Ventimiglia",
  soggetto: "Il Comune",
  provincia: "IM",
  regione: "Liguria",

  ente: "Servizi Sociali",
  responsabile: "Sportello Sociale del Comune",
  indirizzo: "Piazza della Libertà 3, 18039 Ventimiglia (IM)",
  telefono: "0184 6183217",
  email: "comune.ventimiglia@legalmail.it",
  pec: "comune.ventimiglia@legalmail.it",
  orari: "Sportello Sociale: Lun e Ven 9:00–13:00",
  sitoWeb:
    "https://www.comune.ventimiglia.im.it/en-us/amministrazione/uffici/servizi-sociali-7293-1-7cf2eb57d18ad47436be2a688ec202ed",

  logo: null,

  theme: {
    warm: "#9EC3D6", // azzurro mare
    warmSoft: "#E1EEF4",
    warmDark: "#2F5E78",
    cream: "#F4F5F1",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Sportello Sociale del Comune di Ventimiglia",
      subtitle:
        "Assistenza domiciliare, contributi per persone non autosufficienti, abbonamenti trasporto per persone con disabilità · Piazza della Libertà 3 · Tel. 0184 6183217 · Lun e Ven 9–13",
      action: { type: "tel", value: "01846183217" },
    },
    {
      icon: "medkit-outline",
      title: "ASL1 · Distretto sanitario ventimigliese",
      subtitle:
        "Punto Unico di Accesso (PUA) a Bordighera, via Aurelia 122 · accesso libero Lun, Mer, Ven 8–13 · Tel. 0184 534878",
      action: { type: "tel", value: "0184534878" },
    },
    {
      icon: "accessibility-outline",
      title: "Villa Olga · Servizi per la disabilità adulti",
      subtitle:
        "ASL1 a Ventimiglia, corso Genova 88: disabilità adulti, medicina legale (accertamenti di invalidità), consultorio",
      action: {
        type: "web",
        value: "https://www.asl1.liguria.it/territorio/distretti-sanitari/distretto-sanitario-ventimigliese.html",
      },
    },
  ],

  trasporto:
    "Il Comune di Ventimiglia rilascia abbonamenti per il trasporto alle persone con disabilità: chiedi allo Sportello Sociale (0184 6183217). In Liguria puoi rivolgerti anche alla Pubblica Assistenza (ANPAS) o alla Croce Rossa della tua zona.",

  esenzioneTicket: {
    label: "ASL1 Liguria · Esenzioni ticket",
    url: "https://www.asl1.liguria.it",
  },

  daVerificare: true,
};
