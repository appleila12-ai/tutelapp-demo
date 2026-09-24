// Link dedicato per ogni Comune: /erba, /sarzana, /vigne-e-vini ...
// Imposta il Comune attivo e porta alla pagina iniziale.
// Un indirizzo che non corrisponde a nessun Comune porta alla scelta del Comune.

import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getComuneAttivo, setComuneAttivo } from "@/src/config/comune";
import { colors } from "@/src/theme";

export default function LinkComune() {
  const router = useRouter();
  const { comune } = useLocalSearchParams<{ comune: string }>();
  const slug = String(comune || "").toLowerCase();

  useEffect(() => {
    const ok = getComuneAttivo().slug === slug || setComuneAttivo(slug);
    // setTimeout: lascia completare l'eventuale ridisegno dell'app col nuovo Comune
    const id = setTimeout(() => router.replace(ok ? "/" : "/comuni"), 0);
    return () => clearTimeout(id);
  }, [slug, router]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.onSurfaceTertiary} />
    </View>
  );
}
