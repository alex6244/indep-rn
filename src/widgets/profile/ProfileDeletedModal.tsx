import React from "react";
import { BlurView } from "expo-blur";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeletedIllustration from "../../assets/profile/empty.svg";
import { shadowStyle } from "../../shared/theme/shadow";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ProfileDeletedModal({ visible, onClose }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFillObject} />
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.contentWrap} pointerEvents="box-none">
          <View style={styles.card} onStartShouldSetResponder={() => true}>
            <Text style={styles.title}>Страница удалена</Text>
            <View style={styles.illustrationWrap}>
              <DeletedIllustration width="100%" height="100%" />
            </View>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Понятно</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  contentWrap: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
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
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  illustrationWrap: {
    marginTop: 14,
    width: "100%",
    height: 210,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#DB4431",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
