import { StyleSheet } from "react-native";
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
  },
  center: {
    flex: 1,
    backgroundColor: colors.surface.screen,
    justifyContent: "center",
    padding: 16,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: colors.text.primary,
    textAlign: "center",
  },
  noticeText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: colors.brand.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  primaryBtnText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "700",
  },
});

