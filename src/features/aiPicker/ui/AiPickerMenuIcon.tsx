import { Feather } from "@expo/vector-icons";
import React from "react";
import { colors } from "../../../shared/theme/colors";

export function AiPickerMenuIcon({
  width = 22,
  height = 22,
}: {
  width?: number;
  height?: number;
}) {
  const size = Math.min(width, height);
  return <Feather name="cpu" size={size} color={colors.text.primary} />;
}
