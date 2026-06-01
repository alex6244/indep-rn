import type { TextStyle } from "react-native";
import { figmaText } from "../../../shared/theme/typography";

/** Base text for auto-credit screens (Moderustic / Figma). */
export const acText: TextStyle = { ...figmaText.body };

/** Section titles — medium, без bold. */
export const acTitle: TextStyle = { ...acText, fontWeight: "500" };
