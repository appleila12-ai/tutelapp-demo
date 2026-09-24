// La vecchia schermata intermedia (immagine + tre scorciatoie) è stata assorbita
// dalla pagina iniziale: l'immagine è in Home e "Entra in TutelApp" porta
// direttamente a "Orientarsi insieme". Chi ha il vecchio link /cittadino
// viene riportato alla pagina iniziale.

import { Redirect } from "expo-router";

export default function Cittadino() {
  return <Redirect href="/" />;
}
