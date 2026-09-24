// Pagina dedicata "Aiuti sul Territorio" — versione grande con banner visivi.

import { useEffect, useState } from "react";
import {
  ImageBackground,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

import { colors, fonts, radius, spacing } from "@/src/theme";
import { storage } from "@/src/utils/storage";
import { IMAGES } from "@/src/lib/images";
import { MonoImage } from "@/src/components/MonoImage";
import { ComuneLogo } from "@/src/components/ComuneLogo";
import { PaeseCard } from "@/src/components/PaeseCard";
import {
  buildGuideHtml,
  getHelpCards,
  REGIONAL_PORTALS,
  REGIONE_KEY,
} from "@/src/lib/territorio";
import { addVaultFile } from "@/src/lib/vault";
import { comune } from "@/src/config/comune";
import { useSezione } from "@/src/lib/statistiche";

function toast(msg: string) {
  if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
  else console.log(msg);
}

export default function Territorio() {
  useSezione("territorio");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [regione, setRegione] = useState(comune.regione);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await storage.getItem<string>(REGIONE_KEY, "");
      if (r) setRegione(r);
    })();
  }, []);

  const portal = REGIONAL_PORTALS[regione];
  const t = comune.theme;
  const apri = (url: string) => Linking.openURL(url).catch(() => {});
  const cards = getHelpCards(regione);

  const downloadGuide = async () => {
    if (downloading) return;
    setDownloading(true);
    const html = buildGuideHtml(regione);
    const guideName = `Guida_Servizi_${comune.slug}.pdf`;
    try {
      if (Platform.OS === "web") {
        await Print.printAsync({ html });
        await addVaultFile(guideName);
        toast("Guida salvata anche in cassaforte");
        return;
      }
      const { uri } = await Print.printToFileAsync({ html });
      const dest = `${FileSystem.documentDirectory}${Date.now()}_guida.pdf`;
      await FileSystem.copyAsync({ from: uri, to: dest });
      await addVaultFile(guideName, dest);
      toast("Guida salvata anche in cassaforte");
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `Guida ai servizi ${comune.delEnte}`,
          UTI: "com.adobe.pdf",
        });
      } else {
        toast(`PDF salvato: ${uri}`);
      }
    } catch (e) {
      console.warn("guide pdf failed", e);
      toast("Impossibile generare la guida");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="territorio-screen">
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityLabel="Indietro"
          testID="territorio-back-btn"
        >
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Aiuti sul Territorio</Text>
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
        {/* Hero banner */}
        <ImageBackground
          source={IMAGES.territorio}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <Text style={styles.heroTitle}>
            Assistenza, Trasporti e Fisioterapia
          </Text>
          <Text style={styles.heroSub}>
            I servizi concreti vicino a casa tua, spiegati passo dopo passo.
          </Text>
        </ImageBackground>

        {/* Il Comune: primo riferimento per tutti gli aiuti */}
        <View
          style={[styles.comuneCard, { borderColor: t.warm, backgroundColor: t.warmSoft }]}
          testID="territorio-comune"
        >
          <View style={styles.comuneTop}>
            <ComuneLogo size={comune.logo ? 56 : 40} />
            <View style={styles.flex}>
              <Text style={[styles.comuneEyebrow, { color: t.warmDark }]}>
                IL PRIMO PASSO È {comune.soggetto.toUpperCase()}
              </Text>
              <Text style={styles.comuneNome}>{comune.nome}</Text>
              <Text style={styles.comuneEnte}>{comune.ente}</Text>
            </View>
          </View>
          <Text style={styles.comuneText}>
            Assistenza a casa, trasporto, contributi e ausili passano quasi sempre dai{" "}
            {comune.ente}: chiedi un colloquio, ti aiutano a capire a cosa hai diritto.
          </Text>
          {!!comune.indirizzo && (
            <Text style={styles.comuneInfo}>
              <Ionicons name="location-outline" size={13} /> {comune.indirizzo}
            </Text>
          )}
          {!!comune.orari && (
            <Text style={styles.comuneInfo}>
              <Ionicons name="time-outline" size={13} /> {comune.orari}
            </Text>
          )}
          <View style={styles.comuneActions}>
            {!!comune.telefono && (
              <Pressable
                onPress={() => apri(`tel:${comune.telefono.replace(/\s/g, "")}`)}
                style={[styles.actionBtn, { backgroundColor: t.warm }]}
                accessibilityRole="button"
                testID="territorio-comune-tel"
              >
                <Ionicons name="call-outline" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Chiama</Text>
              </Pressable>
            )}
            {!!comune.email && (
              <Pressable
                onPress={() => apri(`mailto:${comune.email}`)}
                style={[styles.actionBtnGhost, { borderColor: t.warm }]}
                accessibilityRole="button"
                testID="territorio-comune-mail"
              >
                <Ionicons name="mail-outline" size={16} color={t.warmDark} />
                <Text style={[styles.actionBtnGhostText, { color: t.warmDark }]}>Email</Text>
              </Pressable>
            )}
            {!!comune.sitoWeb && (
              <Pressable
                onPress={() => apri(comune.sitoWeb)}
                style={[styles.actionBtnGhost, { borderColor: t.warm }]}
                accessibilityRole="button"
                testID="territorio-comune-web"
              >
                <Ionicons name="globe-outline" size={16} color={t.warmDark} />
                <Text style={[styles.actionBtnGhostText, { color: t.warmDark }]}>Sito</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Unioni: il municipio di residenza */}
        <PaeseCard testID="territorio-paese" />

        {/* Servizi del territorio indicati dal Comune */}
        {comune.puntiSupporto.length > 0 && (
          <View style={styles.section} testID="territorio-punti">
            <Text style={styles.sectionTitle}>Servizi del territorio</Text>
            {comune.puntiSupporto.map((p) => (
              <Pressable
                key={p.title}
                onPress={() =>
                  apri(p.action.type === "tel" ? `tel:${p.action.value}` : p.action.value)
                }
                style={({ pressed }) => [styles.punto, pressed && { opacity: 0.85 }]}
                accessibilityRole="button"
              >
                <View style={[styles.puntoIcon, { backgroundColor: t.warmSoft }]}>
                  <Ionicons name={p.icon} size={18} color={t.warmDark} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.puntoTitle}>{p.title}</Text>
                  <Text style={styles.puntoSub}>{p.subtitle}</Text>
                </View>
                <Ionicons
                  name={p.action.type === "tel" ? "call-outline" : "open-outline"}
                  size={18}
                  color={t.warmDark}
                />
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Cosa puoi chiedere</Text>

        {/* Schede grandi con banner visivi */}
        {cards.map((c) => (
          <View
            key={c.id}
            style={[styles.card, { borderLeftColor: c.color }]}
            testID={`territorio-card-${c.id}`}
          >
            <MonoImage source={c.image} height={120} radius={0} />
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: c.soft }]}>
                  <Ionicons name={c.icon} size={22} color={c.color} />
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.cardLabel, { color: c.color }]}>
                    {c.label}
                  </Text>
                  <Text style={styles.cardTitle}>{c.title}</Text>
                </View>
              </View>
              <Text style={styles.cardText}>{c.body}</Text>
              <View style={styles.rows}>
                {c.rows.map((r) => (
                  <View key={r.label} style={styles.row}>
                    <View style={[styles.rowBadge, { backgroundColor: c.soft }]}>
                      <Text style={[styles.rowBadgeText, { color: c.dark }]}>
                        {r.label}
                      </Text>
                    </View>
                    <Text style={styles.rowText}>{r.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}

        {/* Portale regionale: informazione secondaria */}
        {portal && (
          <Pressable
            onPress={() => apri(portal.url)}
            style={styles.regionLine}
            hitSlop={6}
            testID="territorio-portal-link"
          >
            <Ionicons name="information-circle-outline" size={16} color={colors.onSurfaceTertiary} />
            <Text style={styles.regionLineText}>
              Regole della Regione {regione}: <Text style={styles.regionLink}>{portal.label} ↗</Text>
            </Text>
          </Pressable>
        )}

        {/* Download guide */}
        <Pressable
          onPress={downloadGuide}
          disabled={downloading}
          style={({ pressed }) => [
            styles.guideBtn,
            downloading && { opacity: 0.7 },
            pressed && { opacity: 0.85 },
          ]}
          accessibilityRole="button"
          testID="territorio-guide-btn"
        >
          <Ionicons
            name="download-outline"
            size={18}
            color={colors.onBrandPrimary}
          />
          <Text style={styles.guideBtnText}>
            {downloading
              ? "Preparazione guida…"
              : `Scarica la guida ai servizi ${comune.delEnte}`}
          </Text>
        </Pressable>
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

  hero: {
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  // misure esplicite: sul web le immagini incluse nell'app non devono usare la grandezza del file
  heroImage: { borderRadius: 16, width: "100%", height: "100%" },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(237,230,216,0.82)",
  },
  heroTitle: {
    color: colors.onSurface,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  heroSub: {
    color: colors.onSurface,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },

  comuneCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  comuneTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  comuneEyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  comuneNome: {
    fontFamily: fonts.serif,
    fontSize: 19,
    fontWeight: "700",
    color: colors.onSurface,
    marginTop: 2,
  },
  comuneEnte: { fontSize: 13, color: colors.onSurfaceSecondary, marginTop: 1 },
  comuneText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.onSurface,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  comuneInfo: { fontSize: 12, lineHeight: 18, color: colors.onSurfaceSecondary },
  comuneActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
  },
  actionBtnText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  actionBtnGhost: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
  },
  actionBtnGhostText: { fontSize: 14, fontWeight: "800" },

  section: { marginBottom: spacing.md },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 17,
    fontWeight: "700",
    color: colors.onSurface,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  punto: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  puntoIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  puntoTitle: { fontSize: 14, fontWeight: "800", color: colors.onSurface },
  puntoSub: { fontSize: 12, lineHeight: 17, color: colors.onSurfaceSecondary, marginTop: 2 },

  regionLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    paddingVertical: spacing.sm,
  },
  regionLineText: { flex: 1, fontSize: 12, lineHeight: 17, color: colors.onSurfaceTertiary },
  regionLink: { fontWeight: "700", textDecorationLine: "underline" },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  cardBody: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.onSurface,
    lineHeight: 20,
    marginTop: 2,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.onSurfaceSecondary,
    marginBottom: spacing.md,
  },
  rows: { gap: spacing.sm },
  row: { gap: 4 },
  rowBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  rowBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  rowText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.onSurfaceSecondary,
  },

  guideBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.brandPrimary,
    minHeight: 54,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  guideBtnText: {
    color: colors.onBrandPrimary,
    fontSize: 13,
    fontWeight: "800",
  },
});
