import { StyleSheet } from "react-native";
import { shadowStyle } from "../../../../shared/theme/shadow";
import { colors } from "../../../../shared/theme/colors";
import { PR_TYPO } from "../pickerReport.styles";

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
    ...PR_TYPO.confirmTitle,
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  subtitle: {
    ...PR_TYPO.confirmSubtitle,
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
    ...PR_TYPO.cardTitle,
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
  defectsTabText: PR_TYPO.tab,
  defectsTabTextActive: PR_TYPO.tabActive,
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
    ...PR_TYPO.caption,
    textAlign: "center",
  },
  damagePhotosScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  damagePhotoThumb: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.surface.neutral,
  },
  checkList: {
    gap: 10,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkText: PR_TYPO.body,
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
    ...PR_TYPO.value,
    flex: 1,
    fontWeight: "500",
  },
  ptsValue: {
    ...PR_TYPO.value,
    flex: 1,
    textAlign: "right",
  },
  simpleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  simpleLabel: {
    ...PR_TYPO.rowLabel,
    flex: 1,
  },
  simpleValue: {
    ...PR_TYPO.rowValue,
    textAlign: "right",
  },
  ownerGroup: {
    marginBottom: 10,
  },
  ownerLabel: {
    ...PR_TYPO.fieldLabel,
    marginBottom: 6,
  },
  ownerValue: PR_TYPO.valueMuted,
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
  badgeText: PR_TYPO.badge,
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
  bottomBtnTextEdit: PR_TYPO.button,
  bottomBtnTextConfirm: PR_TYPO.button,
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
    ...PR_TYPO.modalTitle,
    marginBottom: 10,
  },
  vinModalSubtitle: {
    ...PR_TYPO.modalBody,
    marginBottom: 14,
  },
  vinModalButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  vinModalButtonText: PR_TYPO.buttonSmall,
  loadingScreen: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: PR_TYPO.bodyMuted,
  centerText: {
    ...PR_TYPO.body,
    padding: 16,
    color: colors.text.tertiary,
  },
});
