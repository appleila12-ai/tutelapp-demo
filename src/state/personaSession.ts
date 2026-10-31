/** Identità per l'accoglienza e preparazione dei moduli. Solo sessione, senza rete. */
export type PersonaSession = Readonly<{
  nome: string;
  cognome: string;
  destinatario: "me" | "altra" | null;
}>;
const empty: PersonaSession = Object.freeze({ nome: "", cognome: "", destinatario: null });
let persona: PersonaSession = empty;
const listeners = new Set<() => void>();
export function getPersonaSession(): PersonaSession { return persona; }
export function subscribePersonaSession(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function aggiornaPersonaSession(update: Partial<PersonaSession>) {
  persona = Object.freeze({
    nome: (update.nome ?? persona.nome).slice(0, 80),
    cognome: (update.cognome ?? persona.cognome).slice(0, 80),
    destinatario: update.destinatario === undefined ? persona.destinatario : update.destinatario,
  });
  listeners.forEach((listener) => listener());
}
export function azzeraPersonaSession() {
  persona = empty;
  listeners.forEach((listener) => listener());
}
/** Non assegnare al beneficiario i dati del familiare che utilizza l'app. */
export function nomePerModulo(): string {
  if (persona.destinatario !== "me") return "";
  return [persona.nome.trim(), persona.cognome.trim()].filter(Boolean).join(" ");
}
