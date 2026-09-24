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
import { Redirect, useRouter } from "expo-router";
import Ionicons from "@react-native-vector-icons/ionicons";

import { Wordmark } from "@/src/components/Brand";
import { MonoImage } from "@/src/components/MonoImage";
import { ComuneLogo } from "@/src/components/ComuneLogo";
import { PaeseCard } from "@/src/components/PaeseCard";
import { comune, comuneScelto } from "@/src/config/comune";
import { colors, fonts, radius, spacing, topics } from "@/src/theme";
import { useSezione } from "@/src/lib/statistiche";
import { HA_BACKEND } from "@/src/config/servizi";

const FEATURES = [
  {
    icon: "compass-outline" as const,
    title: "Orientamento",
    href: "/hub",
    text: "Capisci quale percorso ti riguarda e qual è il prossimo passo.",
    color: topics.percorso,
  },
  {
    icon: "sparkles-outline" as const,
    title: "Progetto di Vita",
    href: "/progetto",
    text: "Preparati al confronto con i servizi partendo da ciò che conta per te.",
    color: topics.lavoro,
  },
  {
    icon: "footsteps-outline" as const,
    title: "La tua pratica",
    href: "/tracker",
    text: "Tieni a mente le tappe del percorso e gli appuntamenti importanti.",
    color: topics.salute,
  },
  {
    icon: "people-outline" as const,
    title: "Punti di supporto",
    href: "/contatti",
    text: "Trova i servizi e i contatti del territorio.",
    color: topics.patronato,
  },
];

const INFO_LINKS = [
  {
    id: "faq",
    icon: "help-circle-outline" as const,
    title: "Domande frequenti",
    sub: "Le risposte ai dubbi più comuni",
    href: "/faq",
    color: topics.legge104,
  },
  {
    id: "glossario",
    icon: "book-outline" as const,
    title: "Glossario",
    sub: "Le parole della burocrazia, spiegate semplici",
    href: "/faq?sezione=glossario",
    color: topics.documenti,
  },
  {
    id: "importi",
    icon: "cash-outline" as const,
    title: "Importi aggiornati",
    sub: "Pensioni, indennità e limiti di reddito",
    href: "/importi",
    color: topics.esenzioni,
  },
  // L'assistente sulla 104 ha bisogno del server: compare solo se c'è
  ...(HA_BACKEND
    ? [
        {
          id: "domande-104",
          icon: "chatbubbles-outline" as const,
          title: "Le domande sulla 104",
          sub: "Chiedi e ricevi una risposta basata sulla normativa",
          href: "/domande-104",
          color: topics.lavoro,
        },
      ]
    : []),
];

export default function ComuneHome() {
  // Primo accesso senza Comune nel link: prima si sceglie il proprio Comune
  if (!comuneScelto()) return <Redirect href="/comuni" />;
  return <HomeDelComune />;
}

function HomeDelComune() {
  useSezione("home");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = comune.theme;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: t.cream }]}
      edges={["top", "bottom"]}
      testID="comune-home"
    >
      <StatusBar barStyle="dark-content" backgroundColor={t.cream} />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Intestazione istituzionale: stemma/logo del Comune */}
        <View style={styles.institutionHeader}>
          <ComuneLogo size={comune.logo ? 72 : 40} />
          <View style={styles.flex}>
            <Text style={[styles.institutionEyebrow, { color: t.warmDark }]}>
              {comune.dimostrativo
                ? "VERSIONE DIMOSTRATIVA"
                : comune.tipo === "unione"
                  ? "SERVIZIO DEI COMUNI DELL'UNIONE"
                  : "SERVIZIO DEL TERRITORIO"}
            </Text>
            <Text style={styles.institutionName} testID="comune-home-nome">
              {comune.nome}
            </Text>
          </View>
        </View>
        {comune.paesi && comune.paesi.length > 0 && (
          <Text style={styles.aderenti} testID="comune-home-aderenti">
            {comune.paesi.map((p) => p.nome).join(" · ")}
          </Text>
        )}

        {comune.dimostrativo && (
          <View style={styles.demoBanner} testID="comune-home-demo">
            <Ionicons name="information-circle-outline" size={18} color="#6B4E16" />
            <Text style={styles.demoBannerText}>
              <Text style={styles.demoBannerStrong}>Versione dimostrativa. </Text>
              {comune.nome} non ha aderito a TutelApp: questa pagina mostra come
              potrebbe funzionare. I recapiti sono quelli pubblicati sul sito
              ufficiale del Comune e potrebbero non essere aggiornati.
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* Brand + accoglienza */}
        <View style={styles.brandBlock}>
          <Wordmark size="md" showLogo={true} logoVariant="soft" />
          <Text style={styles.kicker}>
            {comune.dimostrativo
              ? `ESEMPIO PER ${comune.nome.toUpperCase()}`
              : `IN COLLABORAZIONE CON ${comune.nome.toUpperCase()}`}
          </Text>
          <Text style={styles.title}>
            Non devi orientarti da solo.
          </Text>
          <Text style={styles.lead}>
            TutelApp ti accompagna nei passaggi da conoscere dopo una diagnosi
            o quando devi orientarti nel percorso della disabilità.
          </Text>
        </View>

        {/* Immagine di accoglienza (prima era in una schermata a parte) */}
        <MonoImage
          source={require("../assets/images/brand/hero.jpg")}
          height={150}
          radius={radius.lg}
          style={styles.heroImage}
        />

        {/* CTA principale */}
        <Pressable
          onPress={() => router.push("/hub")}
          style={({ pressed }) => [
            styles.primaryCta,
            { backgroundColor: t.warm },
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Entra in TutelApp"
          testID="comune-enter-app"
        >
          <View style={styles.ctaIcon}>
            <Ionicons name="arrow-forward" size={20} color={colors.onSurface} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.primaryCtaTitle}>Entra in TutelApp</Text>
            <Text style={styles.primaryCtaSub}>
              Inizia dal punto in cui ti trovi
            </Text>
          </View>
        </Pressable>

        {/* Cosa trovi */}
        <Text style={styles.sectionLabel}>COSA PUOI FARE</Text>
        <View style={styles.features}>
          {/* Ogni scheda porta alla sua sezione: niente riquadri "finti" */}
          {FEATURES.map((feature) => (
            <Pressable
              key={feature.title}
              onPress={() => router.push(feature.href as any)}
              style={({ pressed }) => [styles.featureCard, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={feature.title}
              testID={`comune-feature-${feature.href.slice(1)}`}
            >
              <View style={[styles.featureIcon, { backgroundColor: feature.color.soft }]}>
                <Ionicons name={feature.icon} size={22} color={feature.color.main} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.onSurfaceTertiary}
                style={styles.featureChevron}
              />
            </Pressable>
          ))}
        </View>

        {/* Informazioni utili: sempre disponibili, anche offline */}
        <Text style={styles.sectionLabel}>INFORMAZIONI UTILI</Text>
        <View style={styles.infoLinks}>
          {INFO_LINKS.map((l) => (
            <Pressable
              key={l.id}
              onPress={() => router.push(l.href as any)}
              style={({ pressed }) => [styles.infoLink, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={l.title}
              testID={`comune-info-${l.id}`}
            >
              <View style={[styles.infoLinkIcon, { backgroundColor: l.color.soft }]}>
                <Ionicons name={l.icon} size={20} color={l.color.main} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.infoLinkTitle}>{l.title}</Text>
                <Text style={styles.infoLinkSub}>{l.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.onSurfaceTertiary} />
            </Pressable>
          ))}
        </View>

        {/* Messaggio istituzionale */}
        <View style={styles.infoCard}>
          <View style={[styles.infoIcon, { backgroundColor: t.warmSoft }]}>
            <Ionicons name="heart-outline" size={20} color={t.warmDark} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.infoTitle}>{comune.soggetto} resta al tuo fianco</Text>
            <Text style={styles.infoText}>
              TutelApp non sostituisce INPS, ATS, UVM o i servizi comunali.
              Ti aiuta a capire dove andare e cosa preparare.
            </Text>
          </View>
        </View>

        {/* Unioni: il tuo paese e i recapiti del municipio */}
        <PaeseCard testID="comune-home-paese" />

        {/* Contatti */}
        <View style={styles.contactCard}>
          <Text style={[styles.contactEyebrow, { color: t.warmDark }]}>HAI BISOGNO DI SUPPORTO?</Text>
          <Text style={styles.contactTitle}>{comune.ente}</Text>
          <Text style={styles.contactText}>{comune.responsabile}</Text>
          <Text style={styles.contactText}>{comune.indirizzo}</Text>

          <View style={styles.contactRows}>
            {/* Telefono ed email funzionano: toccandoli si chiama o si scrive */}
            <Pressable
              onPress={() => Linking.openURL(`tel:${comune.telefono.replace(/\s+/g, "")}`).catch(() => {})}
              style={({ pressed }) => [styles.contactRow, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`Chiama ${comune.telefono}`}
              testID="comune-home-chiama"
            >
              <Ionicons name="call-outline" size={16} color={t.warmDark} />
              <Text style={[styles.contactValue, styles.contactLink]}>{comune.telefono}</Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(`mailto:${comune.email}`).catch(() => {})}
              style={({ pressed }) => [styles.contactRow, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`Scrivi a ${comune.email}`}
              testID="comune-home-email"
            >
              <Ionicons name="mail-outline" size={16} color={t.warmDark} />
              <Text style={[styles.contactValue, styles.contactLink]}>{comune.email}</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.push("/territorio")}
            style={({ pressed }) => [styles.contactButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Scopri i servizi del territorio"
            testID="comune-territorio"
          >
            <Text style={styles.contactButtonText}>Scopri i servizi del territorio</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.onSurface} />
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Informazioni di orientamento · Verifica sempre le procedure sui canali ufficiali degli enti competenti.
          {HA_BACKEND
            ? `\nPer aiutare ${comune.soggetto.toLowerCase()} a migliorare i servizi, TutelApp conta in forma anonima quali sezioni vengono usate: nessun dato personale.`
            : ""}
        </Text>

        <Pressable
          onPress={() => router.push("/comuni")}
          style={({ pressed }) => [styles.switchLink, pressed && styles.pressed]}
          accessibilityRole="link"
          accessibilityLabel="Scegli un altro Comune"
          testID="comune-switch"
        >
          <Ionicons name="swap-horizontal-outline" size={14} color={colors.onSurfaceTertiary} />
          <Text style={styles.switchText}>
            Non sei {comune.tipo === "unione" ? "di questo territorio" : `di ${comune.nomeBreve}`}? Scegli il tuo Comune
          </Text>
        </Pressable>

        {/* Accesso discreto al cruscotto (protetto da codice) per gli operatori */}
        <Pressable
          onPress={() => router.push("/cruscotto")}
          style={({ pressed }) => [styles.switchLink, pressed && styles.pressed]}
          accessibilityRole="link"
          accessibilityLabel="Area riservata agli operatori del Comune"
          testID="comune-area-riservata"
        >
          <Ionicons name="lock-closed-outline" size={13} color={colors.onSurfaceTertiary} />
          <Text style={styles.switchText}>Area riservata agli operatori</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  demoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FBF1DC",
    borderColor: "#E8C98A",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  demoBannerText: { flex: 1, fontSize: 13, lineHeight: 19, color: "#4A3A14" },
  demoBannerStrong: { fontWeight: "800" },
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  institutionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  aderenti: {
    fontSize: 10,
    lineHeight: 15,
    color: colors.onSurfaceTertiary,
    marginTop: spacing.sm,
  },
  institutionEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },
  institutionName: {
    fontFamily: fonts.serif,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "700",
    color: colors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  brandBlock: {
    marginBottom: spacing.xl,
  },
  kicker: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: colors.onSurfaceTertiary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 31,
    lineHeight: 36,
    fontWeight: "700",
    color: colors.onSurface,
    letterSpacing: -0.6,
  },
  lead: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.onSurfaceSecondary,
    marginTop: spacing.md,
    maxWidth: 560,
  },
  heroImage: { marginBottom: spacing.xl },
  primaryCta: {
    minHeight: 76,
    borderRadius: radius.lg,
    padding: spacing.md,
    paddingLeft: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  ctaIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryCtaTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.onSurface,
  },
  primaryCtaSub: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.onSurface,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: colors.onSurfaceTertiary,
    marginBottom: spacing.md,
  },
  features: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  featureChevron: { alignSelf: "center" },
  featureTitle: {
    fontFamily: fonts.serif,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
    color: colors.onSurface,
  },
  featureText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.onSurfaceTertiary,
    marginTop: 2,
  },
  infoLinks: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  infoLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 64,
  },
  infoLinkIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLinkTitle: {
    fontFamily: fonts.serif,
    fontSize: 15,
    fontWeight: "700",
    color: colors.onSurface,
  },
  infoLinkSub: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.onSurfaceTertiary,
    marginTop: 1,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.brandSecondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.onSurface,
    marginBottom: 3,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.onSurfaceSecondary,
  },
  contactCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  contactEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  contactTitle: {
    fontFamily: fonts.serif,
    fontSize: 17,
    fontWeight: "700",
    color: colors.onSurface,
  },
  contactText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.onSurfaceTertiary,
  },
  contactRows: {
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  contactLink: { textDecorationLine: "underline" },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 36,
  },
  contactValue: {
    fontSize: 13,
    color: colors.onSurface,
    flex: 1,
  },
  contactButton: {
    marginTop: spacing.md,
    minHeight: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.onSurface,
  },
  footer: {
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    color: colors.onSurfaceTertiary,
    paddingHorizontal: spacing.md,
  },
  switchLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  switchText: {
    fontSize: 11,
    color: colors.onSurfaceTertiary,
    textDecorationLine: "underline",
  },
  pressed: { opacity: 0.78 },
});
