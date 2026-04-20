import { View, StyleSheet } from "react-native";
import AutoScreen from "../../features/auto/ui/AutoScreen";

export default function AutoRoute() {
  return (
    <View style={styles.container}>
      <AutoScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
