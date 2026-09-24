// Riforma della Disabilità (D.Lgs. 62/2024) — come funziona la nuova
// valutazione unica. I contenuti arrivano dal server (aggiornabili senza update).

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
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
import { AppContent, loadAppContent } from "@/src/lib/remoteContent";
import { SezioniBar } from "@/src/components/SezioniBar";
import { useSezione } from "@/src/lib/statistiche";

const CAMBIO_ICONE = [
  "document-text-outline",
  "business-outline",
  "analytics-outline",
  "sparkles-outline",
] as const;

export default function RiformaScreen() {
  useSezione("riforma");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState<AppContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setContent(await loadAppContent());
      setLoading(false);
    })();
  }, []);

  const riforma = content?.riforma;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="riforma-screen">
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityLabel="Indietro"
          testID="riforma-back-btn"
        >
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Cosa cambia con la riforma</Text>
        <View style={styles.iconBtn} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.brandPrimary} />
        </View>
      ) : !riforma ? (
        <View style={styles.centered}>
          <Text style={styles.erroreText}>
            Contenuti non disponibili: controlla la connessione e riprova.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + spacing.xxl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Intro */}
          <View style={styles.introCard}>
            <View style={styles.introIcon}>
              <Ionicons name="megaphone-outline" size={22} color={colors.brandPrimary} />
            </View>
            <Text style={styles.introText}>{riforma.intro}</Text>
          </View>

          {/* Cosa cambia */}
          <Text style={styles.sezTitle}>Cosa cambia con la riforma</Text>
          {riforma.cosaCambia.map((c, i) => (
            <View key={c.titolo} style={styles.cambioCard}>
              <View style={styles.cambioIcon}>
                <Ionicons
                  name={CAMBIO_ICONE[i % CAMBIO_ICONE.length]}
                  size={20}
                  color={colors.brandPrimary}
                />
              </View>
              <View style={styles.flex}>
                <Text style={styles.cambioTitle}>{c.titolo}</Text>
                <Text style={styles.cambioText}>{c.testo}</Text>
              </View>
            </View>
          ))}

          {/* Salvaguardia */}
          <View style={styles.salvaCard} testID="riforma-salvaguardia">
            <View style={styles.salvaHead}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
              <Text style={styles.salvaTitle}>Hai già un verbale? Sei al sicuro</Text>
            </View>
            <Text style={styles.salvaText}>{riforma.salvaguardia}</Text>
          </View>

          {/* Fonte */}
          <Pressable
            onPress={() => Linking.openURL(riforma.fonteUrl).catch(() => {})}
            style={styles.fonteRow}
            hitSlop={6}
          >
            <Ionicons name="open-outline" size={14} color={colors.brandPrimary} />
            <Text style={styles.fonteText}>
              Fonte ufficiale: INPS — Riforma della disabilità
            </Text>
          </Pressable>

          <SezioniBar />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  erroreText: {
    fontSize: 14,
    color: colors.onSurfaceSecondary,
    textAlign: "center",
  },
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

  introCard: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    backgroundColor: colors.brandSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  introIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  introText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: colors.onSurface,
    fontWeight: "600",
  },


  sezTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  cambioCard: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cambioIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.brandSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  cambioTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.onSurface,
    marginBottom: 2,
  },
  cambioText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.onSurfaceSecondary,
  },

  salvaCard: {
    backgroundColor: colors.successSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  salvaHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  salvaTitle: { fontSize: 15, fontWeight: "800", color: colors.onSurface },
  salvaText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.onSurface,
    fontWeight: "500",
  },

  fonteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: spacing.md,
  },
  fonteText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.onSurface,
    textDecorationLine: "underline",
  },
});
