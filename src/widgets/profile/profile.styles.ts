import { StyleSheet } from "react-native";
import { figmaText } from "../../shared/theme/typography";
import { shadowStyle } from "../../shared/theme/shadow";
import { colors } from "../../shared/theme/colors";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.neutral,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  center: {
    flex: 1,
    backgroundColor: colors.surface.neutral,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    ...figmaText.body,
    marginTop: 12,
    color: colors.text.dim,
  },
  card: {
    backgroundColor: colors.surface.screen,
    borderRadius: 20,
    padding: 20,
    ...(shadowStyle({
      boxShadow: "0px 6px 12px rgba(0,0,0,0.06)",
      shadowColor: colors.overlay.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    }) as object),
    marginBottom: 16,
    alignItems: "center",
  },
  lockEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    ...figmaText.screenTitle,
    color: colors.text.primary,
    textAlign: "center",
    marginTop: 4,
  },
  cardSubtitle: {
    ...figmaText.value,
    fontWeight: "400",
    lineHeight: 18,
    color: colors.text.dim,
    textAlign: "center",
    marginTop: 8,
  },
  primaryButton: {
    marginTop: 20,
    alignSelf: "stretch",
    backgroundColor: colors.brand.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    ...figmaText.bodyLargeMedium,
    fontWeight: "600",
    color: colors.text.inverse,
  },
  secondaryButton: {
    marginTop: 10,
    alignSelf: "stretch",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.strong,
    backgroundColor: colors.surface.screen,
  },
  secondaryButtonText: {
    ...figmaText.bodyLargeMedium,
    fontWeight: "600",
    color: colors.brand.primary,
  },
  pickerScreen: {
    flex: 1,
    backgroundColor: colors.surface.neutral,
  },
  pickerContent: {
    paddingTop: 10,
  },
  sectionTitle: {
    ...figmaText.subtitle,
    marginTop: 18,
    marginHorizontal: 16,
    color: colors.text.primary,
  },
  reportCard: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: colors.surface.screen,
    borderRadius: 18,
    overflow: "hidden",
  },
  reportImageWrap: {
    position: "relative",
    backgroundColor: colors.icon.placeholder,
  },
  reportImagePlaceholder: {
    height: 160,
    width: "100%",
  },
  mileageBadge: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: colors.brand.primary,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mileageBadgeText: {
    ...figmaText.tabLabel,
    fontWeight: "600",
    color: colors.text.inverse,
  },
  reportBody: {
    padding: 14,
    gap: 6,
  },
  reportPrice: {
    ...figmaText.subtitle,
    color: colors.text.primary,
  },
  reportSub: {
    ...figmaText.caption,
    color: colors.text.faint,
  },
  openButton: {
    marginTop: 8,
    backgroundColor: colors.brand.primary,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
  },
  openButtonText: {
    ...figmaText.bodyBold,
    color: colors.text.inverse,
  },
  fab: {
    position: "absolute",
    right: 18,
    bottom: 96,
    width: 56,
    height: 56,
    ...(shadowStyle({
      boxShadow: "0px 8px 12px rgba(0,0,0,0.15)",
      shadowColor: colors.overlay.shadow,
      shadowOpacity: 0.15,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    }) as object),
  },
  fabIcon: {
    width: 56,
    height: 56,
  },
});
