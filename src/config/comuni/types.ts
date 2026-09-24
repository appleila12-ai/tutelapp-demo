// ============================================================================
// SCHEDA COMUNE — struttura comune a tutti gli enti che usano TutelApp.
// ----------------------------------------------------------------------------
// Ogni Comune (o Unione di Comuni) ha UN file in questa cartella che esporta
// un oggetto `ComuneConfig`. Per aggiungere un nuovo Comune:
//   1. copia `_modello.ts` con il nome del Comune (es. `lerici.ts`)
//   2. compila i campi
//   3. aggiungilo all'elenco in `index.ts`
// Il link dedicato sarà: <indirizzo-app>/<slug>  (es. /lerici)
// ============================================================================

import type { IoniconsIconName } from "@react-native-vector-icons/ionicons";

export type PuntoSupporto = {
  icon: IoniconsIconName;
  title: string;
  subtitle: string;
  /** Azione al tocco: telefonata o apertura di un sito */
  action: { type: "tel" | "web"; value: string };
};

/** Un Comune che fa parte di un'Unione: il cittadino può sceglierlo come "il mio paese". */
export type Paese = {
  nome: string;
  indirizzo?: string;
  telefono?: string;
  email?: string;
  sitoWeb?: string;
};

export type ComuneConfig = {
  /** Identificativo nel link, minuscolo e senza spazi (es. "erba" → /erba) */
  slug: string;
  /** "comune" per un singolo Comune, "unione" per Unioni/aggregazioni */
  tipo: "comune" | "unione";
  /** Nome completo dell'ente (mostrato in prima linea) */
  nome: string;
  /** Etichetta breve (es. per header e frasi brevi) */
  nomeBreve: string;
  /** Forma con preposizione: "del Comune di Sarzana", "dell'Unione ..." */
  delEnte: string;
  /** Soggetto per frasi rassicuranti: "Il Comune", "L'Unione" */
  soggetto: string;
  /** Sigla provincia (es. "SP") */
  provincia: string;
  /** Regione: usata come regione predefinita in tutta l'app */
  regione: string;
  /** Per le Unioni: i Comuni aderenti con i recapiti del municipio */
  paesi?: Paese[];

  /** Servizio che segue la pratica e recapiti principali */
  ente: string;
  responsabile: string;
  indirizzo: string;
  telefono: string;
  email: string;
  pec?: string;
  orari: string;
  sitoWeb: string;

  /**
   * Logo/stemma dell'ente. Puoi usare:
   *  - un file locale:  require("@/assets/images/comuni/erba.png")
   *  - un indirizzo web: { uri: "https://.../logo.png" }
   *  - null → viene mostrato uno stemma segnaposto con l'iniziale
   */
  logo: number | { uri: string } | null;

  /** Colori dell'ente (toni caldi e chiari: il testo sopra resta scuro) */
  theme: {
    warm: string; // accento principale (bottoni)
    warmSoft: string; // sfondo tenue
    warmDark: string; // testo/icone di accento
    cream: string; // sfondo pagina
  };

  /** Servizi del territorio mostrati in "Punti di supporto" */
  puntiSupporto: PuntoSupporto[];

  /** Testo su trasporto sociale/sanitario per la pagina "Aiuti sul territorio" */
  trasporto: string;

  /** Azienda sanitaria locale: dove chiedere l'esenzione ticket per patologia */
  esenzioneTicket: { label: string; url: string };

  /**
   * true = alcuni dati vanno ancora confermati con l'ente.
   * Non viene mostrato ai cittadini: serve solo come promemoria interno.
   */
  daVerificare?: boolean;

  /**
   * true = Comune usato solo per le demo: NON ha aderito a TutelApp.
   * L'app mostra ai cittadini l'avviso "Versione dimostrativa".
   */
  dimostrativo?: boolean;
};
