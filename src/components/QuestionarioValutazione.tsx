// Questionario di valutazione — tutte le domande su una sola schermata,
// con bottone finale "Vedi i tuoi diritti" che salva il report e apre i risultati.
// Il bottone è sempre attivo: se manca una risposta dice quale e ci porta lì
// (niente bottoni grigi che sembrano rotti).

import { useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";

import { colors, fonts, radius, spacing, topics } from "@/src/theme";
import {
  Answers,
  CertOption,
  Report,
  saveReport,
  VerbaleOption,
  WhenOption,
  WhoOption,
  WorkOption,
} from "@/src/lib/reports";
import { CERT_EXPLAINER, PARTNER_NOTE } from "@/src/lib/content";
import { registra } from "@/src/lib/statistiche";

const WHO_OPTIONS: WhoOption[] = [
  "Io stesso/a",
  "Un genitore",
  "Un figlio o una figlia",
  "Coniuge/Partner",
  "Un altro familiare",
  "Una persona che assisto",
];
const WHEN_OPTIONS: WhenOption[] = [
  "Meno di 30 giorni fa",
  "Da 1 a 6 mesi fa",
  "Oltre 6 mesi fa",
];
const WORK_OPTIONS: WorkOption[] = [
  "Dipendente privato",
  "Dipendente pubblico",
  "Lavoratore autonomo",
  "Studente",
  "In cerca di lavoro",
  "Pensionato",
];
const VERBALE_OPTIONS: VerbaleOption[] = [
  "No, non ancora",
  "Domanda già presentata",
  "Sì, ho già un verbale",
  "Non lo so",
];
const CERT_OPTIONS: CertOption[] = ["Sì", "No", "Non so cos'è"];

type Campo = "who" | "when" | "work" | "verbale" | "cert";
const NOMI_CAMPI: Record<Campo, string> = {
  who: "chi ha ricevuto la diagnosi",
  when: "quando è avvenuta",
  work: "la situazione lavorativa",
  verbale: "se c'è già un verbale",
  cert: "il certificato medico",
};

export function QuestionarioValutazione() {
  const router = useRouter();
  const [who, setWho] = useState<WhoOption | null>(null);
  const [when, setWhen] = useState<WhenOption | null>(null);
  const [work, setWork] = useState<WorkOption | null>(null);
  const [verbale, setVerbale] = useState<VerbaleOption | null>(null);
  const [cert, setCert] = useState<CertOption | null>(null);
  const [saving, setSaving] = useState(false);
  const [mostraMancanti, setMostraMancanti] = useState(false);

  // Il certificato serve solo a chi il verbale non ce l'ha (o non lo sa)
  const serveCert = verbale === "No, non ancora" || verbale === "Non lo so";
  const isSelf = who === "Io stesso/a";

  const valori: Record<Campo, unknown> = { who, when, work, verbale, cert };
  const campi: Campo[] = ["who", "when", "work", "verbale", ...(serveCert ? (["cert"] as Campo[]) : [])];
  const mancanti = campi.filter((c) => !valori[c]);
  const fatte = campi.length - mancanti.length;

  // Posizioni delle domande (sul web si può scorrere fino a quella mancante)
  const refs = useRef<Partial<Record<Campo, View | null>>>({});
  const vaiA = (c: Campo) => {
    if (Platform.OS !== "web") return;
    const el = refs.current[c] as unknown as { scrollIntoView?: (o: object) => void } | null;
    el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
  };

  const handleContinueToResults = async () => {
    if (saving) return;
    if (mancanti.length > 0 || !who || !when || !work || !verbale) {
      setMostraMancanti(true);
      if (mancanti[0]) vaiA(mancanti[0]);
      return;
    }
    setSaving(true);
    const answers: Answers = {
      who,
      when,
      work,
      verbale,
      ...(serveCert && cert ? { cert } : {}),
    };
    const report: Report = await saveReport(answers);
    // Statistiche anonime: solo le categorie scelte, nessun dato personale
    registra("questionario", "completato");
    registra("chi", who);
    registra("quando", when);
    registra("lavoro", work);
    registra("verbale", verbale);
    if (serveCert && cert) registra("certificato", cert);
    setSaving(false);
    router.push(`/risultati/${report.id}` as any);
  };

  /** Titolo della domanda, con avviso se manca la risposta. */
  const Domanda = ({ campo, children, first }: { campo: Campo; children: string; first?: boolean }) => {
    const manca = mostraMancanti && !valori[campo];
    return (
      <View ref={(r) => { refs.current[campo] = r; }} style={!first && { marginTop: spacing.xl }}>
        <Text style={styles.question}>{children}</Text>
        {manca ? (
          <Text style={styles.missing} testID={`missing-${campo}`}>
            Manca questa risposta
          </Text>
        ) : null}
      </View>
    );
  };

  const opzioni = <T extends string>(
    lista: T[],
    valore: T | null,
    set: (v: T) => void,
    prefisso: string,
  ) => (
    <View style={styles.optionsList}>
      {lista.map((opt) => (
        <OptionCard
          key={opt}
          label={opt}
          selected={valore === opt}
          onPress={() => set(opt)}
          testID={`opt-${prefisso}-${opt}`}
        />
      ))}
    </View>
  );

  return (
    <View testID="questionario-valutazione">
      {/* 1 · La diagnosi */}
      <View testID="step-1">
        <View style={styles.stepIconWrap}>
          <View style={[styles.stepIcon, { backgroundColor: topics.legge104.soft }]}>
            <Ionicons name="heart-outline" size={22} color={topics.legge104.main} />
          </View>
          <Text style={[styles.stepBadge, { color: topics.legge104.main }]}>1 · LA DIAGNOSI</Text>
        </View>
        <Domanda campo="who" first>Chi ha ricevuto la diagnosi?</Domanda>
        <Text style={styles.helper}>
          Prenditi il tempo che ti serve. Nessuna risposta è sbagliata.
        </Text>
        {opzioni(WHO_OPTIONS, who, setWho, "who")}
        {who === "Coniuge/Partner" && (
          <View style={styles.partnerNote} testID="wizard-partner-note">
            <Ionicons name="information-circle-outline" size={16} color={colors.brandPrimaryDark} />
            <Text style={styles.partnerNoteText}>{PARTNER_NOTE}</Text>
          </View>
        )}

        <Domanda campo="when">Quando è avvenuta la diagnosi?</Domanda>
        <Text style={styles.helper}>Ci aiuta a stabilire tempi e priorità.</Text>
        {opzioni(WHEN_OPTIONS, when, setWhen, "when")}
      </View>

      {/* 2 · Lavoro */}
      <View style={styles.block} testID="step-2">
        <View style={styles.stepIconWrap}>
          <View style={[styles.stepIcon, { backgroundColor: topics.lavoro.soft }]}>
            <Ionicons name="briefcase-outline" size={22} color={topics.lavoro.main} />
          </View>
          <Text style={[styles.stepBadge, { color: topics.lavoro.main }]}>2 · IL LAVORO</Text>
        </View>
        <Domanda campo="work" first>Qual è la tua situazione lavorativa?</Domanda>
        <Text style={styles.helper}>
          {isSelf || !who
            ? "Serve a capire quali permessi e tutele hai sul lavoro."
            : "Parliamo di te che assisti: il tipo di contratto decide quali permessi puoi chiedere."}
        </Text>
        {opzioni(WORK_OPTIONS, work, setWork, "work")}
      </View>

      {/* 3 · Il riconoscimento */}
      <View style={styles.block} testID="step-3">
        <View style={styles.stepIconWrap}>
          <View style={[styles.stepIcon, { backgroundColor: topics.documenti.soft }]}>
            <Ionicons name="document-text-outline" size={22} color={topics.documenti.main} />
          </View>
          <Text style={[styles.stepBadge, { color: topics.documenti.main }]}>3 · IL RICONOSCIMENTO</Text>
        </View>
        <Domanda campo="verbale" first>
          {"C'è già un verbale di invalidità civile o di Legge 104?"}
        </Domanda>
        <Text style={styles.helper}>
          {"Il verbale è il documento dell'INPS che riconosce l'invalidità o la disabilità. Da qui dipende il prossimo passo."}
        </Text>
        {opzioni(VERBALE_OPTIONS, verbale, setVerbale, "verbale")}

        {serveCert && (
          <>
            <Domanda campo="cert">{"Avete già il certificato medico introduttivo?"}</Domanda>
            <Text style={styles.helper}>È il documento che fa partire la pratica.</Text>
            {opzioni(CERT_OPTIONS, cert, setCert, "cert")}
            {cert === "Non so cos'è" && (
              <View style={styles.explain} testID="cert-inline-explain">
                <Text style={styles.explainTitle}>{CERT_EXPLAINER.title}</Text>
                <Text style={styles.explainText}>{CERT_EXPLAINER.points[0]}</Text>
                <Text style={styles.explainText}>{CERT_EXPLAINER.intro}</Text>
              </View>
            )}
            <View style={styles.certWarnBanner} testID="cert-inline-warning">
              <Ionicons name="information-circle-outline" size={18} color={colors.accentDark} />
              <Text style={styles.certWarnText}>
                <Text style={styles.certWarnStrong}>Buono a sapersi: </Text>
                {"con la Riforma della disabilità il certificato del medico avvia da solo un'unica valutazione, che riconosce insieme invalidità civile e disabilità. Una sola visita, un solo verbale."}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* CTA finale: sempre attivo, dice cosa manca */}
      <Text style={styles.progress} testID="wizard-progress">
        {mancanti.length === 0
          ? "Tutto pronto"
          : `Risposte date: ${fatte} di ${campi.length}`}
      </Text>
      <Pressable
        onPress={handleContinueToResults}
        disabled={saving}
        style={({ pressed }) => [
          styles.primaryBtn,
          mancanti.length > 0 && styles.primaryBtnIncomplete,
          pressed && { opacity: 0.85 },
        ]}
        accessibilityRole="button"
        accessibilityHint={
          mancanti.length > 0 ? `Mancano: ${mancanti.map((c) => NOMI_CAMPI[c]).join(", ")}` : undefined
        }
        testID="wizard-next-btn"
      >
        <Text style={styles.primaryBtnText}>
          {saving ? "Elaborazione…" : "Vedi i tuoi diritti"}
        </Text>
        {!saving && <Ionicons name="arrow-forward" size={18} color={colors.onBrandPrimary} />}
      </Pressable>
      {mostraMancanti && mancanti.length > 0 ? (
        <Text style={styles.missingSummary} testID="wizard-missing">
          Manca ancora: {mancanti.map((c) => NOMI_CAMPI[c]).join(", ")}.
        </Text>
      ) : null}
    </View>
  );
}

function OptionCard({
  label,
  selected,
  onPress,
  testID,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        selected && styles.optionCardSelected,
        pressed && { opacity: 0.9 },
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      testID={testID}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <Ionicons name="checkmark" size={12} color={colors.onBrandPrimary} />}
      </View>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: spacing.xxl },
  progress: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.onSurfaceTertiary,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  missing: { fontSize: 12, fontWeight: "700", color: colors.brandPrimaryDark, marginBottom: spacing.sm },
  missingSummary: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.brandPrimaryDark,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  explain: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: 6,
  },
  explainTitle: { fontFamily: fonts.serif, fontSize: 15, fontWeight: "700", color: colors.onSurface },
  explainText: { fontSize: 13, lineHeight: 19, color: colors.onSurfaceSecondary },
  stepIconWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.brandSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadge: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.onSurface,
    letterSpacing: 1.2,
  },
  question: {
    fontFamily: fonts.serif,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "700",
    color: colors.onSurface,
    letterSpacing: -0.4,
    marginBottom: spacing.sm,
  },
  helper: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.onSurfaceTertiary,
    marginBottom: spacing.lg,
  },
  // Risposte su due colonne: il questionario è più corto e si vede tutto a colpo d'occhio
  optionsList: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  partnerNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.brandSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  partnerNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: colors.onSurface,
    fontWeight: "500",
  },
  optionCard: {
    flexBasis: "47%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionCardSelected: {
    borderColor: colors.brandPrimary,
    backgroundColor: colors.brandSecondary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.brandPrimary,
    backgroundColor: colors.brandPrimary,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: colors.onSurfaceSecondary,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: colors.onBrandSecondary,
    fontWeight: "700",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.brandPrimary,
    minHeight: 56,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  // Incompleto: un po' più tenue ma cliccabile (porta alla domanda mancante)
  primaryBtnIncomplete: { opacity: 0.75 },
  primaryBtnText: {
    color: colors.onBrandPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  certWarnBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: "#FFFBEB",
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  certWarnText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.onSurface,
  },
  certWarnStrong: { fontWeight: "800" },
});
