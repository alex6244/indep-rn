import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Logo from "../../assets/logo.svg";

type Props = {
  initials: string;
  name: string;
  phone?: string;
  onOpenEdit: () => void;
  onOpenBurger: () => void;
};

export function PickerProfileHeader({
  initials,
  name,
  phone,
  onOpenEdit,
  onOpenBurger,
}: Props) {
  return (
    <>
      <View style={styles.pickerHeader}>
        <Logo width={110} height={28} />
        <TouchableOpacity
          style={styles.burgerButton}
          onPress={onOpenBurger}
          accessibilityRole="button"
        >
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileTop}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>

        <View style={styles.profileMeta}>
          <View style={styles.nameRow}>
            <Text style={styles.profileName} numberOfLines={1}>
              {name}
            </Text>
            <TouchableOpacity
              onPress={onOpenEdit}
              style={styles.editIconButton}
              accessibilityRole="button"
            >
              <Text style={styles.editIconText}>✎</Text>
            </TouchableOpacity>
          </View>
          {!!phone && <Text style={styles.profilePhone}>{phone}</Text>}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pickerHeader: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  burgerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  burgerLine: {
    width: 22,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#DB4431",
    marginVertical: 2,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  profileMeta: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E1E",
    marginRight: 10,
  },
  editIconButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  editIconText: {
    color: "#DB4431",
    fontSize: 16,
    fontWeight: "700",
  },
  profilePhone: {
    marginTop: 4,
    fontSize: 12,
    color: "#777",
  },
});
