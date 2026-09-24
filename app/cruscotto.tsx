// Cruscotto del Comune — statistiche anonime e aggregate.
// Pagina riservata (link diretto /cruscotto, non visibile ai cittadini),
// protetta da un codice di accesso per Comune impostato sul backend.
// "Guarda con dati di esempio" mostra il cruscotto senza backend (per le demo).

import { useMemo, useState } from "react";
import {
  ActivityIndicator,
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

import { comune } from "@/src/config/comune";
import { ComuneLogo } from "@/src/components/ComuneLogo";
import { AREE } from "@/src/lib/progetto";
import { colors, fonts, radius, spacing } from "@/src/theme";

import { BACKEND_URL, HA_BACKEND } from "@/src/config/servizi";

type Voce = { v: string; n: number | null };
type Dati = {
  mesi: string[];
  soglia: number;
  visitePerMese: { mese: string; n: number | null }[];
  metriche: Record<string, Voce[]>;
};

// ---------- Etichette leggibili ----------
const ETICHETTE: Record<string, Record<string, string>> = {
  momento: {
    diagnosi: "Ho appena ricevuto una diagnosi",
    iter: "Sto seguendo un iter",
    diritti: "Voglio capire i miei diritti",
  },
  tappa: {
    richiesta: "Richiesta inviata",
    presa_carico: "Presa in carico dei Servizi Sociali",
    uvm: "Convocazione UVM",
    progetto: "Progetto di Vita attivo",
    completato: "Percorso completato",
  },
  area_progetto: Object.fromEntries(AREE.map((a) => [a.id, a.title])),
  sezione: {
    home: "Pagina iniziale",
    orientarsi: "Orientarsi insieme",
    percorso: "Percorso per il riconoscimento",
    diritti: "I tuoi diritti",
    progetto: "Il mio Progetto di Vita",
    pratica: "La mia pratica",
    supporto: "Punti di supporto",
    "primi-passi": "Primi passi dopo una diagnosi",
    territorio: "Aiuti sul territorio",
    riforma: "Cosa cambia con la riforma",
    faq: "Domande frequenti",
    importi: "Importi aggiornati",
    "domande-104": "Domande sulla 104",
  },
};
const etichetta = (m: string, v: string) => ETICHETTE[m]?.[v] ?? v;

const MESI_IT = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
const nomeMese = (ym: string) => MESI_IT[Number(ym.slice(5, 7)) - 1] ?? ym;

// ---------- Dati di esempio (solo per le demo) ----------
function datiDiEsempio(): Dati {
  const k = comune.tipo === "unione" ? 0.6 : 1;
  const r = (n: number) => Math.round(n * k);
  const now = new Date();
  const mesi = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const trend = [38, 52, 61, 74, 88, 103];
  const metriche: Record<string, Voce[]> = {
    momento: [
      { v: "diagnosi", n: r(96) },
      { v: "diritti", n: r(71) },
      { v: "iter", n: r(44) },
    ],
    tappa: [
      { v: "richiesta", n: r(31) },
      { v: "presa_carico", n: r(22) },
      { v: "uvm", n: r(14) },
      { v: "progetto", n: r(6) },
      { v: "completato", n: null },
    ],
    area_progetto: [
      { v: "casa", n: r(41) },
      { v: "autonomia", n: r(37) },
      { v: "salute", n: r(33) },
      { v: "relazioni", n: r(24) },
      { v: "lavoro", n: r(18) },
      { v: "tempo", n: r(15) },
    ],
    desiderio: [
      { v: "Avere un trasporto per visite e appuntamenti", n: r(29) },
      { v: "Muovermi in autonomia in città", n: r(23) },
      { v: "Usare ausili e tecnologie che mi aiutano", n: r(17) },
      { v: "Gestire da solo/a soldi e pratiche", n: r(11) },
    ],
    chi: [
      { v: "Un genitore", n: r(58) },
      { v: "Io stesso/a", n: r(39) },
      { v: "Un figlio o una figlia", n: r(21) },
      { v: "Coniuge/Partner", n: r(12) },
    ],
    quando: [
      { v: "Meno di 30 giorni fa", n: r(47) },
      { v: "Da 1 a 6 mesi fa", n: r(52) },
      { v: "Oltre 6 mesi fa", n: r(31) },
    ],
    verbale: [
      { v: "No, non ancora", n: r(64) },
      { v: "Domanda già presentata", n: r(33) },
      { v: "Sì, ho già un verbale", n: r(24) },
      { v: "Non lo so", n: r(9) },
    ],
    certificato: [
      { v: "No", n: r(61) },
      { v: "Non so cos'è", n: r(42) },
      { v: "Sì", n: r(27) },
    ],
    sezione: [
      { v: "diritti", n: r(118) },
      { v: "pratica", n: r(84) },
      { v: "progetto", n: r(66) },
      { v: "supporto", n: r(59) },
      { v: "riforma", n: r(51) },
      { v: "importi", n: r(33) },
    ],
    progetto_pdf: [{ v: "creato", n: r(26) }],
    questionario: [{ v: "completato", n: r(130) }],
  };
  if (comune.paesi) {
    const pesi = [9, 6, 3, 5, 2, 4, 8, 3, 7, 22, 2, 3];
    metriche.paese = comune.paesi
      .map((p, i) => ({ v: p.nome, n: (pesi[i] ?? 3) >= 5 ? pesi[i] : null }))
      .sort((a, b) => (b.n ?? 0) - (a.n ?? 0));
  }
  return {
    mesi,
    soglia: 5,
    visitePerMese: mesi.map((m, i) => ({ mese: m, n: r(trend[i]) })),
    metriche,
  };
}

// ---------- Pezzi grafici ----------
function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue}>{value}</Text>
      {sub ? <Text style={styles.tileSub}>{sub}</Text> : null}
    </View>
  );
}

/** Classifica a barre orizzontali, una sola tinta (quella del Comune). */
function BarList({
  title,
  hint,
  metrica,
  voci,
  max = 8,
}: {
  title: string;
  hint?: string;
  metrica: string;
  voci?: Voce[];
  max?: number;
}) {
  const bar = comune.theme.warmDark;
  const righe = (voci ?? []).slice(0, max);
  const top = Math.max(1, ...righe.map((r) => r.n ?? 0));
  return (
    <View style={styles.card} testID={`cruscotto-${metrica}`}>
      <Text style={styles.cardTitle}>{title}</Text>
      {hint ? <Text style={styles.cardHint}>{hint}</Text> : null}
      {righe.length === 0 ? (
        <Text style={styles.empty}>Ancora nessun dato.</Text>
      ) : (
        righe.map((r) => (
          <View
            key={r.v}
            style={styles.barRow}
            accessible
            accessibilityLabel={`${etichetta(metrica, r.v)}: ${r.n ?? "meno di 5"}`}
          >
            <View style={styles.barHead}>
              <Text style={styles.barLabel} numberOfLines={2}>
                {etichetta(metrica, r.v)}
              </Text>
              <Text style={[styles.barValue, r.n === null && styles.barValueMuted]}>
                {r.n === null ? "meno di 5" : r.n}
              </Text>
            </View>
            <View style={styles.track}>
              {r.n !== null && r.n > 0 ? (
                <View
                  style={[
                    styles.fill,
                    { width: `${Math.max(2, (r.n / top) * 100)}%`, backgroundColor: bar },
                  ]}
                />
              ) : null}
            </View>
          </View>
        ))
      )}
    </View>
  );
}

/** Persone al mese: colonne verticali, una tinta. */
function MesiChart({ dati }: { dati: Dati["visitePerMese"] }) {
  const bar = comune.theme.warmDark;
  const top = Math.max(1, ...dati.map((d) => d.n ?? 0));
  return (
    <View style={styles.card} testID="cruscotto-mesi">
      <Text style={styles.cardTitle}>Persone che hanno usato TutelApp, mese per mese</Text>
      <Text style={styles.cardHint}>Ogni dispositivo conta una volta al mese.</Text>
      <View style={styles.cols}>
        {dati.map((d) => (
          <View
            key={d.mese}
            style={styles.col}
            accessible
            accessibilityLabel={`${nomeMese(d.mese)}: ${d.n ?? "meno di 5"}`}
          >
            <Text style={styles.colValue}>{d.n === null ? "<5" : d.n}</Text>
            <View style={styles.colTrack}>
              {d.n ? (
                <View
                  style={[
                    styles.colFill,
                    { height: `${Math.max(3, (d.n / top) * 100)}%`, backgroundColor: bar },
                  ]}
                />
              ) : null}
            </View>
            <Text style={styles.colLabel}>{nomeMese(d.mese)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const somma = (voci?: Voce[]) => (voci ?? []).reduce((t, v) => t + (v.n ?? 0), 0);

// ---------- Pagina ----------
export default function Cruscotto() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = comune.theme;

  const [codice, setCodice] = useState("");
  const [dati, setDati] = useState<Dati | null>(null);
  const [esempio, setEsempio] = useState(false);
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState("");

  const entra = async () => {
    if (!codice.trim() || caricamento) return;
    setErrore("");
    setCaricamento(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/stats/${comune.slug}?mesi=6`, {
        headers: { "X-Codice": codice.trim() },
      });
      if (res.status === 401) throw new Error("Codice non valido per questo Comune.");
      if (!res.ok) throw new Error("Il servizio non risponde. Riprova più tardi.");
      setDati((await res.json()) as Dati);
      setEsempio(false);
    } catch (e: any) {
      setErrore(e?.message || "Errore di connessione.");
    } finally {
      setCaricamento(false);
    }
  };

  const mostraEsempio = () => {
    setDati(datiDiEsempio());
    setEsempio(true);
    setErrore("");
  };

  const kpi = useMemo(() => {
    if (!dati) return null;
    const ultimo = dati.visitePerMese[dati.visitePerMese.length - 1]?.n;
    return {
      ultimoMese: ultimo === null || ultimo === undefined ? "<5" : String(ultimo),
      questionari: somma(dati.metriche.questionario),
      progetti: somma(dati.metriche.progetto_pdf),
      senzaCertificato:
        (dati.metriche.certificato ?? [])
          .filter((v) => v.v !== "Sì")
          .reduce((tot, v) => tot + (v.n ?? 0), 0),
    };
  }, [dati]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.cream }]} edges={["top"]} testID="cruscotto-screen">
      <StatusBar barStyle="dark-content" backgroundColor={t.cream} />
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + spacing.xxl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            hitSlop={12}
            style={styles.back}
            accessibilityLabel="Indietro"
          >
            <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
          </Pressable>
          <ComuneLogo size={comune.logo ? 52 : 36} />
          <View style={styles.flex}>
            <Text style={[styles.eyebrow, { color: t.warmDark }]}>CRUSCOTTO RISERVATO</Text>
            <Text style={styles.headerTitle}>{comune.nome}</Text>
          </View>
        </View>

        {!dati ? (
          <View style={styles.card}>
            <Text style={styles.title}>Cosa chiedono i tuoi cittadini</Text>
            <Text style={styles.lead}>
              Statistiche anonime su come viene usata TutelApp: in che momento del
              percorso si trovano le persone, a che punto sono le pratiche, cosa
              conta per loro nel Progetto di Vita. Utili per programmare i servizi.
            </Text>
            {HA_BACKEND ? (
            <>
            <Text style={styles.inputLabel}>Codice di accesso {comune.delEnte}</Text>
            <TextInput
              value={codice}
              onChangeText={setCodice}
              onSubmitEditing={entra}
              placeholder="Inserisci il codice"
              placeholderTextColor={colors.onSurfaceTertiary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              accessibilityLabel="Codice di accesso"
              testID="cruscotto-codice"
            />
            {errore ? <Text style={styles.error}>{errore}</Text> : null}
            <Pressable
              onPress={entra}
              style={({ pressed }) => [styles.primary, { backgroundColor: t.warm }, pressed && styles.pressed]}
              accessibilityRole="button"
              testID="cruscotto-entra"
            >
              {caricamento ? (
                <ActivityIndicator color={colors.onSurface} />
              ) : (
                <Text style={styles.primaryText}>Apri il cruscotto</Text>
              )}
            </Pressable>
            </>
            ) : (
              <Text style={styles.cardHint}>
                Le statistiche reali saranno disponibili quando il servizio sarà
                attivo. Intanto puoi vedere come funziona il cruscotto.
              </Text>
            )}
            <Pressable
              onPress={mostraEsempio}
              style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
              accessibilityRole="button"
              testID="cruscotto-esempio"
            >
              <Text style={styles.secondaryText}>Guarda con dati di esempio</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {esempio ? (
              <View style={[styles.banner, { backgroundColor: t.warmSoft }]} testID="cruscotto-banner-esempio">
                <Ionicons name="information-circle-outline" size={18} color={t.warmDark} />
                <Text style={styles.bannerText}>
                  Dati di esempio, inventati per mostrare il cruscotto. Non sono dati reali.
                </Text>
              </View>
            ) : null}

            <View style={styles.tiles}>
              <Tile label="Persone questo mese" value={kpi!.ultimoMese} sub="dispositivi diversi" />
              <Tile label="Questionari completati" value={String(kpi!.questionari)} sub="ultimi 6 mesi" />
              <Tile label="Progetti di Vita preparati" value={String(kpi!.progetti)} sub="PDF creati" />
              <Tile label="Senza certificato introduttivo" value={String(kpi!.senzaCertificato)} sub="da orientare al medico" />
            </View>

            <MesiChart dati={dati.visitePerMese} />

            <BarList
              title="In che momento del percorso sono"
              hint="Risposta alla domanda «In che momento sei?»"
              metrica="momento"
              voci={dati.metriche.momento}
            />
            <BarList
              title="A che punto è la loro pratica"
              hint="Tappe raggiunte nel tracker «La mia pratica»"
              metrica="tappa"
              voci={dati.metriche.tappa}
            />
            <BarList
              title="Cosa conta nel Progetto di Vita"
              hint="Aree compilate nei Progetti di Vita preparati"
              metrica="area_progetto"
              voci={dati.metriche.area_progetto}
            />
            <BarList
              title="I desideri più scelti"
              hint="Solo tra quelli suggeriti dall'app, mai i testi scritti dalle persone"
              metrica="desiderio"
              voci={dati.metriche.desiderio}
              max={6}
            />
            {comune.paesi ? (
              <BarList
                title="Da quali Comuni dell'Unione"
                metrica="paese"
                voci={dati.metriche.paese}
                max={12}
              />
            ) : null}
            <BarList title="Chi ha ricevuto la diagnosi" metrica="chi" voci={dati.metriche.chi} />
            <BarList title="Da quanto tempo" metrica="quando" voci={dati.metriche.quando} />
            <BarList
              title="Hanno già un verbale di invalidità o di Legge 104?"
              hint="Chi non ce l'ha ancora deve prima ottenere il riconoscimento; chi ce l'ha può chiedere il Progetto di Vita"
              metrica="verbale"
              voci={dati.metriche.verbale}
            />
            <BarList
              title="Hanno già il certificato medico introduttivo?"
              hint="Solo tra chi non ha ancora un verbale"
              metrica="certificato"
              voci={dati.metriche.certificato}
            />
            <BarList
              title="Le sezioni più consultate"
              metrica="sezione"
              voci={dati.metriche.sezione}
            />

            <View style={styles.privacy}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
              <Text style={styles.privacyText}>
                Nessun dato personale: TutelApp conta solo categorie predefinite,
                senza nomi, testi scritti o identificativi. I numeri da 1 a{" "}
                {dati.soglia - 1} sono nascosti («meno di 5») per non rendere
                riconoscibile nessuno.
              </Text>
            </View>

            <Pressable
              onPress={() => {
                setDati(null);
                setCodice("");
                setEsempio(false);
              }}
              style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryText}>Esci dal cruscotto</Text>
            </Pressable>
          </>
        )}

        {/* Solo per il team TutelApp: controllo degli importi (serve il codice amministratore) */}
        {HA_BACKEND && (
        <Pressable
          onPress={() => router.push("/sentinella")}
          style={({ pressed }) => [styles.adminLink, pressed && styles.pressed]}
          accessibilityRole="link"
          testID="cruscotto-sentinella"
        >
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.onSurfaceTertiary} />
          <Text style={styles.adminLinkText}>Team TutelApp · Sentinella importi e riforma</Text>
        </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, maxWidth: 720, width: "100%", alignSelf: "center" },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.xl },
  back: { width: 32, height: 40, alignItems: "center", justifyContent: "center" },
  eyebrow: { fontSize: 9, fontWeight: "800", letterSpacing: 1, marginBottom: 2 },
  headerTitle: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 23, fontWeight: "700", color: colors.onSurface },
  title: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 28, fontWeight: "700", color: colors.onSurface },
  lead: { fontSize: 14, lineHeight: 21, color: colors.onSurfaceSecondary, marginTop: spacing.sm, marginBottom: spacing.lg },
  inputLabel: { fontSize: 12, fontWeight: "700", color: colors.onSurface, marginBottom: spacing.xs },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.onSurface,
  },
  error: { fontSize: 13, color: "#8A3F1A", marginTop: spacing.sm },
  primary: {
    minHeight: 52,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  primaryText: { fontSize: 15, fontWeight: "800", color: colors.onSurface },
  secondary: {
    minHeight: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
  },
  secondaryText: { fontSize: 14, fontWeight: "700", color: colors.onSurface },
  pressed: { opacity: 0.8 },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bannerText: { flex: 1, fontSize: 12, lineHeight: 17, color: colors.onSurface, fontWeight: "600" },
  tiles: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  tile: {
    flexGrow: 1,
    flexBasis: "45%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  tileLabel: { fontSize: 11, fontWeight: "700", color: colors.onSurfaceTertiary },
  tileValue: { fontFamily: fonts.serif, fontSize: 30, fontWeight: "700", color: colors.onSurface, marginTop: 4 },
  tileSub: { fontSize: 11, color: colors.onSurfaceTertiary, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: { fontFamily: fonts.serif, fontSize: 16, lineHeight: 21, fontWeight: "700", color: colors.onSurface },
  cardHint: { fontSize: 11, lineHeight: 16, color: colors.onSurfaceTertiary, marginTop: 2 },
  empty: { fontSize: 13, color: colors.onSurfaceTertiary, marginTop: spacing.md },
  barRow: { marginTop: spacing.md },
  barHead: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm, marginBottom: 5 },
  barLabel: { flex: 1, fontSize: 13, lineHeight: 18, color: colors.onSurface },
  barValue: { fontSize: 13, fontWeight: "800", color: colors.onSurface },
  barValueMuted: { fontWeight: "600", color: colors.onSurfaceTertiary, fontSize: 11 },
  track: { height: 10, borderRadius: 4, backgroundColor: colors.surfaceTertiary, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4 },
  cols: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm, marginTop: spacing.lg, height: 170 },
  col: { flex: 1, alignItems: "center", height: "100%" },
  colValue: { fontSize: 12, fontWeight: "800", color: colors.onSurface, marginBottom: 4 },
  colTrack: { flex: 1, width: "70%", justifyContent: "flex-end" },
  colFill: { width: "100%", borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  colLabel: { fontSize: 11, color: colors.onSurfaceTertiary, marginTop: 6 },
  adminLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  adminLinkText: { fontSize: 11, color: colors.onSurfaceTertiary, textDecorationLine: "underline" },
  privacy: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
    marginBottom: spacing.sm,
  },
  privacyText: { flex: 1, fontSize: 12, lineHeight: 18, color: colors.onSurface },
});
