// Primi passi dopo una diagnosi — per chi non ha (ancora) un riconoscimento.
import { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@react-native-vector-icons/ionicons";

import { SezioniBar } from "@/src/components/SezioniBar";
import { colors, fonts, radius, spacing, topics } from "@/src/theme";
import { comune } from "@/src/config/comune";
import { useSezione } from "@/src/lib/statistiche";

function buildPrimiPassi() {
  return [
  {
    id: "esenzione",
    icon: "medkit-outline" as const,
    title: "Esenzione ticket per patologia",
    body:
      "Con una malattia cronica o rara riconosciuta puoi non pagare il ticket per visite ed esami legati alla tua patologia. Il codice esenzione (es. 048 per patologie oncologiche) è indicato nell'elenco del Ministero della Salute. Chi ne ha diritto: chi ha una diagnosi certificata da uno specialista del Servizio Sanitario. Si richiede alla ASL con il certificato dello specialista.",
    link: comune.esenzioneTicket,
    color: topics.salute,
  },
  {
    id: "malattia",
    icon: "calendar-outline" as const,
    title: "Congedo per malattia",
    body:
      "Malattia ordinaria: basta il certificato del tuo medico inviato all'INPS; sei coperto secondo il tuo contratto, con un limite di giorni (periodo di comporto). Permessi Legge 104: sono 3 giorni al mese retribuiti in più, ma spettano solo dopo il riconoscimento della disabilità grave (art. 3 comma 3). Finché non hai il verbale, usa la malattia ordinaria.",
    link: {
      label: "INPS · Indennità di malattia",
      url: "https://www.inps.it/it/it/dettaglio-approfondimento.schede-informative.indennit--di-malattia-e-visite-mediche-di-controllo.html",
    },
    color: topics.lavoro,
  },
  {
    id: "sportello",
    icon: "business-outline" as const,
    title: `Sportello sociale ${comune.delEnte}`,
    body: `${comune.ente} · ${comune.indirizzo}. Orari: ${comune.orari}. Un primo ascolto gratuito per capire di cosa hai bisogno e quali servizi puoi attivare subito, anche senza verbale.`,
    link: { label: `Chiama ${comune.telefono}`, url: `tel:${comune.telefono.replace(/\s+/g, "")}` },
    color: topics.patronato,
  },
  {
    id: "supporto",
    icon: "people-outline" as const,
    title: "Punti di supporto",
    body: `Numeri e link ufficiali INPS e i servizi ${comune.delEnte}: primo ascolto, assistenza domiciliare, amministratore di sostegno.`,
    route: "/contatti" as const,
    color: topics.percorso,
  },
  ];
}

export default function PrimiPassiScreen() {
  useSezione("primi-passi");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [openPasso, setOpenPasso] = useState<string | null>(null);
  const PRIMI_PASSI = buildPrimiPassi();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="primi-passi-screen">
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityLabel="Indietro"
          testID="primi-passi-back-btn"
        >
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Primi passi dopo una diagnosi</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View testID="home-primi-passi">
          {PRIMI_PASSI.map((p) => {
            const open = openPasso === p.id;
            return (
              <View
                key={p.id}
                style={[styles.passoCard, open && { borderColor: p.color.main }]}
                testID={`home-passo-${p.id}`}
              >
                <Pressable
                  onPress={() =>
                    "route" in p && p.route
                      ? router.push(p.route)
                      : setOpenPasso(open ? null : p.id)
                  }
                  style={styles.passoHead}
                  accessibilityRole="button"
                  accessibilityLabel={p.title}
                  testID={`home-passo-toggle-${p.id}`}
                >
                  <View style={[styles.passoIcon, { backgroundColor: p.color.soft }]}>
                    <Ionicons name={p.icon} size={22} color={p.color.main} />
                  </View>
                  <Text style={styles.passoTitle}>{p.title}</Text>
                  <Ionicons
                    name={"route" in p ? "chevron-forward" : open ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.borderStrong}
                  />
                </Pressable>
                {open && !("route" in p) && (
                  <View style={styles.passoBody}>
                    <Text style={styles.passoText}>{p.body}</Text>
                    <Pressable
                      onPress={() => Linking.openURL(p.link.url).catch(() => {})}
                      style={styles.passoLink}
                      accessibilityRole="link"
                      testID={`home-passo-link-${p.id}`}
                    >
                      <Ionicons
                        name={p.link.url.startsWith("tel:") ? "call-outline" : "open-outline"}
                        size={14}
                        color={p.color.dark}
                      />
                      <Text style={[styles.passoLinkText, { color: p.color.dark }]}>
                        {p.link.label}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}
          <Text style={styles.primiIntro} testID="home-primi-intro">
            Se in futuro la tua condizione dovesse comportare un&apos;invalidità
            riconosciuta, qui trovi tutto il percorso.
          </Text>
          <Pressable
            onPress={() => router.push("/hub")}
            style={[styles.passoCard, styles.passoHead, styles.orientarsiCard]}
            accessibilityRole="button"
            accessibilityLabel="Orientarsi insieme"
            testID="primi-passi-orientarsi-card"
          >
            <View style={[styles.passoIcon, { backgroundColor: topics.percorso.soft }]}>
              <Ionicons name="compass-outline" size={22} color={topics.percorso.main} />
            </View>
            <Text style={styles.passoTitle}>Orientarsi insieme</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.borderStrong} />
          </Pressable>
        </View>

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
  passoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  passoHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    minHeight: 64,
  },
  passoIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  passoTitle: {
    flex: 1,
    fontFamily: fonts.serif,
    fontSize: 16,
    fontWeight: "700",
    color: colors.onSurface,
  },
  passoBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  passoText: { fontSize: 14, lineHeight: 21, color: colors.onSurfaceSecondary },
  passoLink: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 40 },
  passoLinkText: { fontSize: 13, fontWeight: "800", textDecorationLine: "underline" },
  primiIntro: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.onSurfaceSecondary,
    marginTop: spacing.md,
    fontStyle: "italic",
  },
  orientarsiCard: { marginTop: spacing.md },
});
