import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EditIcon from "../../assets/icons/edit.svg";

type Props = {
  initials: string;
  name: string;
  phone?: string;
  onOpenEdit: () => void;
};

export function PickerUserCard({ initials, name, phone, onOpenEdit }: Props) {
  return (
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
            <EditIcon width={16} height={16} />
          </TouchableOpacity>
        </View>
        {!!phone && <Text style={styles.profilePhone}>{phone}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
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
    fontSize: 30,
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
    borderWidth: 1,
    borderColor: "#EDEDED",
  },
  profilePhone: {
    marginTop: 4,
    fontSize: 18,
    color: "#A7A7A7",
  },
});
