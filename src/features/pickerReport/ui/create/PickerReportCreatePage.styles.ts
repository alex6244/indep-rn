import { StyleSheet } from "react-native";
import { colors } from "../../../../shared/theme/colors";
import { PR_TYPO } from "../pickerReport.styles";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.screen,
  },
  content: {},
  center: {
    flex: 1,
    backgroundColor: colors.surface.screen,
    justifyContent: "center",
    padding: 16,
  },
  noticeTitle: {
    ...PR_TYPO.sectionTitle,
    marginBottom: 10,
    textAlign: "center",
  },
  noticeText: {
    ...PR_TYPO.bodyMuted,
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
  primaryBtnText: PR_TYPO.buttonSmall,
});

