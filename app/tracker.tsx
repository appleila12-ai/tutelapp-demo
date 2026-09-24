import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Modal,
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
import Ionicons, { type IoniconsIconName } from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { colors, fonts, radius, spacing } from "@/src/theme";
import { comune } from "@/src/config/comune";
import { ComuneLogo } from "@/src/components/ComuneLogo";
import { SezioniBar } from "@/src/components/SezioniBar";
import { VaultSection } from "@/src/components/VaultSection";
import { listReports, Report } from "@/src/lib/reports";
import { storage } from "@/src/utils/storage";
import { registra, useSezione } from "@/src/lib/statistiche";

const STORE_KEY = "tutelapp:tracker";
const NOTIF_READ_KEY = "tutelapp:tracker:notifsRead";

type StageId = "richiesta" | "presa_carico" | "uvm" | "progetto";

type Stage = {
  id: StageId;
  icon: IoniconsIconName;
  title: string;
  desc: string;
  nextStep: string; // consiglio mostrato quando la tappa è "in corso"
  attesa?: string; // tempo stimato di attesa per la fase (mostrato se in corso)
  attesaGiorni?: number; // giorni stimati dalla tappa precedente
  attesaReassure?: string; // messaggio rassicurante se ci si avvicina alla scadenza
  azione?: { title: string; message: string }; // azione utile mentre la tappa è in corso
};

const STAGES: Stage[] = [
  {
    id: "richiesta",
    icon: "paper-plane-outline",
    title: "Richiesta inviata",
    desc: "La tua domanda è partita: da qui inizia il tuo percorso, ci pensiamo noi.",
    nextStep:
      "Conserva la ricevuta di invio: ci servirà come riferimento nei prossimi passaggi.",
    azione: {
      title: "Un piccolo passo per te",
      message:
        "Quando hai inviato la richiesta (online su SISDA o all'ATS), segna qui la data: così teniamo il conto dei tempi insieme.",
    },
  },
  {
    id: "presa_carico",
    icon: "heart-circle-outline",
    title: "Presa in carico dei Servizi Sociali",
    desc: "Il Comune ha ricevuto la tua richiesta e ha aperto la tua cartella personale.",
    nextStep:
      "Un operatore ti contatterà per una prima conoscenza: tieni il telefono a portata di mano.",
    attesa: "La presa in carico avviene di solito entro 15–30 giorni",
    attesaGiorni: 30,
    attesaReassure:
      "Sei nei tempi: se non ricevi notizie entro {data}, chiamaci pure. È tutto sotto controllo.",
  },
  {
    id: "uvm",
    icon: "people-circle-outline",
    title: "Convocazione UVM",
    desc: "Un'équipe di esperti ti incontrerà per capire insieme i tuoi bisogni.",
    nextStep:
      "Prepara documento d'identità e verbale: potrebbero chiamarti a breve per fissare l'incontro. Puoi farti accompagnare da una persona di fiducia.",
    attesa: "La Convocazione UVM arriva di solito entro 30–45 giorni",
    attesaGiorni: 45,
    attesaReassure:
      "Sei nei tempi: se non ricevi notizie entro {data}, chiamaci pure. È tutto sotto controllo, ti avvisiamo noi appena c'è una data.",
    azione: {
      title: "Un piccolo passo per te",
      message:
        "Tieni pronta una fotocopia del verbale ASL e del documento d'identità: potrebbero servirti all'incontro UVM. Nessuna fretta, se manca qualcosa ci pensiamo insieme.",
    },
  },
  {
    id: "progetto",
    icon: "sparkles-outline",
    title: "Progetto di Vita attivo",
    desc: "Il tuo Progetto di Vita personalizzato è pronto e comincia a sostenerti ogni giorno.",
    nextStep:
      "Da qui potrai rivedere e aggiornare il tuo Progetto di Vita quando qualcosa cambia.",
  },
];

type Entry = { date: string; note: string; done: boolean };

// Stato iniziale: nessuna tappa completata, la pratica parte da zero.
const EMPTY: Record<StageId, Entry> = {
  richiesta: { date: "", note: "", done: false },
  presa_carico: { date: "", note: "", done: false },
  uvm: { date: "", note: "", done: false },
  progetto: { date: "", note: "", done: false },
};

// Notifiche/avvisi generati dallo stato reale della pratica.
type Notif = {
  id: string;
  icon: IoniconsIconName;
  tone: "ok" | "info" | "action";
  title: string;
  message: string;
  when: string;
};

function parseItDate(s: string): Date | null {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return isNaN(d.getTime()) ? null : d;
}

function formatItDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// Data entro cui aspettarsi la tappa in corso, calcolata dalla tappa precedente.
function scadenzaAttesa(stageIdx: number, entries: Record<StageId, Entry>): string | null {
  const stage = STAGES[stageIdx];
  const prev = STAGES[stageIdx - 1];
  if (!stage.attesaGiorni || !prev) return null;
  const base = parseItDate(entries[prev.id].date);
  if (!base) return null;
  const d = new Date(base);
  d.setDate(d.getDate() + stage.attesaGiorni);
  return formatItDate(d);
}

function buildNotifications(
  entries: Record<StageId, Entry>,
  currentIdx: number,
): Notif[] {
  const out: Notif[] = [];
  STAGES.forEach((s, idx) => {
    if (idx < currentIdx && entries[s.id].done) {
      out.push({
        id: `done-${s.id}`,
        icon: "checkmark-circle",
        tone: "ok",
        title: `${s.title}: completata`,
        message: entries[s.id].date
          ? `Tappa registrata il ${entries[s.id].date}.${idx + 1 < STAGES.length ? ` Ora sei in attesa di: ${STAGES[idx + 1].title}.` : ""}`
          : `Tappa completata.${idx + 1 < STAGES.length ? ` Ora sei in attesa di: ${STAGES[idx + 1].title}.` : ""}`,
        when: entries[s.id].date || "completata",
      });
    }
  });
  const cur = STAGES[currentIdx];
  if (cur) {
    if (cur.attesa) {
      const entro = scadenzaAttesa(currentIdx, entries);
      out.push({
        id: `wait-${cur.id}`,
        icon: "hourglass-outline",
        tone: "info",
        title: `${cur.title} in arrivo`,
        message: entro
          ? `${cur.attesa}: indicativamente entro il ${entro}. Ti avvisiamo noi appena c'è una data.`
          : `${cur.attesa}. Segna la data della tappa precedente per stimare i tempi.`,
        when: "in attesa",
      });
    }
    if (cur.azione) {
      out.push({
        id: `action-${cur.id}`,
        icon: "reader-outline",
        tone: "action",
        title: cur.azione.title,
        message: cur.azione.message,
        when: "quando puoi",
      });
    }
  }
  if (out.length === 0) {
    out.push({
      id: "all-done",
      icon: "checkmark-circle",
      tone: "ok",
      title: "Percorso completato",
      message: "Il tuo Progetto di Vita è attivo. Puoi rivederlo e aggiornarlo quando vuoi.",
      when: "oggi",
    });
  }
  return out;
}

function autoSlash(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function PulseNode({ icon }: { icon: IoniconsIconName }) {
  const scale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1,
      false
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 900 }),
        withTiming(0.5, { duration: 900 })
      ),
      -1,
      false
    );
  }, [scale, ringOpacity]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 1.25 }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={styles.nodeWrap}>
      <Animated.View style={[styles.nodeRing, ringStyle]} />
      <View style={[styles.node, styles.nodeCurrent]}>
        <Ionicons name={icon} size={22} color={colors.onSurface} />
      </View>
    </View>
  );
}

export default function Tracker() {
  useSezione("pratica");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const warm = comune.theme;

  const [entries, setEntries] = useState<Record<StageId, Entry>>(EMPTY);
  const [openId, setOpenId] = useState<StageId | null>(null);
  const [ready, setReady] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifsReadSig, setNotifsReadSig] = useState("");
  const [ultimoReport, setUltimoReport] = useState<Report | undefined>(undefined);

  useEffect(() => {
    listReports().then((list) => setUltimoReport(list[0]));
  }, []);

  useEffect(() => {
    (async () => {
      const raw = await storage.getItem<string>(STORE_KEY, "");
      if (raw) {
        try {
          const saved = JSON.parse(raw) as Partial<Record<StageId, Partial<Entry>>>;
          setEntries((prev) => {
            const merged = { ...prev };
            (Object.keys(prev) as StageId[]).forEach((id) => {
              if (saved[id]) merged[id] = { ...prev[id], ...saved[id], done: !!saved[id]?.done };
            });
            return merged;
          });
        } catch {
          /* ignore */
        }
      }
      setNotifsReadSig((await storage.getItem<string>(NOTIF_READ_KEY, "")) || "");
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready) storage.setItem(STORE_KEY, JSON.stringify(entries));
  }, [entries, ready]);

  // Tappa in corso = prima tappa non completata (se tutte completate: percorso concluso)
  const currentIndex = useMemo(() => {
    const idx = STAGES.findIndex((s) => !entries[s.id].done);
    return idx === -1 ? STAGES.length : idx;
  }, [entries]);

  // Statistiche anonime: a che tappa è arrivata la pratica
  useEffect(() => {
    if (!ready) return;
    registra("tappa", currentIndex >= STAGES.length ? "completato" : STAGES[currentIndex].id);
  }, [ready, currentIndex]);

  const notifications = useMemo(
    () => buildNotifications(entries, currentIndex),
    [entries, currentIndex],
  );
  const notifSig = notifications.map((n) => n.id).join("|");
  const notifsRead = notifsReadSig === notifSig;

  const openNotifs = () => {
    setNotifOpen(true);
    if (!notifsRead) {
      setNotifsReadSig(notifSig);
      storage.setItem(NOTIF_READ_KEY, notifSig);
    }
  };

  const setField = (id: StageId, field: "date" | "note", value: string) =>
    setEntries((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  // Completare una tappa completa anche le precedenti; riaprirla riapre le successive.
  const setDone = (id: StageId, done: boolean) =>
    setEntries((prev) => {
      const idx = STAGES.findIndex((s) => s.id === id);
      const next = { ...prev };
      STAGES.forEach((s, i) => {
        if (done && i <= idx) next[s.id] = { ...next[s.id], done: true };
        if (!done && i >= idx) next[s.id] = { ...next[s.id], done: false };
      });
      return next;
    });

  const call = () =>
    Linking.openURL(`tel:${comune.telefono.replace(/\s/g, "")}`).catch(() => {});
  const email = () => Linking.openURL(`mailto:${comune.email}`).catch(() => {});
  const map = () =>
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        comune.indirizzo
      )}`
    ).catch(() => {});

  const heading =
    currentIndex >= STAGES.length
      ? "Percorso completato"
      : `Tappa ${currentIndex + 1} di ${STAGES.length} · in corso`;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: warm.cream }]}
      edges={["top", "left", "right"]}
      testID="tracker-screen"
    >
      <StatusBar barStyle="dark-content" backgroundColor={warm.cream} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: warm.cream }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityLabel="Indietro"
          testID="tracker-back-btn"
        >
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>La tua pratica</Text>
        <Pressable
          onPress={openNotifs}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityLabel="Avvisi e promemoria"
          testID="tracker-bell-btn"
        >
          <Ionicons name="notifications-outline" size={20} color={warm.warmDark} />
          {!notifsRead && (
            <View style={styles.bellBadge} testID="tracker-bell-badge">
              <Text style={styles.bellBadgeText}>{notifications.length}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
        {/* COMUNE — in prima linea */}
        <View
          style={[styles.comuneCard, { backgroundColor: warm.warmSoft, borderColor: warm.warm }]}
          testID="tracker-comune-card"
        >
          <View style={styles.comuneTop}>
            <ComuneLogo size={comune.logo ? 56 : 36} />
            <View style={styles.flex}>
              <Text style={[styles.comuneEnte, { color: warm.warmDark }]}>
                PRATICA SEGUITA DA
              </Text>
              <Text style={styles.comuneNome} testID="tracker-comune-nome">
                {comune.nome}
              </Text>
              <Text style={styles.comuneSub}>{comune.ente}</Text>
            </View>
          </View>

          <View style={styles.comuneDivider} />

          <View style={styles.comuneContacts}>
            <Pressable
              onPress={call}
              style={({ pressed }) => [styles.contactChip, pressed && { opacity: 0.7 }]}
              testID="tracker-comune-call"
            >
              <Ionicons name="call-outline" size={16} color={warm.warmDark} />
              <Text style={[styles.contactChipText, { color: warm.warmDark }]}>
                Chiama
              </Text>
            </Pressable>
            <Pressable
              onPress={email}
              style={({ pressed }) => [styles.contactChip, pressed && { opacity: 0.7 }]}
              testID="tracker-comune-email"
            >
              <Ionicons name="mail-outline" size={16} color={warm.warmDark} />
              <Text style={[styles.contactChipText, { color: warm.warmDark }]}>
                Email
              </Text>
            </Pressable>
            <Pressable
              onPress={map}
              style={({ pressed }) => [styles.contactChip, pressed && { opacity: 0.7 }]}
              testID="tracker-comune-map"
            >
              <Ionicons name="location-outline" size={16} color={warm.warmDark} />
              <Text style={[styles.contactChipText, { color: warm.warmDark }]}>
                Sede
              </Text>
            </Pressable>
          </View>
          <View style={styles.comuneInfoRow}>
            <Ionicons name="time-outline" size={13} color={colors.muted} />
            <Text style={styles.comuneInfoText}>{comune.orari}</Text>
          </View>
        </View>

        {/* Intro */}
        <Text style={styles.introLabel}>{heading}</Text>
        <Text style={styles.introTitle}>
          Ecco a che punto è il tuo percorso
        </Text>
        <Text style={styles.introBody}>
          Segui la tua pratica come segui un pacco in arrivo. Segna le tappe
          completate, aggiungi date e note: restano salvate sul tuo telefono e,
          se hai fatto l&apos;accesso, nel tuo account.
        </Text>

        {/* Timeline */}
        <View style={styles.timeline}>
          {STAGES.map((stage, idx) => {
            const status =
              idx < currentIndex
                ? "done"
                : idx === currentIndex
                  ? "current"
                  : "future";
            const isLast = idx === STAGES.length - 1;
            const isOpen = openId === stage.id;
            const entry = entries[stage.id];
            const entro = status === "current" ? scadenzaAttesa(idx, entries) : null;

            const lineColor =
              idx < currentIndex ? colors.success : "#EAD9C3";

            return (
              <View key={stage.id} style={styles.row} testID={`tracker-stage-${stage.id}`}>
                {/* Left rail */}
                <View style={styles.rail}>
                  {status === "done" && (
                    <View style={[styles.node, styles.nodeDone]}>
                      <Ionicons name="checkmark" size={22} color={colors.onSurface} />
                    </View>
                  )}
                  {status === "current" && <PulseNode icon={stage.icon} />}
                  {status === "future" && (
                    <View style={[styles.node, styles.nodeFuture]}>
                      <Ionicons name={stage.icon} size={20} color={colors.borderStrong} />
                    </View>
                  )}
                  {!isLast && (
                    <View
                      style={[
                        styles.railLine,
                        { backgroundColor: lineColor },
                      ]}
                    />
                  )}
                </View>

                {/* Content */}
                <View style={[styles.content, isLast && { paddingBottom: 0 }]}>
                  <View style={styles.contentHead}>
                    <Text
                      style={[
                        styles.stageTitle,
                        status === "future" && styles.stageTitleFuture,
                        status === "current" && { color: warm.warmDark },
                      ]}
                      testID={`tracker-stage-title-${stage.id}`}
                    >
                      {stage.title}
                    </Text>
                    {status === "done" && (
                      <View style={styles.doneBadge}>
                        <Text style={styles.doneBadgeText}>Completata</Text>
                      </View>
                    )}
                    {status === "current" && (
                      <View style={[styles.currentBadge, { backgroundColor: warm.warm }]}>
                        <Text style={styles.currentBadgeText}>In corso</Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.stageDesc,
                      status === "future" && styles.stageDescFuture,
                    ]}
                  >
                    {stage.desc}
                  </Text>

                  {/* Data della tappa (se presente) */}
                  {entry.date ? (
                    <View style={styles.datePill}>
                      <Ionicons name="calendar-outline" size={13} color={colors.muted} />
                      <Text style={styles.datePillText}>{entry.date}</Text>
                    </View>
                  ) : null}
                  {entry.note ? (
                    <Text style={styles.noteShown}>“{entry.note}”</Text>
                  ) : null}

                  {/* Tempo di attesa stimato + rassicurazione — solo tappa in corso */}
                  {status === "current" && stage.attesa && (
                    <View style={styles.waitCard} testID="tracker-wait-card">
                      <View style={styles.waitHead}>
                        <Ionicons name="hourglass-outline" size={18} color={colors.brandPrimary} />
                        <Text style={styles.waitText}>{stage.attesa}</Text>
                      </View>
                      {stage.attesaReassure && (
                        <Text style={styles.waitReassure}>
                          {entro
                            ? stage.attesaReassure.replace("{data}", `il ${entro}`)
                            : stage.attesaReassure.replace(
                                "{data}",
                                `${stage.attesaGiorni} giorni`,
                              )}
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Prossimo passo consigliato — solo sulla tappa in corso */}
                  {status === "current" && (
                    <View
                      style={[styles.nextStep, { backgroundColor: warm.warmSoft }]}
                      testID="tracker-next-step"
                    >
                      <Ionicons name="arrow-forward-circle" size={18} color={warm.warm} />
                      <View style={styles.flex}>
                        <Text style={[styles.nextStepLabel, { color: warm.warmDark }]}>
                          Prossimo passo consigliato
                        </Text>
                        <Text style={styles.nextStepText}>{stage.nextStep}</Text>
                      </View>
                    </View>
                  )}

                  {/* Azione utile per l'utente (amichevole, non allarmante) — tappa in corso */}
                  {status === "current" && stage.azione && (
                    <View style={styles.actionCard} testID="tracker-action-card">
                      <View style={styles.actionIcon}>
                        <Ionicons name="reader-outline" size={18} color={colors.brandPrimary} />
                      </View>
                      <View style={styles.flex}>
                        <Text style={styles.actionTitle}>{stage.azione.title}</Text>
                        <Text style={styles.actionText}>{stage.azione.message}</Text>
                      </View>
                    </View>
                  )}

                  {/* Toggle editor */}
                  <Pressable
                    onPress={() => setOpenId(isOpen ? null : stage.id)}
                    style={styles.editToggle}
                    hitSlop={8}
                    testID={`tracker-edit-toggle-${stage.id}`}
                  >
                    <Ionicons
                      name={isOpen ? "chevron-up" : "create-outline"}
                      size={15}
                      color={colors.brandPrimary}
                    />
                    <Text style={styles.editToggleText}>
                      {isOpen
                        ? "Chiudi"
                        : entry.date || entry.note
                          ? "Modifica data e nota"
                          : "Aggiungi data e nota"}
                    </Text>
                  </Pressable>

                  {isOpen && (
                    <View style={styles.editor} testID={`tracker-editor-${stage.id}`}>
                      <Text style={styles.editorLabel}>Data</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="GG/MM/AAAA"
                        placeholderTextColor={colors.muted}
                        value={entry.date}
                        onChangeText={(t) => setField(stage.id, "date", autoSlash(t))}
                        keyboardType="number-pad"
                        maxLength={10}
                        testID={`tracker-date-input-${stage.id}`}
                      />
                      <Text style={[styles.editorLabel, { marginTop: spacing.md }]}>
                        Nota personale
                      </Text>
                      <TextInput
                        style={[styles.input, styles.inputMulti]}
                        placeholder="Es. Chiamato l'ufficio, mi richiamano lunedì…"
                        placeholderTextColor={colors.muted}
                        value={entry.note}
                        onChangeText={(t) => setField(stage.id, "note", t)}
                        multiline
                        testID={`tracker-note-input-${stage.id}`}
                      />
                      <View style={styles.editorActions}>
                        {status !== "future" && (
                          <Pressable
                            onPress={() => {
                              setDone(stage.id, !entry.done);
                              setOpenId(null);
                            }}
                            style={({ pressed }) => [
                              styles.doneBtn,
                              pressed && { opacity: 0.9 },
                            ]}
                            accessibilityRole="button"
                            testID={`tracker-done-${stage.id}`}
                          >
                            <Ionicons
                              name={entry.done ? "refresh-outline" : "checkmark-circle-outline"}
                              size={18}
                              color={colors.onSurface}
                            />
                            <Text style={styles.doneBtnText}>
                              {entry.done ? "Riapri tappa" : "Tappa completata"}
                            </Text>
                          </Pressable>
                        )}
                        <Pressable
                          onPress={() => setOpenId(null)}
                          style={({ pressed }) => [
                            styles.saveBtn,
                            { backgroundColor: warm.warm },
                            pressed && { opacity: 0.9 },
                          ]}
                          testID={`tracker-save-${stage.id}`}
                        >
                          <Ionicons name="checkmark" size={18} color={colors.onSurface} />
                          <Text style={styles.saveBtnText}>Salva</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Nota rassicurante finale */}
        <View style={styles.reassure} testID="tracker-reassure">
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
          <Text style={styles.reassureText}>
            Non sei solo in questo percorso: a ogni tappa {comune.soggetto.toLowerCase()}{" "}
            {comune.tipo === "unione" ? "e i servizi del territorio sono" : `di ${comune.nomeBreve} è`} al tuo fianco.
          </Text>
        </View>

        {/* Ponte verso il Pilastro 2 */}
        <Pressable
          onPress={() => router.push("/progetto")}
          style={({ pressed }) => [styles.progettoLink, pressed && { opacity: 0.9 }]}
          accessibilityRole="button"
          accessibilityLabel="Prepara il tuo Progetto di Vita"
          testID="tracker-progetto-link"
        >
          <View style={styles.progettoLinkIcon}>
            <Ionicons name="sparkles-outline" size={20} color={colors.accentDark} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.progettoLinkTitle}>Prepara il tuo Progetto di Vita</Text>
            <Text style={styles.progettoLinkSub}>
              Appunta i tuoi desideri prima dell&apos;incontro con l&apos;UVM
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.accentDark} />
        </Pressable>

        {/* Cassaforte referti — documenti della pratica */}
        <VaultSection report={ultimoReport} />

        <SezioniBar />
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Pannello avvisi / promemoria (in-app, nessuna notifica push) */}
      <Modal
        visible={notifOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setNotifOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setNotifOpen(false)}
          testID="tracker-notif-overlay"
        >
          <Pressable
            style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHead}>
              <Ionicons name="notifications-outline" size={20} color={warm.warmDark} />
              <Text style={styles.sheetTitle}>Avvisi e promemoria</Text>
              <Pressable
                onPress={() => setNotifOpen(false)}
                hitSlop={10}
                testID="tracker-notif-close"
              >
                <Ionicons name="close" size={22} color={colors.onSurfaceTertiary} />
              </Pressable>
            </View>
            <Text style={styles.sheetSub}>
              Ti teniamo aggiornato passo dopo passo. Con calma, senza pensieri.
            </Text>

            {notifications.map((n) => {
              const toneColor =
                n.tone === "ok"
                  ? colors.success
                  : n.tone === "action"
                    ? warm.warm
                    : colors.brandPrimary;
              const toneBg =
                n.tone === "ok"
                  ? colors.successSoft
                  : n.tone === "action"
                    ? warm.warmSoft
                    : colors.brandSecondary;
              return (
                <View key={n.id} style={styles.notifRow} testID={`tracker-notif-${n.id}`}>
                  <View style={[styles.notifIcon, { backgroundColor: toneBg }]}>
                    <Ionicons name={n.icon} size={18} color={toneColor} />
                  </View>
                  <View style={styles.flex}>
                    <View style={styles.notifTop}>
                      <Text style={styles.notifTitle}>{n.title}</Text>
                      <Text style={styles.notifWhen}>{n.when}</Text>
                    </View>
                    <Text style={styles.notifMsg}>{n.message}</Text>
                  </View>
                </View>
              );
            })}

            <Text style={styles.sheetFoot}>
              Promemoria mostrati nell&apos;app. Nessuna notifica viene inviata al
              telefono in questa versione.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
    backgroundColor: "#FFFFFF",
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
  bellBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#FFFBF5",
  },
  bellBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.onSurface,
  },

  // Comune card
  comuneCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  comuneTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  comuneEnte: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  comuneNome: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.onSurface,
    marginTop: 2,
  },
  comuneSub: {
    fontSize: 12.5,
    color: colors.onSurfaceSecondary,
    marginTop: 1,
  },
  comuneDivider: {
    height: 1,
    backgroundColor: "#FBD9A8",
    marginVertical: spacing.md,
  },
  comuneContacts: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  contactChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    paddingVertical: 10,
    minHeight: 44,
  },
  contactChipText: {
    fontSize: 13,
    fontWeight: "700",
  },
  comuneInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.md,
  },
  comuneInfoText: {
    fontSize: 12,
    color: colors.muted,
  },

  // Intro
  introLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: colors.muted,
    textTransform: "uppercase",
  },
  introTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.onSurface,
    marginTop: 4,
  },
  introBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.onSurfaceTertiary,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },

  // Timeline
  timeline: {},
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  rail: {
    width: 48,
    alignItems: "center",
  },
  nodeWrap: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeRing: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3A94A",
  },
  node: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeDone: {
    backgroundColor: colors.success,
  },
  nodeCurrent: {
    backgroundColor: "#A86F1F",
  },
  nodeFuture: {
    backgroundColor: "#F3EEE6",
    borderWidth: 1.5,
    borderColor: "#EAD9C3",
  },
  railLine: {
    flex: 1,
    width: 3,
    borderRadius: 2,
    marginVertical: 4,
    minHeight: 24,
  },

  content: {
    flex: 1,
    paddingBottom: spacing.xl,
  },
  contentHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  stageTitle: {
    fontSize: 15.5,
    fontWeight: "800",
    color: colors.onSurface,
  },
  stageTitleFuture: {
    color: colors.borderStrong,
  },
  stageDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.onSurfaceTertiary,
    marginTop: 4,
  },
  stageDescFuture: {
    color: colors.borderStrong,
  },
  doneBadge: {
    backgroundColor: colors.successSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  doneBadgeText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: colors.onSurface,
  },
  currentBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  currentBadgeText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: colors.onSurface,
  },
  datePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: spacing.sm,
  },
  datePillText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.onSurfaceSecondary,
  },
  noteShown: {
    fontSize: 13,
    fontStyle: "italic",
    color: colors.onSurfaceSecondary,
    marginTop: spacing.sm,
    lineHeight: 19,
  },
  nextStep: {
    flexDirection: "row",
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  nextStepLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  nextStepText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.onSurfaceSecondary,
    marginTop: 2,
  },
  waitCard: {
    backgroundColor: colors.brandSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  waitHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  waitText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "800",
    color: colors.onBrandSecondary,
    lineHeight: 19,
  },
  waitReassure: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.onSurface,
    marginTop: 6,
  },
  actionCard: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.brandTertiary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.brandSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: colors.onSurface,
  },
  actionText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.onSurfaceSecondary,
    marginTop: 2,
  },
  editToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: spacing.md,
    alignSelf: "flex-start",
  },
  editToggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.onSurface,
  },
  editor: {
    marginTop: spacing.md,
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  editorLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.onSurfaceTertiary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    minHeight: 44,
    fontSize: 15,
    color: colors.onSurface,
  },
  inputMulti: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  editorActions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  doneBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: radius.md,
    paddingVertical: 12,
    minHeight: 44,
    backgroundColor: colors.successSoft,
  },
  doneBtnText: { color: colors.onSurface, fontSize: 14, fontWeight: "800" },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: radius.md,
    paddingVertical: 12,
    minHeight: 44,
  },
  saveBtnText: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: "800",
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
  progettoLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    minHeight: 64,
  },
  progettoLinkIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  progettoLinkTitle: {
    fontFamily: fonts.serif,
    fontSize: 15,
    fontWeight: "700",
    color: colors.onAccent,
  },
  progettoLinkSub: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.accentDark,
    marginTop: 2,
  },

  // Notifications sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,42,71,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  sheetHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    color: colors.onSurface,
  },
  sheetSub: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.onSurfaceTertiary,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  notifRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  notifIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  notifTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  notifTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: colors.onSurface,
  },
  notifWhen: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
  },
  notifMsg: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.onSurfaceSecondary,
    marginTop: 3,
  },
  sheetFoot: {
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.muted,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});
