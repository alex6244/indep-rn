import { StyleSheet } from "react-native";
import { FONT_FAMILY } from "../theme/fonts";
import { colors } from "../theme/colors";

export const landingStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.screen,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.soft,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface.screen,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    height: 32,
    width: 120,
  },
  searchContainer: {
    backgroundColor: colors.surface.soft,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchPlaceholder: {
    fontSize: 12,
    color: colors.text.subtle,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerLink: {
    fontSize: 14,
    color: colors.surface.inverse,
    fontFamily: FONT_FAMILY.regular,
  },
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  heroContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  heroBackground: {
    height: 320,
    borderRadius: 16,
    overflow: "hidden",
  },
  heroBackgroundImage: {
    borderRadius: 16,
  },
  heroOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  heroTitle: {
    fontSize: 28,
    color: colors.text.inverse,
    fontWeight: "600",
    marginBottom: 12,
  },
  heroTitleAccent: {
    color: colors.brand.primary,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.surface.card,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.text.inverse,
    fontWeight: "500",
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
  },

  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: colors.text.primary,
  },

  horizontalCards: {
    gap: 12,
  },
  benefitCard: {
    width: 220,
    backgroundColor: colors.surface.neutral,
    borderRadius: 12,
    padding: 12,
  },
  benefitIcon: {
    height: 32,
    width: 32,
    marginBottom: 8,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 11,
    color: colors.text.dim,
  },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface.neutral,
    padding: 4,
    borderRadius: 18,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: colors.surface.inverse,
  },
  toggleButtonText: {
    fontSize: 14,
    color: colors.surface.inverse,
    fontFamily: FONT_FAMILY.regular,
  },
  toggleButtonTextActive: {
    color: colors.text.inverse,
  },

  stepsGrid: {
    marginTop: 16,
    gap: 12,
  },
  stepCard: {
    backgroundColor: colors.surface.screen,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surface.card,
  },
  stepImage: {
    height: 120,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: colors.surface.neutral,
  },
  stepNumber: {
    backgroundColor: colors.status.warningMutedBg,
    color: colors.brand.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  stepText: {
    fontSize: 11,
    color: colors.text.dim,
  },

  carsGrid: {
    marginTop: 12,
    gap: 16,
  },
  carCard: {
    backgroundColor: colors.surface.neutral,
    borderRadius: 16,
    padding: 12,
  },
  carImagesRow: {
    gap: 8,
  },
  carImage: {
    height: 140,
    width: 200,
    borderRadius: 12,
  },
  carInfo: {
    marginTop: 8,
    gap: 4,
  },
  carPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carPrice: {
    fontSize: 20,
    fontWeight: "600",
  },
  carMileage: {
    fontSize: 11,
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  carName: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.primary,
  },
  carDetails: {
    fontSize: 11,
    color: colors.text.faint,
  },
  carButtonsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 8,
  },
  favButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surface.placeholder,
    alignItems: "center",
    justifyContent: "center",
  },
  carAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  carAddress: {
    fontSize: 10,
    color: colors.text.dim,
  },
});
