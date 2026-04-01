export const FONT_FAMILY = {
  regular: "Moderustic-Regular",
  button: "Inter-Medium",
} as const;

export const FONT_SOURCES = {
  [FONT_FAMILY.regular]: require("../../assets/fonts/Moderustic/static/Moderustic-Regular.ttf"),
  [FONT_FAMILY.button]: require("../../assets/fonts/Inter/static/Inter_24pt-Medium.ttf"),
} as const;
