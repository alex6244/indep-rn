import { StyleSheet } from "react-native";
import { shadowStyle } from "../../../../shared/theme/shadow";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  topBar: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
  },
  content: {
    paddingTop: 10,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1E1E1E",
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B757C",
    fontWeight: "600",
    lineHeight: 18,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    ...(shadowStyle({
      boxShadow: "0px 4px 10px rgba(0,0,0,0.06)",
      shadowColor: "#000000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    }) as object),
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1E1E1E",
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
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
  },
  defectsTabBtnActive: {
    backgroundColor: "#DB4431",
  },
  defectsTabText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6B757C",
  },
  defectsTabTextActive: {
    color: "#FFFFFF",
  },
  defectsPreview: {},
  schemePreview: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F7F7F7",
  },
  photosPreview: {
    height: 140,
    borderRadius: 14,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  photosPreviewText: {
    fontSize: 12,
    color: "#6B757C",
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
    color: "#1E1E1E",
  },
  checkTextBad: {
    color: "#1E1E1E",
  },
  ptsBox: {
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#0A84FF",
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
    color: "#1E1E1E",
    fontSize: 13,
    fontWeight: "700",
  },
  ptsValue: {
    flex: 1,
    color: "#1E1E1E",
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
    color: "#979797",
    flex: 1,
  },
  simpleValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E1E1E",
    textAlign: "right",
  },
  ownerGroup: {
    marginBottom: 10,
  },
  ownerLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 6,
  },
  ownerValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6B757C",
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
    backgroundColor: "#EAF7EE",
  },
  badgeBad: {
    backgroundColor: "#FFF1F3",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  badgeTextOk: {
    color: "#4DB95C",
  },
  badgeTextBad: {
    color: "#DB4431",
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
    backgroundColor: "#080717",
  },
  confirmBtn: {
    backgroundColor: "#DB4431",
  },
  bottomBtnTextEdit: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  bottomBtnTextConfirm: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  vinModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },
  vinModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    ...(shadowStyle({
      boxShadow: "0px 10px 16px rgba(0,0,0,0.12)",
      shadowColor: "#000",
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
    color: "#1E1E1E",
    marginBottom: 10,
  },
  vinModalSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B757C",
    fontWeight: "700",
    marginBottom: 14,
  },
  vinModalButton: {
    backgroundColor: "#DB4431",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  vinModalButtonText: {
    color: "#FFFFFF",
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
    color: "#6B757C",
  },
  centerText: {
    padding: 16,
    color: "#6B757C",
    fontWeight: "700",
  },
});
