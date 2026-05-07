import { Dimensions, StyleSheet } from "react-native";
import { shadowStyle } from "../../../shared/theme/shadow";
import { colors } from "../../../shared/theme/colors";

const { width: screenWidth } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    width: screenWidth * 0.9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.surface.screen,
    elevation: 3,
    ...(shadowStyle({
      boxShadow: "0px 4px 8px rgba(0,0,0,0.10)",
      shadowColor: colors.overlay.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    }) || {}),
    paddingBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    marginTop: 12,
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
});

export default styles;
