// Logo/stemma del Comune attivo.
// - Con lo stemma ufficiale: mostrato grande (le pagine passano una misura ampia).
// - Senza stemma: piccolo segnaposto discreto con l'iniziale, nei colori dell'ente,
//   così non sembra un logo "finto" in primo piano.

import React from "react";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";

import { comune } from "@/src/config/comune";
import { fonts } from "@/src/theme";

interface Props {
  size?: number;
  style?: ViewStyle;
}

export function ComuneLogo({ size = 56, style }: Props) {
  const t = comune.theme;

  if (comune.logo) {
    return (
      <View
        style={[styles.box, { width: size, height: size, borderRadius: size * 0.22 }, style]}
        testID="comune-logo"
      >
        <Image
          source={comune.logo}
          style={{ width: size * 0.86, height: size * 0.86 }}
          resizeMode="contain"
          accessibilityLabel={`Stemma ${comune.delEnte}`}
        />
      </View>
    );
  }

  // Segnaposto: scudo stilizzato con l'iniziale del Comune
  const iniziale = comune.nomeBreve.trim().charAt(0).toUpperCase();
  return (
    <View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: size * 0.22,
          borderColor: t.warm,
        },
        style,
      ]}
      accessibilityLabel={`Stemma ${comune.delEnte}`}
      testID="comune-logo-placeholder"
    >
      <View
        style={[
          styles.shield,
          {
            width: size * 0.5,
            height: size * 0.58,
            backgroundColor: t.warmSoft,
            borderColor: t.warmDark,
            borderBottomLeftRadius: size * 0.25,
            borderBottomRightRadius: size * 0.25,
            borderTopLeftRadius: size * 0.08,
            borderTopRightRadius: size * 0.08,
          },
        ]}
      >
        <Text
          style={{
            fontFamily: fonts.serif,
            fontWeight: "700",
            fontSize: size * 0.28,
            color: t.warmDark,
            marginTop: -size * 0.03,
          }}
        >
          {iniziale}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(51,47,38,0.12)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  shield: {
    borderWidth: 1.2,
    alignItems: "center",
    justifyContent: "center",
  },
});
