import { useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import catalog from "@/src/content/benefici.json";
import { colors, radius, spacing } from "@/src/theme";

const filters = [
  { id: "tutti", label: "Tutti" }, { id: "lavoro", label: "Lavoro" },
  { id: "salute", label: "Salute e ausili" }, { id: "mobilita", label: "Mobilità" },
  { id: "economia", label: "Sostegni economici" }, { id: "territorio", label: "Territorio" },
];

export function BenefitsScreen({ inail = false }: { inail?: boolean }) {
  const router = useRouter();
  const [filter, setFilter] = useState("tutti");
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState("");
  const benefits = catalog.benefits.filter((b) =>
    (!inail || b.paths.includes("inail")) && (filter === "tutti" || b.category === filter));
  const sources = catalog.sources as Record<string, { label: string; url: string }>;
  const openSource = async (url: string) => {
    setError("");
    try { await Linking.openURL(url); }
    catch { setError("Non riesco ad aprire la fonte. Riprova oppure copia il collegamento mostrato nella scheda."); }
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.button}>
          <Text style={styles.buttonText}>Indietro</Text>
        </Pressable>
        <Text style={styles.kicker}>TUTELAPP · ORIENTARSI INSIEME</Text>
        <Text style={styles.title} accessibilityRole="header">{inail ? "Invalidità INAIL: diritti, bonus e agevolazioni" : "Diritti, bonus e agevolazioni"}</Text>
        <Text style={styles.body}>{catalog.notice}</Text>
        <View style={styles.notice}><Text style={styles.body}>Non serve un account e non devi caricare referti. I filtri di questa pagina restano nella schermata. Solo aprendo una fonte visiti un sito esterno.</Text></View>
        <Pressable onPress={() => router.push(inail ? "/benefici" : "/inail")} accessibilityRole="button" style={styles.button}>
          <Text style={styles.buttonText}>{inail ? "Apri il catalogo generale" : "Apri il percorso INAIL"}</Text>
        </Pressable>
        <Text style={styles.note}>Un unico catalogo: la vista INAIL richiama le stesse schede, senza duplicare i benefici.</Text>
        <View style={styles.filters}>{filters.map((f) => (
          <Pressable key={f.id} onPress={() => { setFilter(f.id); setOpen(null); }} accessibilityRole="button" accessibilityState={{ selected: filter === f.id }} style={[styles.button, filter === f.id && styles.selected]} testID={`benefit-filter-${f.id}`}>
            <Text style={styles.buttonText}>{f.label}</Text>
          </Pressable>
        ))}</View>
        <Text style={styles.note} accessibilityLiveRegion="polite">{benefits.length} schede da esplorare · consultazione fonti {catalog.checkedAt}</Text>
        <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>
        {benefits.map((b) => (
          <View key={b.id} style={styles.card} testID={`benefit-${b.id}`}>
            <Pressable onPress={() => setOpen(open === b.id ? null : b.id)} accessibilityRole="button" accessibilityState={{ expanded: open === b.id }} style={styles.cardHead}>
              <Text style={styles.cardTitle}>{b.title}</Text>
              <Text style={styles.buttonText}>{open === b.id ? "Chiudi dettagli" : "Cosa verificare"}</Text>
            </Pressable>
            <Text style={styles.body}>{b.description}</Text>
            <View style={styles.tags}>{b.checks.map((check) => <Text key={check} style={styles.tag}>{check}</Text>)}</View>
            {open === b.id && <View style={styles.details}>
              <Text style={styles.cardTitle}>Il prossimo passo</Text>
              <Text style={styles.body}>{b.nextStep}</Text>
              {b.sourceIds.map((id) => <View key={id}>
                <Pressable accessibilityRole="link" onPress={() => openSource(sources[id].url)} style={styles.button}>
                  <Text style={styles.link}>{sources[id].label} · sito esterno</Text>
                </Pressable>
                <Text selectable style={styles.note}>{sources[id].url}</Text>
              </View>)}
              {!b.sourceIds.length && <Text style={styles.note}>Serve una fonte locale specifica prima di indicare un bando o un diritto.</Text>}
            </View>}
          </View>
        ))}
        <Text style={styles.note}>Le condizioni possono cambiare. La data indica la consultazione delle fonti, non un accertamento personale. La guida fiscale indicata è un’edizione precedente: prima di una spesa verifica le istruzioni fiscali correnti. Le etichette non sono un esito di ammissibilità.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  page: { padding: spacing.lg, gap: spacing.md, maxWidth: 900, width: "100%", alignSelf: "center" },
  kicker: { fontSize: 12, fontWeight: "700", color: colors.onSurfaceSecondary },
  title: { fontSize: 28, lineHeight: 36, fontWeight: "700", color: colors.onSurface },
  body: { fontSize: 16, lineHeight: 24, color: colors.onSurfaceSecondary },
  notice: { padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.brandSecondary },
  button: { padding: spacing.md, minHeight: 48, justifyContent: "center", borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  buttonText: { fontSize: 14, fontWeight: "600", color: colors.onSurface },
  selected: { backgroundColor: colors.brandSecondary },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  card: { backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.md, borderRadius: radius.lg, borderColor: colors.border, borderWidth: 1 },
  cardHead: { minHeight: 48, gap: spacing.sm },
  cardTitle: { fontSize: 19, lineHeight: 27, fontWeight: "700", color: colors.onSurface },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  tag: { fontSize: 12, padding: spacing.sm, borderRadius: radius.md, color: colors.onSurface, backgroundColor: colors.brandSecondary },
  details: { gap: spacing.md, paddingTop: spacing.md },
  link: { fontSize: 14, color: colors.onSurface, textDecorationLine: "underline" },
  note: { fontSize: 13, lineHeight: 20, color: colors.onSurfaceSecondary },
  error: { fontSize: 14, color: colors.onSurface },
});
