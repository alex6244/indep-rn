import { StyleSheet } from "react-native";
import { FONT_FAMILY } from "../theme/fonts";

export const landingStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DEDEDE",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchPlaceholder: {
    fontSize: 12,
    color: "#979797",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerLink: {
    fontSize: 14,
    color: "#080717",
    fontFamily: FONT_FAMILY.button,
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
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 12,
  },
  heroTitleAccent: {
    color: "#DB4431",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#F5F5F5",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#DB4431",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
    fontFamily: FONT_FAMILY.button,
  },

  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1E1E1E",
  },

  horizontalCards: {
    gap: 12,
  },
  benefitCard: {
    width: 220,
    backgroundColor: "#F7F7F7",
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
    color: "#555",
  },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
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
    backgroundColor: "#080717",
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#080717",
    fontFamily: FONT_FAMILY.button,
  },
  toggleButtonTextActive: {
    color: "#FFFFFF",
  },

  stepsGrid: {
    marginTop: 16,
    gap: 12,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  stepImage: {
    height: 120,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: "#F7F7F7",
  },
  stepNumber: {
    backgroundColor: "#F3E4E2",
    color: "#DB4431",
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
    color: "#555",
  },

  carsGrid: {
    marginTop: 12,
    gap: 16,
  },
  carCard: {
    backgroundColor: "#F7F7F7",
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
    color: "#FFFFFF",
    backgroundColor: "#DB4431",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  carName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1E1E1E",
  },
  carDetails: {
    fontSize: 11,
    color: "#777",
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
    backgroundColor: "#EFEFEF",
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
    color: "#555",
  },
});
