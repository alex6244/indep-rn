import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../shared/theme/colors";
import { typography } from "../../shared/theme/typography";
import { ChecksLawList } from "./checks/ChecksLawList";
import { ChecksTechGrid } from "./checks/ChecksTechGrid";
import { SectionMoreButton } from "./checks/SectionMoreButton";
import { lawChecks, techChecks } from "./checks/homeChecks.data";

export function ChecksGridSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Что проверяют подборщики</Text>
      <Text style={styles.subtitle}>Техническая сторона</Text>
      <ChecksTechGrid items={techChecks} columns={3} />
      <SectionMoreButton />

      <Text style={[styles.subtitle, styles.lawSubtitle]}>Юридическая сторона</Text>
      <ChecksLawList items={lawChecks} />
      <SectionMoreButton />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
  },
  title: {
    fontSize: typography.sizes.heading,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: typography.sizes.title,
    color: colors.text.primary,
    fontWeight: "700",
    marginBottom: 10,
  },
  lawSubtitle: {
    marginTop: 18,
  },
});

