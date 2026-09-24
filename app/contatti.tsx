// Contatti Utili — numeri e link ufficiali INPS e servizi.

import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons, { type IoniconsIconName } from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";

import { colors, fonts, radius, spacing, topics } from "@/src/theme";
import { comune } from "@/src/config/comune";
import { SezioniBar } from "@/src/components/SezioniBar";
import { PaeseCard } from "@/src/components/PaeseCard";
import { useSezione } from "@/src/lib/statistiche";

interface ContactRow {
  icon: IoniconsIconName;
  title: string;
  subtitle: string;
  action: { type: "tel" | "web"; value: string };
  testID: string;
}

interface ContactGroup {
  label: string;
  color: string;
  soft: string;
  rows: ContactRow[];
}

const GROUPS_FISSI: ContactGroup[] = [
  {
    label: "INPS",
    color: topics.legge104.main,
    soft: topics.legge104.soft,
    rows: [
      {
        icon: "call-outline",
        title: "Contact Center INPS — 803 164",
        subtitle: "Gratuito da telefono fisso · Lun-Ven 8-20, Sab 8-14",
        action: { type: "tel", value: "803164" },
        testID: "contact-inps-fisso",
      },
      {
        icon: "phone-portrait-outline",
        title: "Da cellulare — 06 164 164",
        subtitle: "A pagamento secondo il piano tariffario del tuo gestore",
        action: { type: "tel", value: "06164164" },
        testID: "contact-inps-mobile",
      },
      {
        icon: "globe-outline",
        title: "Sito ufficiale INPS",
        subtitle: "www.inps.it — domande, verbali e stato della pratica",
        action: { type: "web", value: "https://www.inps.it" },
        testID: "contact-inps-web",
      },
      {
        icon: "phone-portrait-outline",
        title: "App INPS Mobile",
        subtitle: "Consulta la tua pratica dallo smartphone (con SPID/CIE)",
        action: { type: "web", value: "https://www.inps.it/it/it/inps-comunica/inps-mobile.html" },
        testID: "contact-inps-app",
      },
    ],
  },
  {
    label: "ALTRI CONTATTI UTILI",
    color: topics.esenzioni.main,
    soft: topics.esenzioni.soft,
    rows: [
      {
        icon: "cash-outline",
        title: "Agenzia delle Entrate — 800 909 696",
        subtitle: "Agevolazioni fiscali (IVA 4%, detrazioni, bollo auto)",
        action: { type: "tel", value: "800909696" },
        testID: "contact-agenzia",
      },
      {
        icon: "medkit-outline",
        title: "Ministero della Salute — 1500",
        subtitle: "Numero di pubblica utilità per informazioni sanitarie",
        action: { type: "tel", value: "1500" },
        testID: "contact-salute",
      },
    ],
  },
];

/** Gruppi di contatti: INPS, poi i servizi del Comune attivo, poi gli altri. */
function buildGroups(): ContactGroup[] {
  const gruppoComune: ContactGroup = {
    label: `SERVIZI ${comune.delEnte.toUpperCase()}`,
    color: topics.patronato.main,
    soft: topics.patronato.soft,
    rows: comune.puntiSupporto.map((p, i) => ({
      ...p,
      testID: `contact-comune-${i}`,
    })),
  };
  return [GROUPS_FISSI[0], gruppoComune, ...GROUPS_FISSI.slice(1)];
}

export default function Contatti() {
  useSezione("supporto");
  const GROUPS = buildGroups();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const open = (a: ContactRow["action"]) => {
    const url = a.type === "tel" ? `tel:${a.value}` : a.value;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="contatti-screen">
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityLabel="Indietro"
          testID="contatti-back-btn"
        >
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Punti di supporto</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introCard} testID="contatti-utili-block">
          <View style={styles.introIcon}>
            <Ionicons name="call-outline" size={20} color={colors.brandPrimary} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.introTitle}>Contatti Utili</Text>
            <Text style={styles.introText}>
              Numeri e link ufficiali INPS e servizi, sempre a portata di mano:
              tocca una voce per chiamare o aprire il sito.
            </Text>
          </View>
        </View>

        {/* Unioni: il municipio del tuo paese */}
        <PaeseCard testID="contatti-paese" />

        {GROUPS.map((g) => (
          <View key={g.label} style={styles.group}>
            <Text style={[styles.groupLabel, { color: g.color }]}>
              {g.label}
            </Text>
            {g.rows.map((r) => (
              <Pressable
                key={r.testID}
                onPress={() => open(r.action)}
                style={({ pressed }) => [
                  styles.row,
                  { borderLeftColor: g.color },
                  pressed && { opacity: 0.85 },
                ]}
                accessibilityRole="button"
                testID={r.testID}
              >
                <View style={[styles.rowIcon, { backgroundColor: g.soft }]}>
                  <Ionicons name={r.icon} size={20} color={g.color} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.rowTitle}>{r.title}</Text>
                  <Text style={styles.rowSub}>{r.subtitle}</Text>
                </View>
                <Ionicons
                  name={r.action.type === "tel" ? "call-outline" : "open-outline"}
                  size={18}
                  color={colors.onSurfaceTertiary}
                />
              </Pressable>
            ))}
          </View>
        ))}

        <Text style={styles.disclaimer}>
          {Platform.OS === "web"
            ? "Dal telefono potrai chiamare i numeri con un tocco."
            : "I numeri si aprono direttamente nel tastierino del telefono."}
          {" Orari e costi possono variare: verifica sempre sul sito ufficiale."}
        </Text>

        <SezioniBar />
      </ScrollView>
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

  introCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.brandSecondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
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
  introTitle: {
    fontFamily: fonts.serif,
    fontSize: 17,
    fontWeight: "700",
    color: colors.onBrandSecondary,
    marginBottom: 4,
  },
  introText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.onBrandSecondary,
    fontWeight: "500",
  },

  group: { marginBottom: spacing.lg },
  groupLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 64,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.onSurface,
    lineHeight: 18,
  },
  rowSub: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.onSurfaceSecondary,
    marginTop: 2,
  },
  disclaimer: {
    fontSize: 11,
    fontStyle: "italic",
    color: colors.onSurfaceTertiary,
    textAlign: "center",
    lineHeight: 16,
    marginTop: spacing.sm,
  },
});
