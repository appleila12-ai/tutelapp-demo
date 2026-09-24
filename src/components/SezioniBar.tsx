// Barra delle 4 sezioni principali — raggiungibili da ogni pagina.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import Ionicons, { type IoniconsIconName } from "@react-native-vector-icons/ionicons";

import { colors, radius, spacing } from "@/src/theme";

const SEZIONI: { icon: IoniconsIconName; label: string; route: "/hub" | "/progetto" | "/tracker" | "/contatti" }[] = [
  { icon: "compass-outline", label: "Orientarsi insieme", route: "/hub" },
  { icon: "sparkles-outline", label: "Progetto di Vita", route: "/progetto" },
  { icon: "footsteps-outline", label: "La mia pratica", route: "/tracker" },
  { icon: "people-outline", label: "Supporto", route: "/contatti" },
];

export function SezioniBar() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <View style={styles.bar} testID="sezioni-bar">
      {SEZIONI.map((s) => {
        const on = pathname === s.route;
        return (
          <Pressable
            key={s.route}
            onPress={() => router.push(s.route)}
            style={({ pressed }) => [styles.item, on && styles.itemOn, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
            accessibilityLabel={s.label}
            testID={`sezioni-bar-${s.route.slice(1)}`}
          >
            <Ionicons name={s.icon} size={20} color={on ? colors.brandPrimary : colors.onSurface} />
            <Text style={styles.label} numberOfLines={2}>{s.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
    minHeight: 56,
    justifyContent: "center",
  },
  itemOn: { backgroundColor: colors.brandSecondary },
  label: { fontSize: 10.5, fontWeight: "700", color: colors.onSurface, textAlign: "center" },
});
