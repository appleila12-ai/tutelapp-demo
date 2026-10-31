import { useState, useSyncExternalStore } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius, spacing } from "@/src/theme";
import { comune } from "@/src/config/comune";
import { aggiornaPersonaSession, getPersonaSession, subscribePersonaSession } from "@/src/state/personaSession";

export function WelcomeGuide() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const persona = useSyncExternalStore(subscribePersonaSession, getPersonaSession, getPersonaSession);
  const greeting = persona.nome.trim() ? `Ciao ${persona.nome.trim()}.` : "Ciao.";
  return (
    <View style={styles.box} testID="welcome-guide">
      <Text style={styles.comune}>{comune.nome}</Text>
      <Text style={styles.progress}>Un passo alla volta · {step + 1} di 3</Text>
      <View accessibilityLiveRegion="polite">
        <Text accessibilityRole="header" style={styles.title}>
          {step === 0 ? "Iniziamo da te." : step === 1 ? `${greeting} Per chi cerchi informazioni?` : persona.destinatario === "altra" ? "Da cosa volete iniziare?" : "Da cosa vuoi iniziare?"}
        </Text>
      </View>
      {step === 0 && <>
        <Text style={styles.text}>Inserisci il tuo nome e cognome: potremo chiamarti per nome e aiutarti a preparare i moduli.</Text>
        <Text style={styles.label}>Nome</Text>
        <TextInput accessibilityLabel="Nome" placeholder="Il tuo nome" value={persona.nome} onChangeText={(nome) => aggiornaPersonaSession({ nome })} maxLength={80} autoComplete="off" autoCorrect={false} style={styles.input} testID="welcome-name" />
        <Text style={styles.label}>Cognome</Text>
        <TextInput accessibilityLabel="Cognome" placeholder="Il tuo cognome" value={persona.cognome} onChangeText={(cognome) => aggiornaPersonaSession({ cognome })} maxLength={80} autoComplete="off" autoCorrect={false} style={styles.input} testID="welcome-surname" />
        <Pressable accessibilityRole="button" style={styles.primary} onPress={() => setStep(1)} testID="welcome-continue"><Text style={styles.primaryText}>Continua</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => setStep(1)}><Text style={styles.buttonText}>Preferisco inserirli più avanti</Text></Pressable>
      </>}
      {step === 1 && <>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => { aggiornaPersonaSession({ destinatario: "me" }); setStep(2); }}><Text style={styles.buttonText}>Per me</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => { aggiornaPersonaSession({ destinatario: "altra" }); setStep(2); }}><Text style={styles.buttonText}>Per una persona che aiuto</Text></Pressable>
      </>}
      {step === 2 && <>
        <Text style={styles.text}>Scegli ciò che ti è utile adesso. Puoi cambiare idea.</Text>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => router.push("/primi-passi")}><Text style={styles.buttonText}>I primi passi dopo una diagnosi</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => router.push("/benefici")}><Text style={styles.buttonText}>Capire diritti e agevolazioni</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => router.push("/territorio")}><Text style={styles.buttonText}>Trovare aiuto nella vita quotidiana</Text></Pressable>
      </>}
      {step > 0 && <Pressable accessibilityRole="button" onPress={() => setStep(step - 1)} style={styles.secondary}><Text style={styles.buttonText}>Indietro</Text></Pressable>}
      <Text style={styles.note}>Non è una registrazione. Questi dati restano nella sessione dell’app. Prima di inserirli in un modulo potrai controllarli.</Text>
      <Pressable accessibilityRole="button" onPress={() => router.push("/contatti")} style={styles.secondary}><Text style={styles.buttonText}>Contatta i servizi {comune.delEnte}</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  comune: { fontSize: 18, lineHeight: 27, fontWeight: "600", color: colors.onSurface },
  progress: { fontSize: 16, lineHeight: 24, color: colors.onSurfaceSecondary },
  title: { fontSize: 28, lineHeight: 38, fontWeight: "700", color: colors.onSurface },
  text: { fontSize: 20, lineHeight: 30, color: colors.onSurface },
  label: { fontSize: 18, lineHeight: 27, fontWeight: "600", color: colors.onSurface },
  input: { borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, padding: spacing.md, minHeight: 64, fontSize: 20, color: colors.onSurface },
  primary: { backgroundColor: colors.brandPrimary, borderRadius: radius.md, padding: spacing.md, minHeight: 64, justifyContent: "center" },
  primaryText: { fontSize: 20, lineHeight: 30, color: colors.onBrandPrimary, fontWeight: "600", textAlign: "center" },
  secondary: { borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, padding: spacing.md, minHeight: 64, justifyContent: "center" },
  buttonText: { fontSize: 20, lineHeight: 30, color: colors.onSurface },
  note: { fontSize: 16, lineHeight: 24, color: colors.onSurfaceSecondary },
});
