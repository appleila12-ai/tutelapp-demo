// ============================================================================
// COMUNE ATTIVO — TutelApp multi-Comune (white-label)
// ----------------------------------------------------------------------------
// Le schede dei Comuni sono in `src/config/comuni/`. Questo file decide QUALE
// Comune è attivo e lo espone a tutta l'app come `comune`.
//
// Come viene scelto il Comune (in ordine):
//   1. link con parametro      →  ?comune=erba
//   2. link con percorso       →  /erba
//   3. sottodominio            →  erba.tutelapp.it
//   4. ultima scelta salvata sul dispositivo
//   5. Comune fissato per l'installazione (EXPO_PUBLIC_COMUNE)
//   6. nessuno dei precedenti → la Home apre "Scegli il tuo Comune"
//      (nel frattempo, dietro le quinte, resta attivo Sarzana)
//
// `comune` si legge come prima (comune.nome, comune.telefono, ...) ma riflette
// sempre il Comune attivo: nessuna pagina deve importare un Comune specifico.
// ============================================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import {
  COMUNE_PREDEFINITO,
  COMUNI,
  trovaComune,
  type ComuneConfig,
} from "./comuni";

export type { ComuneConfig, Paese, PuntoSupporto } from "./comuni";
export { COMUNI } from "./comuni";

const SCELTA_KEY = "tutelapp:comuneAttivo";

/** Il Comune che usava l'app prima del multi-Comune: i suoi dati restano dove sono. */
const COMUNE_STORICO = "sarzana";

let attivo: ComuneConfig = trovaComune(COMUNE_PREDEFINITO) ?? COMUNI[0];

/**
 * true quando il Comune è stato davvero indicato: dal link (/erba, ?comune=),
 * da una scelta precedente salvata, oppure fissato per questa installazione
 * con EXPO_PUBLIC_COMUNE. Se è false, l'app mostra prima "Scegli il tuo Comune"
 * invece di aprire un Comune a caso.
 */
let scelto = Boolean(process.env.EXPO_PUBLIC_COMUNE && trovaComune(process.env.EXPO_PUBLIC_COMUNE));
const listeners = new Set<(c: ComuneConfig) => void>();

// ---------- Lettura del Comune dal link (solo web, sincrona) ----------
function slugDalLink(): string | undefined {
  if (Platform.OS !== "web" || typeof window === "undefined") return undefined;
  try {
    const { search, pathname, hostname } = window.location;

    const q = new URLSearchParams(search).get("comune");
    if (trovaComune(q)) return q!.toLowerCase();

    const primo = pathname.split("/").filter(Boolean)[0];
    if (trovaComune(primo)) return primo.toLowerCase();

    const sotto = hostname.split(".")[0];
    if (hostname.split(".").length > 2 && trovaComune(sotto)) return sotto.toLowerCase();
  } catch {
    /* ignora */
  }
  return undefined;
}

function sceltaSalvataWeb(): string | undefined {
  try {
    if (typeof window === "undefined" || !window.localStorage) return undefined;
    const v = window.localStorage.getItem(SCELTA_KEY);
    return trovaComune(v) ? v! : undefined;
  } catch {
    return undefined;
  }
}

function salvaScelta(slug: string) {
  if (Platform.OS === "web") {
    try {
      window.localStorage?.setItem(SCELTA_KEY, slug);
    } catch {
      /* ignora */
    }
  }
  AsyncStorage.setItem(SCELTA_KEY, slug).catch(() => {});
}

// Sul web il Comune si conosce subito, prima che le pagine vengano disegnate.
if (Platform.OS === "web") {
  const dalLink = slugDalLink();
  const trovato = trovaComune(dalLink ?? sceltaSalvataWeb());
  if (trovato) {
    attivo = trovato;
    scelto = true;
  }
  if (dalLink) salvaScelta(dalLink);
}

/**
 * Su telefono (app nativa) l'ultima scelta si legge in modo asincrono.
 * Va chiamata una volta all'avvio, prima di mostrare le pagine.
 */
export async function caricaComuneSalvato(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const v = await AsyncStorage.getItem(SCELTA_KEY);
    const trovato = trovaComune(v);
    if (trovato) {
      attivo = trovato;
      scelto = true;
    }
  } catch {
    /* ignora */
  }
}

/** Il Comune attivo, sempre aggiornato. Si usa come un normale oggetto. */
export const comune: ComuneConfig = new Proxy({} as ComuneConfig, {
  get: (_t, prop) => (attivo as any)[prop],
  has: (_t, prop) => prop in attivo,
  ownKeys: () => Reflect.ownKeys(attivo),
  getOwnPropertyDescriptor: (_t, prop) => ({
    ...Object.getOwnPropertyDescriptor(attivo, prop),
    configurable: true,
  }),
});

/** Il cittadino (o il link) ha già indicato un Comune? */
export function comuneScelto(): boolean {
  return scelto;
}

export function getComuneAttivo(): ComuneConfig {
  return attivo;
}

/** Cambia il Comune attivo (es. dalla pagina "Scegli il tuo Comune"). */
export function setComuneAttivo(slug: string): boolean {
  const trovato = trovaComune(slug);
  if (!trovato) return false;
  salvaScelta(trovato.slug);
  scelto = true;
  if (trovato.slug !== attivo.slug) {
    attivo = trovato;
    listeners.forEach((fn) => fn(trovato));
  }
  return true;
}

export function onComuneChange(fn: (c: ComuneConfig) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// ---------- Dati dell'utente separati per Comune ----------
/** Chiavi condivise tra tutti i Comuni (dispositivo, contenuti generali). */
const CHIAVI_COMUNI = new Set<string>([
  SCELTA_KEY,
  "salutenav:deviceId",
  "salutenav:remoteContent",
]);

/**
 * Trasforma una chiave di salvataggio in una chiave del Comune attivo, così
 * pratica, Progetto di Vita, documenti e valutazioni restano separati.
 * Per il Comune storico (Sarzana) le chiavi non cambiano: i dati già salvati
 * dagli utenti restano al loro posto.
 */
export function chiavePerComune(key: string, slug: string = attivo.slug): string {
  if (CHIAVI_COMUNI.has(key) || slug === COMUNE_STORICO) return key;
  return `${key}@${slug}`;
}
