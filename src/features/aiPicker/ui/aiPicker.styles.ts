import { StyleSheet } from "react-native";
import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import { figmaText } from "../../../shared/theme/typography";

export const aiPickerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.neutral,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.muted,
    backgroundColor: colors.surface.primary,
  },
  headerTitle: {
    ...figmaText.titleBold,
    color: colors.text.primary,
    flex: 1,
  },
  headerSubtitle: {
    ...figmaText.caption,
    color: colors.text.muted,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    backgroundColor: colors.brand.primary,
    borderRadius: radius.lg,
    borderBottomRightRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleAssistant: {
    alignSelf: "flex-start",
    maxWidth: "92%",
    backgroundColor: colors.surface.primary,
    borderRadius: radius.lg,
    borderBottomLeftRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.muted,
  },
  bubbleTextUser: {
    ...figmaText.body,
    color: colors.text.inverse,
  },
  bubbleTextAssistant: {
    ...figmaText.body,
    color: colors.text.primary,
  },
  carList: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border.muted,
    backgroundColor: colors.surface.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.border.input,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...figmaText.body,
    color: colors.text.primary,
    backgroundColor: colors.surface.input,
  },
  disclaimer: {
    ...figmaText.caption,
    color: colors.text.muted,
    textAlign: "center",
  },
  leadBox: {
    padding: spacing.md,
    backgroundColor: colors.surface.soft,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  leadTitle: {
    ...figmaText.bodySemibold,
    color: colors.text.primary,
  },
  selectedHint: {
    ...figmaText.caption,
    color: colors.text.secondary,
  },
  loadingWrap: {
    padding: spacing.lg,
    alignItems: "center",
  },
});
