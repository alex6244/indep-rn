import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FavouriteBanner from "../../assets/profile/favouritebanner.svg";
import BestIcon from "../../assets/profile/best.svg";

type Props = {
  onOpenFavorites: () => void;
  onOpenBest: () => void;
  variant?: "picker" | "client";
};

export function ProfileQuickActions({
  onOpenFavorites,
  onOpenBest,
  variant = "client",
}: Props) {
  return (
    <View style={styles.quickRow}>
      <TouchableOpacity style={styles.card} onPress={onOpenFavorites}>
        <FavouriteBanner style={StyleSheet.absoluteFillObject} width="100%" height="100%" />
        <View style={styles.content}>
          <Text style={styles.text}>Избранное</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={onOpenBest}>
        <View style={styles.content}>
          <Text style={styles.text}>Лучшие предложения на авто</Text>
          {variant === "client" ? <BestIcon width={58} height={24} /> : null}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  quickRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginHorizontal: 16,
  },
  card: {
    flex: 1,
    height: 62,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 12,
    zIndex: 1,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: "#989898",
    fontWeight: "600",
  },
});

