import { useSyncExternalStore } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { comune, comuneScelto } from "@/src/config/comune";
import { getPersonaSession, subscribePersonaSession } from "@/src/state/personaSession";
import { colors, spacing } from "@/src/theme";

/** Riferimento comunale comune alle schermate; non un nuovo menu di servizi. */
export function ComuneReference() {
  const router = useRouter();
  const persona = useSyncExternalStore(subscribePersonaSession, getPersonaSession, getPersonaSession);
  if (!comuneScelto()) return null;
  return (
    <SafeAreaView edges={["bottom"]} style={styles.reference} testID="comune-reference">
      <Text style={styles.name}>{comune.nome}{comune.dimostrativo ? " · esempio" : ""}</Text>
      <Text style={styles.text}>{persona.nome.trim() ? `${persona.nome.trim()}, qui trovi i riferimenti del tuo Comune.` : "Qui trovi i riferimenti del tuo Comune."}</Text>
      <Pressable accessibilityRole="button" onPress={() => router.push("/contatti")} style={styles.button}>
        <Text style={styles.action}>Contatta i servizi del Comune</Text>
      </Pressable>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  reference: { backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  name: { color: colors.onSurface, fontSize: 18, lineHeight: 27, fontWeight: "600" },
  text: { color: colors.onSurfaceSecondary, fontSize: 16, lineHeight: 24 },
  button: { minHeight: 64, paddingVertical: spacing.md, justifyContent: "center" },
  action: { color: colors.onSurface, fontSize: 18, lineHeight: 27, textDecorationLine: "underline" },
});
