import { useEffect, useRef } from "react";
import { Animated, StyleSheet, type ViewStyle } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  width: ViewStyle["width"];
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Skeleton({ width, height, borderRadius = 4, style }: Props) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const { isDark } = useTheme();

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.bone,
        {
          width,
          height,
          borderRadius,
          opacity,
          backgroundColor: isDark ? "#3a3a3c" : "#e0e0e0",
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bone: {},
});
