import React from "react";
import { BlurView } from "expo-blur";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DeleteProfileConfirmModal } from "./DeleteProfileConfirmModal";
import { ProfileDeletedModal } from "./ProfileDeletedModal";
import { shadowStyle } from "../../shared/theme/shadow";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

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
  menuTopOffset?: number;
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
  menuTopOffset,
}: Props) {
  const insets = useSafeAreaInsets();
  const menuTop = insets.top + (menuTopOffset ?? 56);

  return (
    <>
      <Modal
        transparent
        visible={editMenuOpen}
        animationType="fade"
        onRequestClose={onCloseEditMenu}
      >
        <View style={styles.root}>
          <BlurView intensity={24} tint="light" style={StyleSheet.absoluteFillObject} />
          <Pressable style={styles.overlay} onPress={onCloseEditMenu} />

          <View style={[styles.menu, { top: menuTop }]} onStartShouldSetResponder={() => true}>
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
        </View>
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
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.26)",
  },
  menu: {
    position: "absolute",
    right: spacing.lg,
    width: 260,
    backgroundColor: colors.surface.primary,
    borderRadius: radius.md + 2,
    paddingVertical: 6,
    ...(shadowStyle({
      boxShadow: "0px 10px 16px rgba(0,0,0,0.12)",
      shadowColor: colors.text.primary,
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    }) as object),
    elevation: 6,
  },
  item: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  itemText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "600",
  },
  dangerText: {
    color: colors.brand.primary,
  },
});

