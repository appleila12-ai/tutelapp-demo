// Elenco dei Comuni che usano TutelApp.
// Per aggiungerne uno: crea il file (partendo da `_modello.ts`) e aggiungilo qui.

import type { ComuneConfig } from "./types";
import { sarzana } from "./sarzana";
import { erba } from "./erba";
import { vigneEVini } from "./vigne-e-vini";
import { ventimiglia } from "./ventimiglia";
import { mediglia } from "./mediglia";
import { COMUNI_DEMO } from "./demo";

export type { ComuneConfig, Paese, PuntoSupporto } from "./types";

/** Enti che hanno aderito (o in pilota). */
export const COMUNI_ADERENTI: ComuneConfig[] = [sarzana, erba, vigneEVini, ventimiglia, mediglia];

/**
 * Comuni dimostrativi (cartella `demo/`): visibili salvo
 * EXPO_PUBLIC_COMUNI_DEMO=no (es. per la versione ufficiale).
 */
const MOSTRA_DEMO = (process.env.EXPO_PUBLIC_COMUNI_DEMO || "").toLowerCase() !== "no";

export const COMUNI: ComuneConfig[] = MOSTRA_DEMO
  ? [...COMUNI_ADERENTI, ...COMUNI_DEMO]
  : COMUNI_ADERENTI;

/** Comune usato quando il link non ne indica nessuno */
export const COMUNE_PREDEFINITO =
  (process.env.EXPO_PUBLIC_COMUNE as string | undefined)?.toLowerCase() || "sarzana";

export function trovaComune(slug: string | null | undefined): ComuneConfig | undefined {
  if (!slug) return undefined;
  const s = slug.toLowerCase().trim();
  return COMUNI.find((c) => c.slug === s);
}
