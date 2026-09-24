// Illustrazione brand con velo ivory/terracotta leggero per uniformare le tonalità.
// Angoli arrotondati.

import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "@/src/theme";

interface Props {
  source: ImageSourcePropType;
  height: number;
  radius?: number;
  style?: ViewStyle;
}

export function MonoImage({ source, height, radius = 16, style }: Props) {
  return (
    <View
      style={[
        {
          height,
          borderRadius: radius,
          overflow: "hidden",
          backgroundColor: colors.surfaceSecondary,
        },
        style,
      ]}
    >
      <Image source={source} style={styles.fill} resizeMode="cover" />
      <View style={[styles.fill, styles.tintIvory]} />
      <View style={[styles.fill, styles.tintTerracotta]} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  // velo caldo: ivory per schiarire, terracotta per riscaldare
  tintIvory: {
    backgroundColor: colors.background,
    opacity: 0.18,
  },
  tintTerracotta: {
    backgroundColor: colors.brandPrimary,
    opacity: 0.1,
  },
});
