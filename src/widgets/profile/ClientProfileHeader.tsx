import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Logo from "../../assets/logo.svg";

type Props = {
  name: string;
  phone?: string;
  showTitle?: boolean;
  title?: string;
  onOpenBurger: () => void;
  onOpenEdit?: () => void;
};

export function ClientProfileHeader({
  name,
  phone,
  showTitle = false,
  title = "Мои отчёты",
  onOpenBurger,
  onOpenEdit,
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Logo width={82} height={22} />
        {showTitle && <Text style={styles.title}>{title}</Text>}
      </View>
      <TouchableOpacity
        style={styles.burgerButton}
        onPress={onOpenBurger}
        accessibilityRole="button"
      >
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
      </TouchableOpacity>
      {!showTitle && (
        <View style={styles.meta}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {onOpenEdit ? (
              <TouchableOpacity
                onPress={onOpenEdit}
                style={styles.editIconButton}
                accessibilityRole="button"
              >
                <Text style={styles.editIconText}>✎</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {!!phone && <Text style={styles.phone}>{phone}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E1E",
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
  meta: {
    position: "absolute",
    left: 16,
    bottom: -32,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1E1E1E",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  editIconButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  editIconText: {
    color: "#DB4431",
    fontSize: 14,
    fontWeight: "700",
  },
  phone: {
    marginTop: 2,
    fontSize: 12,
    color: "#777",
  },
});

