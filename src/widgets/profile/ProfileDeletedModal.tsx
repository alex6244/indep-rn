import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { shadowStyle } from "../../shared/theme/shadow";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ProfileDeletedModal({ visible, onClose }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Страница удалена</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Понятно</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },
  card: {
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
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#DB4431",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
