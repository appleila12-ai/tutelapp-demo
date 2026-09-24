import type { ComuneConfig } from "./types";

// Unione Collinare "Vigne e Vini" (AT) — 12 Comuni, sede a Incisa Scapaccino.
// Un'unica istanza dell'app per tutti i Comuni dell'Unione.
// I servizi socio-assistenziali del territorio sono gestiti dal Consorzio
// C.I.S.A. Asti Sud (Nizza Monferrato), quindi è il contatto principale.
// Fonti: sito dell'Unione (vignevini.at.it) e scheda del C.I.S.A. Asti Sud (settembre 2026).
// DA VERIFICARE con l'Unione prima del pilota: contatto di riferimento, orari.
export const vigneEVini: ComuneConfig = {
  slug: "vigne-e-vini",
  tipo: "unione",
  nome: "Unione Collinare Vigne e Vini",
  nomeBreve: "Vigne e Vini",
  delEnte: "dell'Unione Collinare Vigne e Vini",
  soggetto: "L'Unione",
  provincia: "AT",
  regione: "Piemonte",
  // Recapiti dei municipi dai siti ufficiali dei Comuni (settembre 2026)
  paesi: [
    { nome: "Bruno", indirizzo: "Via Duca d'Aosta 34", telefono: "0141 764124", email: "segreteria@comune.bruno.at.it", sitoWeb: "https://www.comune.bruno.at.it" },
    { nome: "Calamandrana", indirizzo: "Via Roma 83", telefono: "0141 75114", sitoWeb: "https://www.comune.calamandrana.at.it" },
    { nome: "Castelletto Molina", indirizzo: "Piazza IV Novembre 4", telefono: "0141 739198", sitoWeb: "https://www.comune.castellettomolina.at.it" },
    { nome: "Castelnuovo Belbo", indirizzo: "Piazza Municipio 1", telefono: "0141 799155", email: "segreteria@comune.castelnuovobelbo.at.it", sitoWeb: "https://comune.castelnuovobelbo.at.it" },
    { nome: "Cortiglione", sitoWeb: "http://www.comune.cortiglione.at.it" }, // recapiti da completare
    { nome: "Fontanile", indirizzo: "Piazza San Giovanni Battista 1", telefono: "0141 739100", sitoWeb: "https://www.comune.fontanile.at.it" },
    { nome: "Incisa Scapaccino", indirizzo: "Piazza Ferraro 13", telefono: "0141 74040", email: "protocollo@comune.incisascapaccino.at.it", sitoWeb: "https://www.comune.incisascapaccino.at.it" },
    { nome: "Maranzana", indirizzo: "Via Giacomo Bove 36", telefono: "0141 77931", email: "segreteria@comune.maranzana.at.it", sitoWeb: "https://www.comune.maranzana.at.it" },
    { nome: "Mombaruzzo", indirizzo: "Piazza Marconi 1", telefono: "0141 77002", sitoWeb: "https://www.comune.mombaruzzo.at.it" },
    { nome: "Nizza Monferrato", indirizzo: "Piazza Martiri d'Alessandria 19", telefono: "0141 720511", sitoWeb: "https://www.comune.nizza.asti.it/it/page/servizi-sociali-3e8661af-50b3-4c91-8e93-11d7d9202174" },
    { nome: "Quaranti", indirizzo: "Via Roma 14", telefono: "0141 793939", sitoWeb: "https://www.comune.quaranti.at.it" },
    { nome: "Vaglio Serra", indirizzo: "Via Castello 2", telefono: "0141 732024", email: "protocollo@comune.vaglioserra.at.it", sitoWeb: "https://comune.vaglioserra.at.it" },
  ],

  ente: "Servizi socio-assistenziali · C.I.S.A. Asti Sud",
  responsabile: "Consorzio che segue i servizi sociali dei Comuni dell'Unione",
  indirizzo: "Via Gozzellini 56, 14049 Nizza Monferrato (AT)",
  telefono: "0141 720400",
  email: "info@cisaastisud.it",
  pec: "cisaastisud@legalmail.it",
  orari: "Chiama per conoscere orari e sportello più vicino",
  sitoWeb: "https://www.cisaastisud.it/",

  logo: null,

  theme: {
    warm: "#DDA7AC", // rosato vino
    warmSoft: "#F4E1E2",
    warmDark: "#7A2E3B",
    cream: "#F7F2EC",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Consorzio C.I.S.A. Asti Sud — Servizi Sociali",
      subtitle:
        "Assistenti sociali del territorio, assistenza domiciliare, percorsi per la disabilità · Via Gozzellini 56, Nizza Monferrato · Tel. 0141 720400 · info@cisaastisud.it",
      action: { type: "tel", value: "0141720400" },
    },
    {
      icon: "business-outline",
      title: "Unione Collinare Vigne e Vini",
      subtitle:
        "Sede dell'Unione dei 12 Comuni · Via del Molino 10, Incisa Scapaccino · Tel. 0141 747766 · info@vignevini.at.it",
      action: { type: "tel", value: "0141747766" },
    },
    {
      icon: "globe-outline",
      title: "Sito del Consorzio C.I.S.A. Asti Sud",
      subtitle: "Servizi, moduli e sedi del consorzio socio-assistenziale",
      action: { type: "web", value: "https://www.cisaastisud.it/" },
    },
  ],

  trasporto:
    "Chiedi al C.I.S.A. Asti Sud (0141 720400) o al tuo Comune quali servizi di trasporto sociale sono attivi. In Piemonte puoi rivolgerti anche alla Croce Rossa o alla Pubblica Assistenza della tua zona.",

  esenzioneTicket: {
    label: "ASL AT Asti · Esenzioni ticket",
    url: "https://www.asl.at.it",
  },

  daVerificare: true,
};
