import { StyleSheet } from "react-native";
import { typography } from "../../../shared/theme/typography";
import { shadowStyle } from "../../../shared/theme/shadow";
import { colors } from "../../../shared/theme/colors";

export const catalogStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface.screen,
    position: "relative",
  },
  content: {
    padding: 16,
  },
  breadcrumbs: {
    marginBottom: 12,
  },
  breadcrumbText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.text.subtle,
  },
  filtersBar: {
    marginBottom: 16,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface.neutral,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  sortIcon: {
    ...typography.textRegular,
    fontSize: 18,
    color: colors.surface.inverse,
  },
  sortOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 30,
  },
  sortDropdown: {
    position: "absolute",
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    ...(shadowStyle({
      // Shadow raw values are kept intentionally for platform-specific shadow rendering.
      boxShadow: "0px 4px 10px rgba(0,0,0,0.12)",
      shadowColor: "#000000",
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 10,
    }) || {}),
    elevation: 10,
    zIndex: 40,
  },
  sortItem: {
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  sortItemText: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "500",
  },
  sortItemTextActive: {
    color: colors.brand.primary,
    fontWeight: "700",
  },
  sortDivider: {
    height: 1,
    backgroundColor: colors.surface.placeholder,
  },
  allFiltersButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.brand.primary,
    marginRight: 8,
  },
  allFiltersText: {
    ...typography.buttonText,
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "500",
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface.neutral,
    marginRight: 8,
  },
  filterChipText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.text.tertiary,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  carsGrid: {
    gap: 12,
  },
  carCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: 20,
    padding: 14,
    ...(shadowStyle({
      // Shadow raw values are kept intentionally for platform-specific shadow rendering.
      boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
      shadowColor: "#000000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    }) || {}),
    elevation: 4,
  },
  carImagesScroll: {
    marginBottom: 12,
    marginHorizontal: -2,
  },
  carImagesScrollContent: {
    paddingRight: 4,
  },
  carImage: {
    height: 160,
    borderRadius: 16,
    marginRight: 8,
  },
  carImageLast: {
    marginRight: 0,
  },
  carInfo: {
    marginBottom: 4,
  },
  carPrice: {
    ...typography.title,
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 6,
  },
  carSpecsLine: {
    ...typography.textRegular,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  carModelLine: {
    ...typography.caption,
    fontSize: 12,
    color: colors.icon.muted,
    lineHeight: 16,
  },
  carButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  carFavWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  carAddressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    gap: 4,
    paddingRight: 4,
  },
  carAddressIcon: {
    marginTop: 2,
  },
  carAddress: {
    ...typography.caption,
    flex: 1,
    fontSize: 11,
    color: colors.icon.muted,
    lineHeight: 15,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    backgroundColor: colors.brand.primary,
  },
  btnTextPrimary: {
    ...typography.buttonText,
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "500",
  },
  seeAllBtn: {
    marginTop: 16,
  },
  orderReportBtn: {
    marginTop: 14,
    marginBottom: 8,
    backgroundColor: colors.brand.darkAlt,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  orderReportBtnText: {
    ...typography.buttonText,
    color: colors.text.inverse,
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
  },
  footerLogo: {
    ...typography.title,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  footerLink: {
    ...typography.caption,
    fontSize: 12,
    textDecorationLine: "underline",
  },
  footerCopyright: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.subtle,
  },
  filtersOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
  },
  filtersBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay.backdrop,
  },
  filtersPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: colors.surface.primary,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "visible",
    bottom: 0,
  },
  emptyStateText: {
    ...typography.caption,
    color: colors.text.subtle,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 24,
  },
});
