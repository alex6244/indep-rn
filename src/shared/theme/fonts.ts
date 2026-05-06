export const FONT_FAMILY = {
  regular: "Moderustic-Regular",
} as const;

export const FONT_SOURCES = {
  [FONT_FAMILY.regular]: require("../../assets/fonts/Moderustic/static/Moderustic-Regular.ttf"),
} as const;
