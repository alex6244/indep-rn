import { Platform } from "react-native";

type ShadowInput = {
  /** web box-shadow string like: "0px 6px 12px rgba(0,0,0,0.08)" */
  boxShadow: string;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffset?: { width: number; height: number };
  elevation?: number;
};

/**
 * react-native-web deprecates `shadow*` style props in favor of `boxShadow`.
 * Use this helper to keep native shadows while avoiding web warnings.
 */
export function shadowStyle(input: ShadowInput) {
  const {
    boxShadow,
    shadowColor = "#000",
    shadowOpacity = 0.1,
    shadowRadius = 10,
    shadowOffset = { width: 0, height: 4 },
    elevation = 0,
  } = input;

  return Platform.select({
    web: { boxShadow },
    ios: {
      shadowColor,
      shadowOpacity,
      shadowRadius,
      shadowOffset,
    },
    android: {
      elevation,
    },
    default: {
      shadowColor,
      shadowOpacity,
      shadowRadius,
      shadowOffset,
      elevation,
    },
  });
}

