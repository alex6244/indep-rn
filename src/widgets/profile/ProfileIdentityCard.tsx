import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EditIcon from "../../assets/icons/edit.svg";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

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
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg + 2,
    backgroundColor: colors.surface.primary,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.text.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: "700",
  },
  profileMeta: {
    flex: 1,
    marginLeft: spacing.md,
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
    color: colors.text.primary,
    marginRight: 10,
  },
  editIconButton: {
    width: 44,
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  profilePhone: {
    marginTop: 4,
    fontSize: 18,
    color: colors.text.muted,
  },
});
