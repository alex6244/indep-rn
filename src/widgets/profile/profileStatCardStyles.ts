import { StyleSheet } from "react-native";
import { colors } from "../../shared/theme/colors";
import { shadowStyle } from "../../shared/theme/shadow";
import { PROFILE_STAT_CARD_RADIUS } from "./profileStatCardMetrics";

export const profileStatCardShadow = shadowStyle({
  boxShadow: "0px 4px 10px rgba(0,0,0,0.04)",
  shadowColor: colors.text.primary,
  shadowOpacity: 0.04,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
}) as object;

export const profileStatCardStyles = StyleSheet.create({
  card: {
    borderRadius: PROFILE_STAT_CARD_RADIUS,
    backgroundColor: colors.surface.primary,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: "space-between",
    overflow: "hidden",
    ...profileStatCardShadow,
    elevation: 2,
  },
  cardBalance: {
    position: "relative",
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    color: colors.text.muted,
  },
  value: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "500",
    color: colors.text.primary,
    marginBottom: 2,
  },
  valueCompact: {
    fontSize: 17,
  },
  valueFullWidth: {
    width: "100%",
    marginBottom: 0,
  },
});
