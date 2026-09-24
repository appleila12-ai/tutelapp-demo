// Il percorso per il riconoscimento — per chi non ha ancora un verbale.
// Regione, step numerati dalla diagnosi al Progetto di Vita e avvio del
// percorso guidato.

import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";

import { colors, fonts, radius, spacing } from "@/src/theme";
import { storage } from "@/src/utils/storage";
import { GuideStepsCard } from "@/src/components/NextStepsSection";
import { QuestionarioValutazione } from "@/src/components/QuestionarioValutazione";
import { SezioniBar } from "@/src/components/SezioniBar";
import { REGIONE_KEY, REGIONI } from "@/src/lib/territorio";
import { comune } from "@/src/config/comune";
import { useSezione } from "@/src/lib/statistiche";

export default function PercorsoScreen() {
  useSezione("percorso");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [regione, setRegione] = useState(comune.regione);
  const [regionOpen, setRegionOpen] = useState(false);

  useEffect(() => {
    storage.getItem<string>(REGIONE_KEY, "").then((r) => {
      if (r) setRegione(r);
    });
  }, []);

  const pickRegion = (r: string) => {
    setRegione(r);
    storage.setItem(REGIONE_KEY, r);
    setRegionOpen(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="percorso-screen">
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityLabel="Indietro"
          testID="percorso-back-btn"
        >
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Il percorso per il riconoscimento</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle-outline" size={22} color={colors.brandPrimary} />
          </View>
          <Text style={styles.infoText}>
            Prima serve il riconoscimento: il Progetto di Vita diventa
            disponibile solo dopo aver ricevuto il verbale. Ecco il percorso
            per ottenerlo, dal certificato medico introduttivo in avanti.
          </Text>
        </View>

        {/* Region — usata dal percorso guidato */}
        <Pressable
          onPress={() => setRegionOpen(true)}
          style={({ pressed }) => [styles.regionCard, pressed && { opacity: 0.9 }]}
          accessibilityRole="button"
          accessibilityLabel={`La tua regione: ${regione}. Tocca per cambiare`}
          testID="home-region-card"
        >
          <View style={styles.regionCardIcon}>
            <Ionicons name="location-outline" size={22} color={colors.brandPrimary} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.regionCardLabel}>LA TUA REGIONE</Text>
            <Text style={styles.regionCardValue} testID="home-region-value">
              {regione}
            </Text>
          </View>
          <View style={styles.regionCardCta}>
            <Text style={styles.regionCardCtaText}>Cambia</Text>
            <Ionicons name="chevron-down" size={14} color={colors.brandPrimary} />
          </View>
        </Pressable>

        {/* Step numerati dalla diagnosi al Progetto di Vita */}
        <GuideStepsCard />

        {/* Tutte le domande su una sola schermata */}
        <View style={styles.questionario}>
          <QuestionarioValutazione />
        </View>

        <SezioniBar />
      </ScrollView>

      {/* Region modal */}
      <Modal
        visible={regionOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setRegionOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setRegionOpen(false)}>
          <Pressable
            style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Scegli la regione</Text>
            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
              {REGIONI.map((r) => {
                const isSel = r === regione;
                return (
                  <Pressable
                    key={r}
                    onPress={() => pickRegion(r)}
                    style={({ pressed }) => [styles.sheetItem, pressed && { opacity: 0.7 }]}
                    testID={`region-option-${r}`}
                  >
                    <Text style={[styles.sheetItemText, isSel && styles.sheetItemTextSelected]}>
                      {r}
                    </Text>
                    {isSel && <Ionicons name="checkmark" size={20} color={colors.brandPrimary} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: fonts.serif,
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: colors.onSurface,
  },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },

  infoCard: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    backgroundColor: colors.brandSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: colors.onSurface,
    fontWeight: "600",
  },
  regionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.brandSecondary,
    borderWidth: 1.5,
    borderColor: colors.brandTertiary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  regionCardIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  regionCardLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.onSurface,
    letterSpacing: 1.1,
  },
  regionCardValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.onBrandSecondary,
    marginTop: 1,
    letterSpacing: -0.3,
  },
  regionCardCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  regionCardCtaText: { fontSize: 12, fontWeight: "800", color: colors.onSurface },
  questionario: { marginTop: spacing.xl },

  // Modal regione
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(51,47,38,0.42)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceTertiary,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  sheetScroll: { maxHeight: 420 },
  sheetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sheetItemText: { fontSize: 15, color: colors.onSurfaceSecondary, fontWeight: "600" },
  sheetItemTextSelected: { color: colors.onSurface, fontWeight: "800" },
});
