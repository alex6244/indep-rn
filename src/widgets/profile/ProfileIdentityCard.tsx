import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import EditIcon from "../../assets/icons/edit.svg";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";
import { figmaText } from "../../shared/theme/typography";

const defaultAvatar = require("../../assets/profile/avatar.jpg");

type Props = {
  name: string;
  phone?: string;
  initials?: string;
  avatarUri?: string | null;
  onOpenEdit?: () => void;
};

export function ProfileIdentityCard({
  name,
  phone,
  avatarUri,
  onOpenEdit,
}: Props) {
  return (
    <View style={styles.profileTop}>
      {onOpenEdit ? (
        <TouchableOpacity
          onPress={onOpenEdit}
          style={styles.editAnchor}
          accessibilityRole="button"
          accessibilityLabel="Редактировать профиль"
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <EditIcon width={18} height={18} />
        </TouchableOpacity>
      ) : null}

      <Image
        source={avatarUri ? { uri: avatarUri } : defaultAvatar}
        style={styles.avatarImage}
        contentFit="cover"
        accessibilityLabel="Фото профиля"
      />

      <View style={styles.profileMeta}>
        <Text style={styles.profileName} numberOfLines={2}>
          {name}
        </Text>
        {!!phone ? <Text style={styles.profilePhone}>{phone}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileTop: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md + 4,
    paddingBottom: spacing.md,
    borderRadius: radius.lg + 2,
    backgroundColor: colors.surface.primary,
  },
  editAnchor: {
    position: "absolute",
    top: spacing.sm + 2,
    right: spacing.sm + 2,
    zIndex: 2,
    padding: 4,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface.placeholder,
  },
  profileMeta: {
    flex: 1,
    marginLeft: spacing.md,
    paddingRight: 28,
  },
  profileName: {
    ...figmaText.bodyLargeMedium,
    color: colors.text.primary,
  },
  profilePhone: {
    marginTop: 4,
    ...figmaText.body,
    color: colors.text.muted,
  },
});
