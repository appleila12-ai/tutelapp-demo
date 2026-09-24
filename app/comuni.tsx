// Scegli il tuo Comune — elenco degli enti che offrono TutelApp.
// Pensato per crescere fino a centinaia di Comuni:
//  - ricerca per nome, provincia o regione (senza badare ad accenti e maiuscole);
//  - cercando un paese che fa parte di un'Unione (es. "Mombaruzzo") si trova
//    l'Unione, e il paese viene già impostato come "il tuo Comune";
//  - elenco raggruppato per regione, in ordine alfabetico.

import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@react-native-vector-icons/ionicons";

import { Wordmark } from "@/src/components/Brand";
import {
  COMUNI,
  chiavePerComune,
  comuneScelto,
  getComuneAttivo,
  setComuneAttivo,
  type ComuneConfig,
} from "@/src/config/comune";
import { PAESE_KEY, salvaPaese } from "@/src/lib/paese";
import { colors, fonts, radius, spacing } from "@/src/theme";

/** Minuscolo e senza accenti/apostrofi, per confrontare i nomi. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’`.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type Risultato = { comune: ComuneConfig; paese?: string };

function cerca(query: string): Risultato[] {
  const q = norm(query);
  const tutti = [...COMUNI].sort((a, b) => a.nomeBreve.localeCompare(b.nomeBreve, "it"));
  if (!q) return tutti.map((comune) => ({ comune }));

  const risultati: Risultato[] = [];
  for (const c of tutti) {
    const campi = [c.nome, c.nomeBreve, c.provincia, c.regione].map(norm);
    if (campi.some((f) => f.includes(q))) {
      risultati.push({ comune: c });
      continue;
    }
    const paese = c.paesi?.find((p) => norm(p.nome).includes(q));
    if (paese) risultati.push({ comune: c, paese: paese.nome });
  }
  return risultati;
}

export default function ScegliComune() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Primo accesso: nessun Comune ancora scelto (niente "indietro", niente evidenziato)
  const primoAccesso = !comuneScelto();
  const attivo = primoAccesso ? "" : getComuneAttivo().slug;
  const [query, setQuery] = useState("");

  const risultati = useMemo(() => cerca(query), [query]);

  // Raggruppa per regione (in ordine alfabetico)
  const gruppi = useMemo(() => {
    const m = new Map<string, Risultato[]>();
    risultati.forEach((r) => {
      const k = r.comune.regione;
      m.set(k, [...(m.get(k) ?? []), r]);
    });
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b, "it"));
  }, [risultati]);

  const scegli = async ({ comune: c, paese }: Risultato) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      // Se si è cercato un paese dell'Unione, lo si imposta già come "il tuo Comune"
      if (paese) {
        try {
          window.localStorage.setItem(chiavePerComune(PAESE_KEY, c.slug), JSON.stringify(paese));
        } catch {
          /* ignora */
        }
      }
      // Sul web si ricarica col link del Comune: così è anche condivisibile.
      window.location.href = `/?comune=${encodeURIComponent(c.slug)}`;
      return;
    }
    setComuneAttivo(c.slug);
    if (paese) await salvaPaese(paese);
    setTimeout(() => router.replace("/"), 0);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]} testID="comuni-screen">
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + spacing.xxl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[2]}
      >
        <View style={styles.header}>
          {!primoAccesso && (
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
              style={styles.back}
              hitSlop={12}
              accessibilityLabel="Indietro"
              testID="comuni-back"
            >
              <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
            </Pressable>
          )}
          <Wordmark size={primoAccesso ? "md" : "sm"} />
        </View>

        <View>
          {primoAccesso ? (
            <>
              <Text style={styles.title}>Benvenuto in TutelApp</Text>
              <Text style={styles.lead}>
                Per iniziare, cerca il tuo Comune: troverai i contatti, gli sportelli
                e i servizi del tuo territorio. Lo sceglierai una volta sola.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>Scegli il tuo Comune</Text>
              <Text style={styles.lead}>
                TutelApp è offerta dal tuo Comune: scegliendolo trovi i contatti, gli
                sportelli e i servizi del tuo territorio. I tuoi dati restano separati
                per ogni Comune.
              </Text>
            </>
          )}
        </View>

        {/* Ricerca (resta in alto mentre si scorre) */}
        <View style={styles.searchWrap}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.onSurfaceTertiary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Cerca il tuo Comune, la provincia o la regione"
              placeholderTextColor={colors.onSurfaceTertiary}
              style={styles.searchInput}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              accessibilityLabel="Cerca il tuo Comune"
              testID="comuni-search"
            />
            {query ? (
              <Pressable
                onPress={() => setQuery("")}
                hitSlop={10}
                accessibilityLabel="Cancella la ricerca"
                testID="comuni-search-clear"
              >
                <Ionicons name="close-circle" size={18} color={colors.onSurfaceTertiary} />
              </Pressable>
            ) : null}
          </View>
          <Text style={styles.count} testID="comuni-count">
            {query
              ? `${risultati.length} ${risultati.length === 1 ? "risultato" : "risultati"}`
              : `${COMUNI.length} enti aderenti`}
          </Text>
        </View>

        {gruppi.map(([regione, voci]) => (
          <View key={regione} style={styles.group}>
            <Text style={styles.groupLabel}>{regione.toUpperCase()}</Text>
            <View style={styles.list}>
              {voci.map((r) => {
                const c = r.comune;
                const selected = c.slug === attivo;
                return (
                  <Pressable
                    key={c.slug}
                    onPress={() => scegli(r)}
                    style={({ pressed }) => [
                      styles.card,
                      selected && { borderColor: c.theme.warmDark, borderWidth: 1.5 },
                      pressed && { opacity: 0.85 },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`Scegli ${c.nome}${r.paese ? `, comune di ${r.paese}` : ""}`}
                    testID={`comuni-item-${c.slug}`}
                  >
                    <View style={[styles.dot, { backgroundColor: c.theme.warmSoft, borderColor: c.theme.warm }]}>
                      <Text style={[styles.dotText, { color: c.theme.warmDark }]}>
                        {c.nomeBreve.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.flex}>
                      <Text style={styles.cardTitle}>{c.nome}</Text>
                      <Text style={styles.cardSub}>
                        {r.paese
                          ? `Comprende ${r.paese} · ${c.provincia}`
                          : c.tipo === "unione" && c.paesi
                            ? `${c.paesi.length} Comuni · ${c.provincia}`
                            : `Provincia di ${c.provincia}`}
                        {c.dimostrativo ? " · demo" : ""}
                      </Text>
                    </View>
                    {selected ? (
                      <Ionicons name="checkmark-circle" size={22} color={c.theme.warmDark} />
                    ) : (
                      <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceTertiary} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {query && risultati.length === 0 ? (
          <View style={styles.empty} testID="comuni-empty">
            <Ionicons name="location-outline" size={22} color={colors.onSurfaceTertiary} />
            <Text style={styles.emptyTitle}>
              «{query.trim()}» non aderisce ancora a TutelApp
            </Text>
            <Text style={styles.emptyText}>
              Puoi comunque usare le informazioni generali scegliendo un Comune vicino,
              oppure chiedere ai Servizi Sociali del tuo Comune di aderire.
            </Text>
          </View>
        ) : (
          <Text style={styles.note}>
            Il tuo Comune non è in elenco? Chiedi ai Servizi Sociali se aderisce a
            TutelApp.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    color: colors.onSurface,
  },
  lead: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.onSurfaceSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchWrap: {
    backgroundColor: colors.background,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 50,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.md,
  },
  searchInput: { flex: 1, fontSize: 16, color: colors.onSurface, paddingVertical: 10 },
  count: { fontSize: 11, color: colors.onSurfaceTertiary, marginTop: spacing.sm, marginLeft: 4 },
  group: { marginTop: spacing.md },
  groupLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: colors.onSurfaceTertiary,
    marginBottom: spacing.sm,
  },
  list: { gap: spacing.sm },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 68,
  },
  dot: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: { fontFamily: fonts.serif, fontSize: 18, fontWeight: "700" },
  cardTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    fontWeight: "700",
    color: colors.onSurface,
  },
  cardSub: { fontSize: 12, color: colors.onSurfaceTertiary, marginTop: 2 },
  empty: {
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    fontWeight: "700",
    color: colors.onSurface,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.onSurfaceSecondary,
    textAlign: "center",
  },
  note: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.onSurfaceTertiary,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
