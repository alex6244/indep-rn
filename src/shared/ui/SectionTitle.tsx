import React from "react";
import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export function SectionTitle({ children, style }: Props) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    fontSize: 30,
    lineHeight: 34,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
});

