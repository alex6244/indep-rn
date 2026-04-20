import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EditIcon from "../../assets/icons/edit.svg";

type Props = {
  name: string;
  phone?: string;
  initials?: string;
  onOpenEdit?: () => void;
};

export function ProfileIdentityCard({ name, phone, initials, onOpenEdit }: Props) {
  const displayInitials = resolveInitials(name, initials);

  return (
    <View style={styles.profileTop}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarInitials}>{displayInitials}</Text>
      </View>

      <View style={styles.profileMeta}>
        <View style={styles.nameRow}>
          <Text style={styles.profileName} numberOfLines={1}>
            {name}
          </Text>
          {onOpenEdit ? (
            <TouchableOpacity
              onPress={onOpenEdit}
              style={styles.editIconButton}
              accessibilityRole="button"
              accessibilityLabel="Редактировать профиль"
            >
              <EditIcon width={16} height={16} />
            </TouchableOpacity>
          ) : null}
        </View>
        {!!phone && <Text style={styles.profilePhone}>{phone}</Text>}
      </View>
    </View>
  );
}

function resolveInitials(name: string, initials?: string): string {
  const fromProps = initials?.trim();
  if (fromProps) {
    return fromProps.toUpperCase();
  }

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) {
    return "??";
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
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
