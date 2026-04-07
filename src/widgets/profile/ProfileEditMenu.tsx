import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DeleteProfileConfirmModal } from "./DeleteProfileConfirmModal";
import { ProfileDeletedModal } from "./ProfileDeletedModal";
import { shadowStyle } from "../../shared/theme/shadow";

type Props = {
  editMenuOpen: boolean;
  confirmDeleteOpen: boolean;
  deletedOpen: boolean;
  onCloseEditMenu: () => void;
  onChangePhone: () => void;
  onOpenDeleteConfirm: () => void;
  onCloseDeleteConfirm: () => void;
  onConfirmDelete: () => void;
  onCloseDeleted: () => void;
};

export function ProfileEditMenu({
  editMenuOpen,
  confirmDeleteOpen,
  deletedOpen,
  onCloseEditMenu,
  onChangePhone,
  onOpenDeleteConfirm,
  onCloseDeleteConfirm,
  onConfirmDelete,
  onCloseDeleted,
}: Props) {
  return (
    <>
      <Modal
        transparent
        visible={editMenuOpen}
        animationType="fade"
        onRequestClose={onCloseEditMenu}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onCloseEditMenu}
        >
          <View style={styles.menu} onStartShouldSetResponder={() => true}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onCloseEditMenu();
                onChangePhone();
              }}
            >
              <Text style={styles.itemText}>Изменить номер телефона</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onCloseEditMenu();
                onOpenDeleteConfirm();
              }}
            >
              <Text style={[styles.itemText, styles.dangerText]}>Удалить профиль</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <DeleteProfileConfirmModal
        visible={confirmDeleteOpen}
        onClose={onCloseDeleteConfirm}
        onConfirmDelete={onConfirmDelete}
      />

      <ProfileDeletedModal visible={deletedOpen} onClose={onCloseDeleted} />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  menu: {
    position: "absolute",
    top: 90,
    right: 16,
    width: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 6,
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
  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 14,
    color: "#1E1E1E",
    fontWeight: "600",
  },
  dangerText: {
    color: "#DB4431",
  },
});

