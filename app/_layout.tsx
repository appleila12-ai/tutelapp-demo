import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { LogBox, Platform } from "react-native";

import { useIconFonts } from "@/src/hooks/use-icon-fonts";
import {
  caricaComuneSalvato,
  getComuneAttivo,
  onComuneChange,
} from "@/src/config/comune";


LogBox.ignoreAllLogs(true)

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useIconFonts();
  const [comuneReady, setComuneReady] = useState(false);
  const [comuneSlug, setComuneSlug] = useState(getComuneAttivo().slug);

  useEffect(() => {
    caricaComuneSalvato().finally(() => {
      setComuneSlug(getComuneAttivo().slug);
      setComuneReady(true);
    });
    return onComuneChange((c) => setComuneSlug(c.slug));
  }, []);

  // Sul web il titolo della scheda del browser riporta il Comune attivo
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.title = `TutelApp · ${getComuneAttivo().nome}`;
      document.documentElement.lang = "it";
    }
  }, [comuneSlug]);

  useEffect(() => {
    if ((loaded || error) && comuneReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, comuneReady]);

  if ((!loaded && !error) || !comuneReady) return null;

  return (
    // Nessun account né sincronizzazione: i dati restano sul dispositivo.
    // Cambiando Comune, l'app si ridisegna da capo con i dati del nuovo Comune.
    <Stack key={comuneSlug} screenOptions={{ headerShown: false }} />
  );
}
