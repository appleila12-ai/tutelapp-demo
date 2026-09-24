import type { ComuneConfig } from "./types";

// Comune di Mediglia (MI).
// Fonte: pagina "Servizi Sociali, Casa, Salute" del sito del Comune (settembre 2026).
// DA VERIFICARE con il Comune prima del pilota: punti di supporto sanitari
// del territorio (ASST Melegnano e Martesana) e riferimenti per la disabilità.
export const mediglia: ComuneConfig = {
  slug: "mediglia",
  tipo: "comune",
  nome: "Comune di Mediglia",
  nomeBreve: "Mediglia",
  delEnte: "del Comune di Mediglia",
  soggetto: "Il Comune",
  provincia: "MI",
  regione: "Lombardia",

  ente: "Servizi Sociali, Casa, Salute",
  responsabile: "Segretariato sociale · ricevimento su appuntamento",
  indirizzo: "Via Risorgimento 5, 20076 Mediglia (MI)",
  telefono: "02 9066201",
  email: "servizisociali@comune.mediglia.mi.it",
  pec: "comune.mediglia@pec.regione.lombardia.it",
  orari: "Lun, Mer, Ven 8:30–12:00 · Mar e Gio 8:30–12:00 e 16:00–17:30 · su appuntamento",
  sitoWeb: "https://www.comune.mediglia.mi.it/home/amministrazione/uffici/Ufficio-3.html",

  logo: null,

  theme: {
    warm: "#C3B4D9", // lavanda
    warmSoft: "#ECE6F4",
    warmDark: "#5B4682",
    cream: "#F6F4F1",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Segretariato sociale del Comune di Mediglia",
      subtitle:
        "Informazioni su prestazioni e benefici, assistenza domiciliare per anziani e persone con disabilità, pasti a domicilio · Via Risorgimento 5 · Tel. 02 9066201 · servizisociali@comune.mediglia.mi.it",
      action: { type: "tel", value: "029066201" },
    },
    {
      icon: "document-text-outline",
      title: "Modulistica dei Servizi Sociali",
      subtitle: "Domande e moduli online del Comune di Mediglia",
      action: { type: "web", value: "https://www.mediglia.sportellocivico.it/ModulisticaServiziSociali.aspx" },
    },
    {
      icon: "medkit-outline",
      title: "ASST Melegnano e della Martesana",
      subtitle: "Servizi sanitari del territorio: cure domiciliari (ADI), servizi per la fragilità e la disabilità",
      action: { type: "web", value: "https://www.asst-melegnano-martesana.it/servizi-territoriali" },
    },
  ],

  trasporto:
    "Chiedi al Segretariato sociale di Mediglia (02 9066201) quali servizi di trasporto sociale sono attivi. In Lombardia puoi rivolgerti anche alla Croce Rossa o alla Pubblica Assistenza della tua zona.",

  esenzioneTicket: {
    label: "ATS Città Metropolitana di Milano · Esenzioni",
    url: "https://www.ats-milano.it",
  },

  daVerificare: true,
};
