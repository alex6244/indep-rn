import { StyleSheet } from "react-native";
import { shadowStyle } from "../../../../shared/theme/shadow";
import { colors } from "../../../../shared/theme/colors";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.screen,
  },
  topBar: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface.primary,
    borderRadius: 0,
  },
  content: {
    paddingTop: 10,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text.primary,
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.tertiary,
    fontWeight: "600",
    lineHeight: 18,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text.primary,
    marginBottom: 12,
  },
  defectsTabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  defectsTabBtn: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    backgroundColor: colors.surface.neutral,
    alignItems: "center",
    justifyContent: "center",
  },
  defectsTabBtnActive: {
    backgroundColor: colors.brand.primary,
  },
  defectsTabText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text.tertiary,
  },
  defectsTabTextActive: {
    color: colors.text.inverse,
  },
  defectsPreview: {},
  schemePreview: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.surface.neutral,
  },
  photosPreview: {
    height: 140,
    borderRadius: 14,
    backgroundColor: colors.surface.neutral,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  photosPreviewText: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: "700",
    textAlign: "center",
  },
  checkList: {
    gap: 10,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkText: {
    fontSize: 14,
    fontWeight: "700",
  },
  checkTextOk: {
    color: colors.text.primary,
  },
  checkTextBad: {
    color: colors.text.primary,
  },
  ptsBox: {
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.status.info,
    padding: 12,
  },
  ptsGrid: {
    gap: 12,
  },
  ptsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  ptsLabel: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  ptsValue: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
  },
  simpleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  simpleLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.subtle,
    flex: 1,
  },
  simpleValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text.primary,
    textAlign: "right",
  },
  ownerGroup: {
    marginBottom: 10,
  },
  ownerLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 6,
  },
  ownerValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text.tertiary,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeOk: {
    backgroundColor: colors.status.successBg,
  },
  badgeBad: {
    backgroundColor: colors.status.warningBg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  badgeTextOk: {
    color: colors.status.success,
  },
  badgeTextBad: {
    color: colors.brand.primary,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 14,
  },
  bottomBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    backgroundColor: colors.surface.inverse,
  },
  confirmBtn: {
    backgroundColor: colors.brand.primary,
  },
  bottomBtnTextEdit: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "700",
  },
  bottomBtnTextConfirm: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "700",
  },
  vinModalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay.backdrop,
    justifyContent: "center",
    padding: 16,
  },
  vinModalCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: 18,
    padding: 16,
    ...(shadowStyle({
      // Shadow raw values are kept intentionally for platform-specific shadow rendering.
      boxShadow: "0px 10px 16px rgba(0,0,0,0.12)",
      shadowColor: colors.overlay.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    }) as object),
    elevation: 6,
  },
  vinModalTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text.primary,
    marginBottom: 10,
  },
  vinModalSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.tertiary,
    fontWeight: "700",
    marginBottom: 14,
  },
  vinModalButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  vinModalButtonText: {
    color: colors.text.inverse,
    fontWeight: "800",
    fontSize: 14,
  },
  loadingScreen: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.tertiary,
  },
  centerText: {
    padding: 16,
    color: colors.text.tertiary,
    fontWeight: "700",
  },
});
