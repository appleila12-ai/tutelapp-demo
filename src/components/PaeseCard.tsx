// "Il tuo Comune" dentro un'Unione: scelta del paese di residenza e recapiti
// del municipio. Non mostra nulla se l'ente attivo è un singolo Comune.

import React, { useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";

import { comune } from "@/src/config/comune";
import { usePaese } from "@/src/lib/paese";
import { colors, fonts, radius, spacing } from "@/src/theme";

export function PaeseCard({ testID = "paese-card" }: { testID?: string }) {
  const { paese, pronto, scegli } = usePaese();
  const [aperto, setAperto] = useState(false);
  const insets = useSafeAreaInsets();
  const t = comune.theme;

  if (!comune.paesi || comune.paesi.length === 0 || !pronto) return null;

  const apri = (url: string) => Linking.openURL(url).catch(() => {});

  return (
    <>
      {paese ? (
        <View style={[styles.card, { borderColor: t.warm }]} testID={testID}>
          <View style={styles.topRow}>
            <View style={[styles.icon, { backgroundColor: t.warmSoft }]}>
              <Ionicons name="home-outline" size={20} color={t.warmDark} />
            </View>
            <View style={styles.flex}>
              <Text style={[styles.eyebrow, { color: t.warmDark }]}>IL TUO COMUNE</Text>
              <Text style={styles.title} testID={`${testID}-nome`}>
                Comune di {paese.nome}
              </Text>
              {paese.indirizzo ? (
                <Text style={styles.text}>{paese.indirizzo}, {paese.nome}</Text>
              ) : null}
            </View>
            <Pressable
              onPress={() => setAperto(true)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Cambia il tuo Comune"
              testID={`${testID}-cambia`}
            >
              <Text style={styles.change}>Cambia</Text>
            </Pressable>
          </View>

          <View style={styles.actions}>
            {paese.telefono ? (
              <Pressable
                onPress={() => apri(`tel:${paese.telefono!.replace(/\s+/g, "")}`)}
                style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`Chiama il Comune di ${paese.nome}`}
                testID={`${testID}-chiama`}
              >
                <Ionicons name="call-outline" size={15} color={t.warmDark} />
                <Text style={[styles.chipText, { color: t.warmDark }]}>{paese.telefono}</Text>
              </Pressable>
            ) : null}
            {paese.email ? (
              <Pressable
                onPress={() => apri(`mailto:${paese.email}`)}
                style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`Scrivi al Comune di ${paese.nome}`}
              >
                <Ionicons name="mail-outline" size={15} color={t.warmDark} />
                <Text style={[styles.chipText, { color: t.warmDark }]}>Email</Text>
              </Pressable>
            ) : null}
            {paese.sitoWeb ? (
              <Pressable
                onPress={() => apri(paese.sitoWeb!)}
                style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
                accessibilityRole="link"
                accessibilityLabel={`Sito del Comune di ${paese.nome}`}
              >
                <Ionicons name="globe-outline" size={15} color={t.warmDark} />
                <Text style={[styles.chipText, { color: t.warmDark }]}>Sito</Text>
              </Pressable>
            ) : null}
          </View>
          <Text style={styles.hint}>
            Per i servizi sociali resta il riferimento: {comune.ente}.
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={() => setAperto(true)}
          style={({ pressed }) => [styles.card, styles.askCard, { borderColor: t.warm }, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Scegli il tuo Comune di residenza"
          testID={testID}
        >
          <View style={[styles.icon, { backgroundColor: t.warmSoft }]}>
            <Ionicons name="location-outline" size={20} color={t.warmDark} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.title}>In quale Comune abiti?</Text>
            <Text style={styles.text}>
              Scegli il tuo paese: avrai sempre a portata di mano i recapiti del municipio.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceTertiary} />
        </Pressable>
      )}

      <Modal
        visible={aperto}
        animationType="slide"
        transparent
        onRequestClose={() => setAperto(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setAperto(false)}
          accessibilityLabel="Chiudi"
        />
        <View
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
          testID="paese-sheet"
        >
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>In quale Comune abiti?</Text>
          <Text style={styles.sheetSub}>{comune.nome}</Text>
          <ScrollView style={styles.sheetList} showsVerticalScrollIndicator={false}>
            {comune.paesi.map((p) => {
              const selected = paese?.nome === p.nome;
              return (
                <Pressable
                  key={p.nome}
                  onPress={() => {
                    scegli(p.nome);
                    setAperto(false);
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    selected && { backgroundColor: t.warmSoft },
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  testID={`paese-option-${p.nome.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Text style={styles.optionText}>{p.nome}</Text>
                  {selected ? (
                    <Ionicons name="checkmark" size={18} color={t.warmDark} />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  askCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: { fontSize: 9, fontWeight: "800", letterSpacing: 1, marginBottom: 2 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "700",
    color: colors.onSurface,
  },
  text: { fontSize: 12, lineHeight: 18, color: colors.onSurfaceTertiary, marginTop: 2 },
  change: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.onSurface,
    textDecorationLine: "underline",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSecondary,
  },
  chipText: { fontSize: 13, fontWeight: "700" },
  hint: { fontSize: 11, lineHeight: 16, color: colors.onSurfaceTertiary, marginTop: spacing.md },
  pressed: { opacity: 0.8 },
  backdrop: { flex: 1, backgroundColor: "rgba(51,47,38,0.35)" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    maxHeight: "75%",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: "700",
    color: colors.onSurface,
  },
  sheetSub: { fontSize: 12, color: colors.onSurfaceTertiary, marginTop: 2, marginBottom: spacing.md },
  sheetList: { flexGrow: 0 },
  option: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  optionText: { fontSize: 15, color: colors.onSurface },
});
