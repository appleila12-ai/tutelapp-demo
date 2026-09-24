// Le domande sulla 104 — pagina dedicata all'assistente sulla Legge 104.
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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

import { AssistantCard } from "@/src/components/AssistantCard";
import { SezioniBar } from "@/src/components/SezioniBar";
import { colors, fonts, radius, spacing } from "@/src/theme";
import { Answers, listReports } from "@/src/lib/reports";
import { useSezione } from "@/src/lib/statistiche";
import { HA_BACKEND } from "@/src/config/servizi";

export default function Domande104Screen() {
  useSezione("domande-104");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [answers, setAnswers] = useState<Answers | undefined>(undefined);

  // Contesto dall'ultima valutazione salvata (se esiste)
  useEffect(() => {
    listReports().then((list) => {
      if (list.length > 0) setAnswers(list[0].answers);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="domande-104-screen">
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityLabel="Indietro"
          testID="domande-104-back-btn"
        >
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Le domande sulla 104</Text>
        <View style={styles.iconBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xxl }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {HA_BACKEND ? (
            <AssistantCard answers={answers} />
          ) : (
            <Text style={{ fontSize: 14, lineHeight: 21, color: colors.onSurfaceSecondary }}>
              L'assistente sulla 104 sarà disponibile a breve. Intanto trovi le
              risposte più comuni in Domande frequenti.
            </Text>
          )}
          <SezioniBar />
        </ScrollView>
      </KeyboardAvoidingView>
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
});
