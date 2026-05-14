export const FONT_FAMILY = {
  regular: "Moderustic",
} as const;

export const FONT_SOURCES = {
  [FONT_FAMILY.regular]: require("../../assets/fonts/Moderustic/Moderustic[wght].ttf"),
} as const;
