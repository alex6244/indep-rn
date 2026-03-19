import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Logo from "../../assets/logo.svg";

type Props = {
  name: string;
  phone?: string;
  showTitle?: boolean;
  title?: string;
  onOpenBurger: () => void;
};

export function ClientProfileHeader({
  name,
  phone,
  showTitle = false,
  title = "Мои отчёты",
  onOpenBurger,
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
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
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
    fontSize: 16,
    fontWeight: "700",
    color: "#1E1E1E",
  },
  phone: {
    marginTop: 2,
    fontSize: 12,
    color: "#777",
  },
});

