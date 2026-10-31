import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius, spacing } from "@/src/theme";

// Accoglienza facoltativa: nessun salvataggio, invio, account o statistica.
export function WelcomeGuide() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [forOther, setForOther] = useState(false);
  const greeting = name.trim() ? `Ciao ${name.trim()}.` : "Ciao.";
  return (
    <View style={styles.box} testID="welcome-guide">
      <Text style={styles.progress}>Un passo alla volta · {step + 1} di 3</Text>
      <View accessibilityLiveRegion="polite">
        <Text accessibilityRole="header" style={styles.title}>
          {step === 0 ? "Come vuoi che ti chiami?" : step === 1 ? `${greeting} Per chi cerchi aiuto?` : forOther ? "Da cosa volete iniziare?" : "Da cosa vuoi iniziare?"}
        </Text>
      </View>
      {step === 0 && <>
        <Text style={styles.text}>Puoi scrivere un nome o un soprannome. È facoltativo.</Text>
        <TextInput accessibilityLabel="Nome o soprannome facoltativo" placeholder="Nome o soprannome" value={name} onChangeText={setName} maxLength={40} autoComplete="off" autoCorrect={false} style={styles.input} testID="welcome-name" />
        <Pressable accessibilityRole="button" style={styles.primary} onPress={() => setStep(1)} testID="welcome-continue"><Text style={styles.primaryText}>Continua</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => { setName(""); setStep(1); }}><Text style={styles.buttonText}>Continua senza nome</Text></Pressable>
      </>}
      {step === 1 && <>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => { setForOther(false); setStep(2); }}><Text style={styles.buttonText}>Per me</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => { setForOther(true); setStep(2); }}><Text style={styles.buttonText}>Per una persona che aiuto</Text></Pressable>
      </>}
      {step === 2 && <>
        <Text style={styles.text}>Scegli ciò che ti è utile adesso. Puoi cambiare idea.</Text>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => router.push("/primi-passi")}><Text style={styles.buttonText}>I primi passi dopo una diagnosi</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => router.push("/benefici")}><Text style={styles.buttonText}>Capire diritti e agevolazioni</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => router.push("/territorio")}><Text style={styles.buttonText}>Trovare aiuto nella vita quotidiana</Text></Pressable>
      </>}
      {step > 0 && <Pressable accessibilityRole="button" onPress={() => setStep(step - 1)} style={styles.secondary}><Text style={styles.buttonText}>Indietro</Text></Pressable>}
      <Text style={styles.note}>Non serve un account. Il nome resta solo in questa schermata e non viene inviato.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  progress: { fontSize: 14, lineHeight: 21, color: colors.onSurfaceSecondary },
  title: { fontSize: 25, lineHeight: 34, fontWeight: "700", color: colors.onSurface },
  text: { fontSize: 18, lineHeight: 27, color: colors.onSurface },
  input: { borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, padding: spacing.md, minHeight: 56, fontSize: 18, color: colors.onSurface },
  primary: { backgroundColor: colors.brandPrimary, borderRadius: radius.md, padding: spacing.md, minHeight: 56, justifyContent: "center" },
  primaryText: { fontSize: 18, lineHeight: 26, color: colors.onBrandPrimary, fontWeight: "600", textAlign: "center" },
  secondary: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, minHeight: 56, justifyContent: "center" },
  buttonText: { fontSize: 18, lineHeight: 26, color: colors.onSurface },
  note: { fontSize: 14, lineHeight: 21, color: colors.onSurfaceSecondary },
});
