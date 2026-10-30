import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/src/theme";

const choices = [
  { id: "adesso", label: "Capire cosa fare adesso", step: "Il prossimo passo può essere preparare una domanda per il medico che ti segue: che cosa significa questa diagnosi per la mia vita quotidiana? Se vuoi, puoi parlarne con una persona di fiducia." },
  { id: "medico", label: "Preparare le domande per il medico", step: "Scegli la domanda che per te conta di più: quali controlli devo programmare, chi posso contattare se ho dubbi, oppure quali indicazioni devo seguire ora? Puoi annotarla per il prossimo incontro." },
  { id: "servizi", label: "Orientarmi tra servizi e pratiche", step: "Parti da ciò che hai già fatto: hai soltanto la diagnosi, una pratica in corso o un verbale? Il passo successivo dipende anche dal territorio. Puoi chiedere al servizio sociale del tuo Comune di residenza quale sportello ti aiuta a orientarti, senza avviare subito una nuova pratica." },
] as const;

export function FirstStepCard() {
  const [selected, setSelected] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const choice = choices.find((item) => item.id === selected);
  return (
    <View style={styles.card} testID="first-step-card">
      <Text style={styles.title} accessibilityRole="header">Possiamo iniziare da un solo passo</Text>
      <Text style={styles.text}>Non devi affrontare tutto adesso e non servono referti. Quale aiuto ti sarebbe utile in questo momento?</Text>
      {!paused && choices.map((item) => (
        <Pressable key={item.id} accessibilityRole="button"
          accessibilityState={{ selected: selected === item.id }}
          onPress={() => setSelected(item.id)} style={styles.button} testID={`first-step-${item.id}`}>
          <Text style={styles.buttonText}>{item.label}</Text>
        </Pressable>
      ))}
      <View accessibilityLiveRegion="polite">
        {paused ? <Text style={styles.text}>Puoi fermarti qui. Quando vuoi, riprendi da questa pagina.</Text>
          : choice && <Text style={styles.text} testID="first-step-result">{choice.step}</Text>}
      </View>
      <Pressable accessibilityRole="button" onPress={() => setPaused(!paused)} style={styles.button} testID="first-step-pause">
        <Text style={styles.buttonText}>{paused ? "Riprendi" : "Preferisco fermarmi per ora"}</Text>
      </Pressable>
      <Text style={styles.note}>La scelta resta solo in questa schermata: uscendo dovrai selezionarla di nuovo. Nessun dato viene inviato da questa scheda.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, gap: spacing.md },
  title: { fontSize: 20, fontWeight: "700", color: colors.onSurface },
  text: { fontSize: 16, lineHeight: 24, color: colors.onSurfaceSecondary },
  button: { minHeight: 48, justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
  buttonText: { fontSize: 16, color: colors.onSurface, fontWeight: "600" },
  note: { fontSize: 13, lineHeight: 19, color: colors.onSurfaceSecondary },
});
