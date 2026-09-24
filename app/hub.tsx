import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useFocusEffect, useRouter } from "expo-router";

import { colors, fonts, radius, spacing, topics } from "@/src/theme";
import { storage } from "@/src/utils/storage";
import { Wordmark } from "@/src/components/Brand";
import { formatDate, listReports, Report } from "@/src/lib/reports";
import { REGIONE_KEY, REGIONI } from "@/src/lib/territorio";
import { comune } from "@/src/config/comune";
import { registra, useSezione } from "@/src/lib/statistiche";

const MOMENTO_KEY = "tutelapp:hub:momento";

type Momento = "diagnosi" | "iter" | "diritti" | null;

const MOMENTI: { id: Exclude<Momento, null>; label: string }[] = [
  { id: "diagnosi", label: "Ho appena ricevuto una diagnosi" },
  { id: "iter", label: "Sto seguendo un iter" },
  { id: "diritti", label: "Voglio capire i miei diritti" },
];

// Le 4 sezioni principali — raggiungibili dopo la domanda
const SEZIONI = [
  {
    id: "progetto",
    icon: "sparkles-outline" as const,
    title: "Il mio Progetto di Vita",
    sub: "Costruisci i tuoi desideri da portare all'UVM",
    route: "/progetto",
    color: topics.lavoro,
  },
  {
    id: "tracker",
    icon: "footsteps-outline" as const,
    title: "La mia pratica",
    sub: "A che punto sei, tappa dopo tappa",
    route: "/tracker",
    color: topics.salute,
  },
  {
    id: "primi-passi",
    icon: "leaf-outline" as const,
    title: "Primi passi dopo una diagnosi",
    sub: "Esenzioni, malattia e sportello sociale",
    route: "/primi-passi",
    color: topics.percorso,
  },
  {
    id: "supporto",
    icon: "people-outline" as const,
    title: "Punti di supporto",
    sub: "Filo diretto con INPS e Comune",
    route: "/contatti",
    color: topics.patronato,
  },
] as const;

export default function Hub() {
  useSezione("orientarsi");
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [regione, setRegione] = useState(comune.regione);
  const [regionOpen, setRegionOpen] = useState(false);
  const [history, setHistory] = useState<Report[]>([]);
  const [momento, setMomento] = useState<Momento>(null);
  const [guidaOpen, setGuidaOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await storage.getItem<string>(REGIONE_KEY, "");
      if (r) setRegione(r);
      const m = await storage.getItem<string>(MOMENTO_KEY, "");
      if (m === "diagnosi" || m === "iter" || m === "diritti") setMomento(m);
    })();
  }, []);

  // Storico valutazioni: si aggiorna ogni volta che si torna in home
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const list = await listReports();
        if (active) setHistory(list.slice(0, 3));
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  // La risposta porta direttamente alla pagina giusta
  const pickMomento = async (m: Exclude<Momento, null>) => {
    setMomento(m);
    storage.setItem(MOMENTO_KEY, m);
    registra("momento", m);
    if (m === "diagnosi") return router.push("/percorso");
    if (m === "iter") return router.push("/tracker");
    // Diritti: ultimo risultato salvato se esiste, altrimenti il questionario
    const list = await listReports();
    if (list.length > 0) router.push(`/risultati/${list[0].id}`);
    else router.push("/valutazione");
  };

  const pickRegion = (r: string) => {
    setRegione(r);
    storage.setItem(REGIONE_KEY, r);
    setRegionOpen(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar: indietro + logo */}
        <View style={styles.topBar} testID="home-topbar">
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.hubBackBtn}
            accessibilityLabel="Indietro"
            testID="hub-back-btn"
          >
            <Ionicons name="chevron-back" size={20} color={colors.onSurface} />
          </Pressable>
          <Wordmark size="sm" showLogo={true} logoVariant="soft" />
          <View style={styles.topRight} />
        </View>

        {/* Titolo sezione — navigatore di transizione */}
        <View style={styles.pageTitleBox} testID="home-title">
          <Text style={styles.pageTitle}>Orientarsi insieme</Text>
          <Text style={styles.pageSub}>
            Il tuo navigatore: capisci a che punto sei e cosa puoi attivare
            con la Riforma della disabilità (D.Lgs. 62/2024).
          </Text>
        </View>

        {/* Domanda filtro: in che momento sei? */}
        <View style={styles.filterCard} testID="hub-filter-card">
          <Text style={styles.filterQuestion}>In che momento sei?</Text>
          <View style={styles.filterCol}>
            {MOMENTI.map((m) => {
              const on = momento === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => pickMomento(m.id)}
                  style={[styles.filterBtn, on && styles.filterBtnOn]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  testID={`hub-momento-${m.id}`}
                >
                  <Ionicons
                    name={on ? "checkmark-circle" : "ellipse-outline"}
                    size={18}
                    color={on ? colors.onBrandPrimary : colors.brandPrimary}
                  />
                  <Text style={[styles.filterBtnText, on && styles.filterBtnTextOn]}>
                    {m.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Sezioni principali raggiungibili */}
        <Text style={styles.sectionLabel}>LE TUE SEZIONI</Text>
        <View style={styles.grid}>
          {SEZIONI.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => router.push(s.route)}
              style={({ pressed }) => [styles.gridCard, pressed && { opacity: 0.9 }]}
              accessibilityRole="button"
              accessibilityLabel={s.title}
              testID={`hub-card-${s.id}`}
            >
              <View style={[styles.gridIcon, { backgroundColor: s.color.soft }]}>
                <Ionicons name={s.icon} size={26} color={s.color.main} />
              </View>
              <Text style={styles.gridTitle}>{s.title}</Text>
              <Text style={styles.gridSub}>{s.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* Il percorso per il riconoscimento */}
        <Pressable
          onPress={() => router.push("/percorso")}
          style={({ pressed }) => [styles.navCard, pressed && { opacity: 0.9 }]}
          accessibilityRole="button"
          accessibilityLabel="Il percorso per il riconoscimento"
          testID="hub-branch-no"
        >
          <View style={[styles.navIcon, { backgroundColor: colors.brandSecondary }]}>
            <Ionicons name="footsteps-outline" size={22} color={colors.brandPrimary} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.navTitle}>Il percorso per il riconoscimento</Text>
            <Text style={styles.navSub}>
              Regione, step dalla diagnosi al verbale e avvio del percorso guidato
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.borderStrong} />
        </Pressable>

        {/* Cosa cambia con la riforma → pagina dedicata */}
        <Pressable
          onPress={() => router.push("/riforma")}
          style={({ pressed }) => [styles.navCard, pressed && { opacity: 0.9 }]}
          accessibilityRole="button"
          accessibilityLabel="Cosa cambia con la riforma"
          testID="hub-riforma"
        >
          <View style={[styles.navIcon, { backgroundColor: colors.brandSecondary }]}>
            <Ionicons name="megaphone-outline" size={22} color={colors.brandPrimary} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.navTitle}>Cosa cambia con la riforma</Text>
            <Text style={styles.navSub}>
              Valutazione unica INPS, criteri OMS, Progetto di Vita e tutele per chi ha già un verbale
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.borderStrong} />
        </Pressable>

        {/* Sotto-sezioni: FAQ + Importi */}
        <View style={styles.quickRow}>
            <Pressable
              onPress={() => router.push("/faq")}
              style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.9 }]}
              accessibilityRole="button"
              testID="home-faq-link"
            >
              <Ionicons name="help-circle-outline" size={22} color={colors.brandPrimary} />
              <Text style={styles.quickTitle}>Domande Frequenti</Text>
              <Text style={styles.quickSub}>Risposte chiare e glossario</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/importi")}
              style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.9 }]}
              accessibilityRole="button"
              testID="home-importi-link"
            >
              <Ionicons name="cash-outline" size={22} color={colors.brandPrimary} />
              <Text style={styles.quickTitle}>Importi Aggiornati</Text>
              <Text style={styles.quickSub}>Cifre e limiti di reddito</Text>
            </Pressable>
          </View>

        {/* Impostazioni: regione (i dati restano sul dispositivo) */}
        <View style={styles.accountBox} testID="hub-account-box">
          <Text style={styles.accountLabel}>IMPOSTAZIONI</Text>
          <Pressable
            onPress={() => setRegionOpen(true)}
            style={({ pressed }) => [styles.accountRow, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
            accessibilityLabel={`La tua regione: ${regione}. Tocca per cambiare`}
            testID="home-region-pill"
          >
            <Ionicons name="location-outline" size={18} color={colors.brandPrimary} />
            <View style={styles.flex}>
              <Text style={styles.accountRowTitle}>Regione</Text>
              <Text style={styles.accountRowSub} testID="home-region-value">{regione}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.borderStrong} />
          </Pressable>

          <View style={styles.accountRow} testID="hub-dati-locali">
            <Ionicons name="phone-portrait-outline" size={18} color={colors.brandPrimary} />
            <View style={styles.flex}>
              <Text style={styles.accountRowTitle}>I tuoi dati restano tuoi</Text>
              <Text style={styles.accountRowSub}>
                Nessun account: tutto resta salvato solo su questo dispositivo
              </Text>
            </View>
          </View>
        </View>

        {/* Box informativo: Questa guida fa per te? */}
        <View style={styles.guidaBox} testID="hub-guida-box">
          <Pressable
            onPress={() => setGuidaOpen((o) => !o)}
            style={styles.guidaHead}
            accessibilityRole="button"
            accessibilityState={{ expanded: guidaOpen }}
            testID="hub-guida-toggle"
          >
            <Ionicons name="help-circle-outline" size={20} color={colors.brandPrimary} />
            <Text style={styles.guidaTitle}>Questa guida fa per te?</Text>
            <Ionicons
              name={guidaOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.borderStrong}
            />
          </Pressable>
          {guidaOpen && (
            <Text style={styles.guidaText} testID="hub-guida-text">
              Questa guida copre invalidità civile, cecità e sordità civile e
              Legge 104, ora unificate nello stesso accertamento INPS
              (Valutazione di Base). Se la tua condizione deriva da un
              infortunio sul lavoro o una malattia professionale, il percorso è
              gestito da INAIL, non da INPS. Se sei un dipendente pubblico e la
              tua invalidità è per causa di servizio, il percorso è diverso e va
              seguito con il tuo ente di appartenenza.
            </Text>
          )}
        </View>

        <View style={styles.spacer} />

        {/* Storico valutazioni */}
        {history.length > 0 && (
          <View style={styles.historyBox} testID="home-history">
            <Text style={styles.historyLabel}>LE TUE VALUTAZIONI</Text>
            {history.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/risultati/${r.id}`)}
                style={({ pressed }) => [
                  styles.historyRow,
                  pressed && { opacity: 0.8 },
                ]}
                accessibilityRole="button"
                testID={`home-history-item-${r.id}`}
              >
                <View style={styles.historyIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={16}
                    color={colors.brandPrimary}
                  />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.historyTitle} numberOfLines={1}>
                    {r.answers.who} · {r.answers.work}
                  </Text>
                  <Text style={styles.historyDate}>
                    {formatDate(r.createdAt)}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.borderStrong}
                />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Region modal */}
      <Modal
        visible={regionOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setRegionOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setRegionOpen(false)}
        >
          <Pressable
            style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Scegli la regione</Text>
            <ScrollView
              style={styles.sheetScroll}
              showsVerticalScrollIndicator={false}
            >
              {REGIONI.map((r) => {
                const isSel = r === regione;
                return (
                  <Pressable
                    key={r}
                    onPress={() => pickRegion(r)}
                    style={({ pressed }) => [
                      styles.sheetItem,
                      pressed && { opacity: 0.7 },
                    ]}
                    testID={`region-option-${r}`}
                  >
                    <Text
                      style={[
                        styles.sheetItemText,
                        isSel && styles.sheetItemTextSelected,
                      ]}
                    >
                      {r}
                    </Text>
                    {isSel && (
                      <Ionicons name="checkmark" size={20} color={colors.brandPrimary} />
                    )}
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
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    alignItems: "stretch",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
    minHeight: 36,
  },
  hubBackBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -4,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  pageTitleBox: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  pageTitle: {
    fontFamily: fonts.serif,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "600",
    color: colors.onSurface,
    letterSpacing: -0.4,
  },
  pageSub: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.onSurfaceSecondary,
    marginTop: spacing.xs,
  },

  // Domanda filtro
  filterCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  filterQuestion: {
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  filterCol: { gap: spacing.sm },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 48,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.brandPrimary,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  filterBtnOn: { backgroundColor: colors.brandPrimary },
  filterBtnText: { fontSize: 14, fontWeight: "800", color: colors.brandPrimary },
  filterBtnTextOn: { color: colors.onBrandPrimary },

  // Sezioni principali (griglia 2x2)
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: colors.onSurfaceTertiary,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  gridCard: {
    width: "47.5%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: 6,
    minHeight: 150,
  },
  gridIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  gridTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "700",
    color: colors.onSurface,
  },
  gridSub: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.onSurfaceTertiary,
  },

  // Bottoni che aprono le pagine dedicate
  navCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 72,
  },
  navIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    fontWeight: "700",
    color: colors.onSurface,
  },
  navSub: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.onSurfaceTertiary,
    marginTop: 2,
  },

  // Bottoni che aprono le pagine dedicate
  quickRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 4,
    minHeight: 88,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.onSurface,
    marginTop: 2,
  },
  quickSub: {
    fontSize: 11,
    color: colors.onSurfaceTertiary,
    lineHeight: 15,
  },

  spacer: { flex: 1, minHeight: spacing.lg },

  accountBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg,
  },
  accountLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: colors.onSurfaceTertiary,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 56,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  accountRowTitle: { fontSize: 14, fontWeight: "700", color: colors.onSurface },
  accountRowSub: { fontSize: 12, color: colors.onSurfaceTertiary, marginTop: 1 },

  guidaBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  guidaHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 52,
  },
  guidaTitle: {
    flex: 1,
    fontFamily: fonts.serif,
    fontSize: 15,
    fontWeight: "700",
    color: colors.onSurface,
  },
  guidaText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.onSurfaceSecondary,
    paddingBottom: spacing.md,
  },

  historyBox: {
    marginBottom: spacing.md,
  },
  historyLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.onSurfaceTertiary,
    letterSpacing: 1.1,
    marginBottom: spacing.sm,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
    minHeight: 48,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.brandSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.onSurface,
  },
  historyDate: {
    fontSize: 11,
    color: colors.onSurfaceTertiary,
    marginTop: 1,
  },

  // Modals
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
  sheetScroll: {
    maxHeight: 420,
  },
  sheetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sheetItemText: {
    fontSize: 15,
    color: colors.onSurfaceSecondary,
    fontWeight: "600",
  },
  sheetItemTextSelected: {
    color: colors.onSurface,
    fontWeight: "800",
  },

  // User card
});
