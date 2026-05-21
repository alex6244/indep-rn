import { StyleSheet } from "react-native";
import { colors } from "../../../../shared/theme/colors";
import { radius } from "../../../../shared/theme/radius";
import { spacing } from "../../../../shared/theme/spacing";
import { typography } from "../../../../shared/theme/typography";

export const INPUT_MIN_HEIGHT = 44;

export const catalogFilterStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface.primary,
  },
  scroll: { flex: 1 },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.md,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  backBtnText: {
    ...typography.textRegular,
    color: colors.brand.primary,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: spacing.sm,
  },
  filtersTitle: {
    ...typography.title,
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  filterBlock: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  filterLabel: {
    ...typography.textRegular,
    fontSize: 12,
    fontWeight: "500",
    color: colors.text.tertiary,
  },
  resetLink: {
    ...typography.textRegular,
    fontSize: 12,
    fontWeight: "500",
    color: colors.brand.primary,
  },
  inputWrap: {
    marginBottom: spacing.sm,
  },
  inputsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  inputHalf: {
    flex: 1,
  },
  marksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  brandTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.sm,
    backgroundColor: colors.surface.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: INPUT_MIN_HEIGHT,
  },
  brandTriggerTextPlaceholder: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.text.subtle,
    flex: 1,
  },
  brandTriggerTextActive: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  brandClearBtn: {
    fontSize: 14,
    color: colors.text.subtle,
    paddingLeft: spacing.sm,
  },
  mileageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.sm,
    backgroundColor: colors.surface.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: INPUT_MIN_HEIGHT,
  },
  mileageRowText: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.text.subtle,
  },
  mileageRowTextActive: {
    color: colors.text.primary,
  },
});
