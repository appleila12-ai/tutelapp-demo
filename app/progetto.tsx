// Pilastro 2 — Il mio Progetto di Vita (Costruttore di Desideri)
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@react-native-vector-icons/ionicons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { colors, fonts, radius, spacing } from "@/src/theme";
import { comune } from "@/src/config/comune";
import { SezioniBar } from "@/src/components/SezioniBar";
import { AttivaProgettoSection } from "@/src/components/AttivaProgettoSection";
import {
  AREE,
  AreaId,
  EMPTY_PROGETTO,
  Progetto,
  areaItems,
  buildProgettoHtml,
  countProgetto,
  loadProgetto,
  saveProgetto,
} from "@/src/lib/progetto";
import { registra, useSezione } from "@/src/lib/statistiche";

function toast(msg: string) {
  if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
  else console.log(msg);
}

export default function ProgettoDiVita() {
  useSezione("progetto");
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [progetto, setProgetto] = useState<Progetto>(EMPTY_PROGETTO);
  const [ready, setReady] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadProgetto().then((p) => {
      setProgetto(p);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) saveProgetto(progetto);
  }, [progetto, ready]);

  const totals = useMemo(() => countProgetto(progetto), [progetto]);

  const toggleScelta = (id: AreaId, s: string) => {
    setProgetto((p) => {
      const cur = p.aree[id];
      const has = cur.scelte.includes(s);
      return {
        ...p,
        aree: {
          ...p.aree,
          [id]: {
            ...cur,
            scelte: has ? cur.scelte.filter((x) => x !== s) : [...cur.scelte, s],
          },
        },
      };
    });
  };

  const setLibero = (id: AreaId, libero: string) => {
    setProgetto((p) => ({
      ...p,
      aree: { ...p.aree, [id]: { ...p.aree[id], libero } },
    }));
  };

  const exportPdf = async () => {
    if (exporting || totals.desideri === 0) return;
    setExporting(true);
    // Statistiche anonime: solo le aree compilate e i desideri tra quelli
    // suggeriti dall'app (mai il nome né il testo scritto liberamente).
    registra("progetto_pdf", "creato");
    AREE.forEach((a) => {
      const entry = progetto.aree[a.id];
      if (areaItems(entry).length > 0) registra("area_progetto", a.id);
      registra("desiderio", ...entry.scelte.filter((x) => a.suggestions.includes(x)));
    });
    const html = buildProgettoHtml(progetto);
    try {
      if (Platform.OS === "web") {
        await Print.printAsync({ html });
        return;
      }
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Il mio Progetto di Vita",
          UTI: "com.adobe.pdf",
        });
      } else {
        toast(`PDF salvato: ${uri}`);
      }
    } catch (e) {
      console.warn("progetto pdf failed", e);
      toast("Impossibile creare il PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="progetto-screen">
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityLabel="Indietro"
          testID="progetto-back-btn"
        >
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Il mio Progetto di Vita</Text>
        <View style={styles.iconBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 120 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avviso: strumento di preparazione, non la domanda ufficiale */}
          <View style={styles.avviso} testID="progetto-avviso">
            <Ionicons name="information-circle-outline" size={18} color={colors.accentDark} />
            <Text style={styles.avvisoText}>
              Questo strumento ti aiuta a preparare i tuoi pensieri prima di
              presentare la richiesta ufficiale: non sostituisce né la domanda
              su SISDA (portale INPS) né il colloquio con l&apos;ATS.
            </Text>
          </View>

          {/* Intro */}
          <View style={styles.introCard} testID="progetto-intro">
            <View style={styles.introIcon}>
              <Ionicons name="sparkles-outline" size={20} color={colors.brandPrimary} />
            </View>
            <Text style={styles.introText}>
              Con la Riforma 2027 il Progetto di Vita parte da te: dai tuoi
              desideri e da come vorresti vivere. Qui puoi appuntarli con
              calma, per raccontarli all&apos;équipe (UVM) e al Comune.
            </Text>
          </View>

          {/* Riepilogo conteggio */}
          <View style={styles.counterRow} testID="progetto-counter">
            <View style={styles.counterPill}>
              <Ionicons name="heart-outline" size={13} color={colors.accentDark} />
              <Text style={styles.counterText}>
                {totals.desideri === 0
                  ? "Nessun desiderio ancora: inizia da un'area"
                  : `${totals.desideri} ${totals.desideri === 1 ? "desiderio" : "desideri"} in ${totals.aree} ${totals.aree === 1 ? "area" : "aree"}`}
              </Text>
            </View>
          </View>

          {/* Nome facoltativo */}
          <View style={styles.nameCard}>
            <Text style={styles.nameLabel}>IL TUO NOME (FACOLTATIVO)</Text>
            <TextInput
              value={progetto.nome}
              onChangeText={(nome) => setProgetto((p) => ({ ...p, nome }))}
              placeholder="Es. Maria"
              placeholderTextColor={colors.muted}
              style={styles.nameInput}
              testID="progetto-nome-input"
            />
          </View>

          <Text style={styles.sectionLabel}>LE AREE DELLA TUA VITA</Text>

          {AREE.map((a) => {
            const entry = progetto.aree[a.id];
            const n = areaItems(entry).length;
            return (
              <View
                key={a.id}
                style={styles.areaCard}
                testID={`progetto-area-${a.id}`}
              >
                <View style={styles.areaHead} testID={`progetto-area-head-${a.id}`}>
                  <View style={[styles.areaIcon, { backgroundColor: a.color.soft }]}>
                    <Ionicons name={a.icon} size={22} color={a.color.main} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.areaTitle}>{a.title}</Text>
                    <Text style={styles.areaHint}>
                      {n > 0
                        ? `${n} ${n === 1 ? "desiderio" : "desideri"}`
                        : a.hint}
                    </Text>
                  </View>
                  {n > 0 && (
                    <View style={[styles.areaBadge, { backgroundColor: a.color.main }]}>
                      <Text style={styles.areaBadgeText}>{n}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.areaBody}>
                    <Text style={styles.chipsLabel}>Scegli quello che senti tuo</Text>
                    <View style={styles.chips}>
                      {a.suggestions.map((s) => {
                        const sel = entry.scelte.includes(s);
                        return (
                          <Pressable
                            key={s}
                            onPress={() => toggleScelta(a.id, s)}
                            style={[
                              styles.chip,
                              sel && { backgroundColor: a.color.soft, borderColor: a.color.main },
                            ]}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: sel }}
                            testID={`progetto-chip-${a.id}-${a.suggestions.indexOf(s)}`}
                          >
                            <Ionicons
                              name={sel ? "checkmark-circle" : "ellipse-outline"}
                              size={18}
                              color={sel ? a.color.main : colors.borderStrong}
                            />
                            <Text
                              style={[
                                styles.chipText,
                                sel && { color: a.color.dark, fontWeight: "700" },
                              ]}
                            >
                              {s}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    <Text style={styles.chipsLabel}>Con parole tue</Text>
                    <TextInput
                      value={entry.libero}
                      onChangeText={(t) => setLibero(a.id, t)}
                      placeholder="Aggiungi un desiderio con le tue parole…"
                      placeholderTextColor={colors.muted}
                      multiline
                      style={styles.freeInput}
                      testID={`progetto-libero-${a.id}`}
                    />
                </View>
              </View>
            );
          })}

          <View style={styles.reassure} testID="progetto-reassure">
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
            <Text style={styles.reassureText}>
              Quello che scrivi resta solo sul tuo telefono. Il PDF lo condividi
              tu, quando vuoi, con i Servizi Sociali {comune.delEnte}.
            </Text>
          </View>

          {/* Come attivare il Progetto di Vita — dentro questa pagina */}
          <AttivaProgettoSection />

          <SezioniBar />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* CTA fissa: riepilogo PDF */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          onPress={exportPdf}
          disabled={exporting || totals.desideri === 0}
          style={({ pressed }) => [
            styles.pdfBtn,
            totals.desideri === 0 && styles.pdfBtnDisabled,
            pressed && { opacity: 0.9 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Crea il riepilogo PDF"
          testID="progetto-pdf-btn"
        >
          {exporting ? (
            <ActivityIndicator color={colors.onAccent} />
          ) : (
            <>
              <Ionicons name="document-text-outline" size={20} color={colors.onAccent} />
              <Text style={styles.pdfBtnText}>Crea il riepilogo PDF</Text>
            </>
          )}
        </Pressable>
        <Text style={styles.footerHint}>
          Da portare al colloquio con l&apos;UVM o al Comune
        </Text>
      </View>
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
    fontSize: 17,
    fontWeight: "700",
    color: colors.onSurface,
  },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },

  avviso: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  avvisoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.accentDark,
    fontWeight: "600",
  },

  introCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.brandSecondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  introIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  introText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: colors.onBrandSecondary,
    fontWeight: "500",
  },
  counterRow: { alignItems: "center", marginTop: spacing.md },
  counterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  counterText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: colors.accentDark,
  },
  nameCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  nameLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: colors.onSurfaceTertiary,
    marginBottom: 6,
  },
  nameInput: {
    fontSize: 16,
    color: colors.onSurface,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    minHeight: 44,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: colors.onSurfaceTertiary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },

  areaCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  areaHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    minHeight: 68,
  },
  areaIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  areaTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    fontWeight: "700",
    color: colors.onSurface,
  },
  areaHint: {
    fontSize: 12,
    color: colors.onSurfaceTertiary,
    marginTop: 2,
  },
  areaBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  areaBadgeText: { color: colors.onSurface, fontSize: 12, fontWeight: "800" },
  areaBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  chipsLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.onSurfaceTertiary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chips: { gap: spacing.sm },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    minHeight: 44,
  },
  chipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: colors.onSurfaceSecondary,
  },
  freeInput: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.onSurface,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    minHeight: 72,
    textAlignVertical: "top",
  },

  reassure: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.successSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  reassureText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.onSurface,
    fontWeight: "600",
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  pdfBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    minHeight: 54,
  },
  pdfBtnDisabled: { opacity: 0.45 },
  pdfBtnText: { fontSize: 16, fontWeight: "800", color: colors.onAccent },
  footerHint: {
    textAlign: "center",
    fontSize: 11.5,
    color: colors.muted,
    marginTop: 6,
  },
});
