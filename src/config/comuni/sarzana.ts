import type { ComuneConfig } from "./types";

// Comune pilota. Dati già usati nella versione precedente dell'app.
export const sarzana: ComuneConfig = {
  slug: "sarzana",
  tipo: "comune",
  nome: "Comune di Sarzana",
  nomeBreve: "Sarzana",
  delEnte: "del Comune di Sarzana",
  soggetto: "Il Comune",
  provincia: "SP",
  regione: "Liguria",

  ente: "Servizi Sociali e Welfare",
  responsabile: "Area 1 · Servizi alla Persona",
  indirizzo: "Piazza Don Ricchetti, 19038 Sarzana (SP)",
  telefono: "0187 614456",
  email: "servizi.sociali@comune.sarzana.sp.it",
  orari: "Lun–Ven 9:00–12:30 · Gio anche 14:30–16:30",
  sitoWeb: "https://www.comune.sarzana.sp.it/servizi-sociali.html",

  logo: null,

  theme: {
    warm: "#E3A94A", // ambra
    warmSoft: "#F7E7C6",
    warmDark: "#A86F1F",
    cream: "#F7F3EA",
  },

  puntiSupporto: [
    {
      icon: "people-outline",
      title: "Segretariato Sociale del Comune",
      subtitle:
        "Primo ascolto gratuito: ti orienta tra servizi, pratiche e diritti · Tel. 0187 614454 · servizi.sociali@comune.sarzana.sp.it",
      action: { type: "tel", value: "0187614454" },
    },
    {
      icon: "home-outline",
      title: "Sportello CAAD",
      subtitle:
        "Consulenza per adattare la casa e superare le barriere architettoniche · Riferimento provinciale: Punto Servizi Disabilità, via Gramsci 211, La Spezia · su appuntamento al 0187 702556 · Lun–Ven 8:30–12:30",
      action: { type: "tel", value: "0187702556" },
    },
    {
      icon: "medkit-outline",
      title: "Servizio di Assistenza Domiciliare (SAD)",
      subtitle:
        "Aiuto a casa per cura della persona e vita quotidiana · Si richiede ai Servizi Sociali tramite il Segretariato (Istanza unica + ISEE) · Tel. 0187 614454",
      action: {
        type: "web",
        value:
          "https://www.comune.sarzana.sp.it/servizi/salute-benessere-e-assistenza/assistenza-domiciliare.html",
      },
    },
    {
      icon: "document-text-outline",
      title: "Sportello per l'Amministratore di Sostegno",
      subtitle:
        "Informazioni e aiuto per nominare chi tutela gli interessi di un familiare fragile · Tribunale della Spezia, Cancelleria Volontaria Giurisdizione · 0187 595403 / 595410 · sportello telefonico Lun–Sab 12:00–13:30",
      action: { type: "tel", value: "0187595403" },
    },
  ],

  trasporto:
    "Pubblica Assistenza Sarzana — Via Falcinello 2, tel. 0187 620200. In altre zone della Liguria cerca la Pubblica Assistenza (ANPAS) o la Croce Rossa del tuo Comune.",

  esenzioneTicket: {
    label: "ASL 5 Spezzino · Esenzione ticket",
    url: "https://www.asl5.liguria.it/PerilCittadino/Prenotazioniticketesenzioni/Esenzioneticket.aspx",
  },
};
