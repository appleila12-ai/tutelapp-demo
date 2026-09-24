// Comuni DIMOSTRATIVI: enti reali che non hanno (ancora) aderito a TutelApp.
// Servono per le demo online. L'app mostra in ogni pagina iniziale l'avviso
// "Versione dimostrativa". Per nasconderli tutti: EXPO_PUBLIC_COMUNI_DEMO=no.
// Quando un Comune aderisce: sposta il suo file in `comuni/`, togli
// `dimostrativo: true` e aggiungilo all'elenco principale.

import type { ComuneConfig } from "../types";
import { lerici } from "./lerici";
import { chiavari } from "./chiavari";
import { alba } from "./alba";
import { pinerolo } from "./pinerolo";
import { lecco } from "./lecco";
import { bassanoDelGrappa } from "./bassano-del-grappa";
import { castelfrancoVeneto } from "./castelfranco-veneto";
import { rovereto } from "./rovereto";
import { carpi } from "./carpi";
import { imola } from "./imola";
import { pontedera } from "./pontedera";
import { empoli } from "./empoli";
import { frascati } from "./frascati";
import { civitavecchia } from "./civitavecchia";
import { fano } from "./fano";
import { cittaDiCastello } from "./citta-di-castello";
import { battipaglia } from "./battipaglia";
import { monopoli } from "./monopoli";
import { marsala } from "./marsala";
import { olbia } from "./olbia";

export const COMUNI_DEMO: ComuneConfig[] = [
  lerici,
  chiavari,
  alba,
  pinerolo,
  lecco,
  bassanoDelGrappa,
  castelfrancoVeneto,
  rovereto,
  carpi,
  imola,
  pontedera,
  empoli,
  frascati,
  civitavecchia,
  fano,
  cittaDiCastello,
  battipaglia,
  monopoli,
  marsala,
  olbia,
];
