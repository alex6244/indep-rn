import React from "react";
import { BlurView } from "expo-blur";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { shadowStyle } from "../../shared/theme/shadow";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
};

export function DeleteProfileConfirmModal({
  visible,
  onClose,
  onConfirmDelete,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFillObject} />
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.contentWrap} pointerEvents="box-none">
          <View style={styles.card} onStartShouldSetResponder={() => true}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>
              Вы уверены, что хотите удалить эту страницу?
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.body}>
            После удаления страницы она будет безвозвратно удалена и восстановить
            её будет невозможно.
          </Text>

          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onConfirmDelete}>
              <Text style={styles.deleteText}>Удалить страницу</Text>
            </TouchableOpacity>
          </View>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 22,
    lineHeight: 22,
    color: "#777",
    fontWeight: "700",
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  body: {
    marginTop: 8,
    fontSize: 12,
    color: "#777",
    lineHeight: 16,
  },
  row: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#1E1E1E",
    fontWeight: "700",
    fontSize: 13,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#DB4431",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  deleteText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
});
