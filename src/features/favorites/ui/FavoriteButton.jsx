import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import FavOutline from "../../../assets/icons/burger/favourites.svg";
import FavFilled from "../../../assets/icons/favourite.svg";

export const FavoriteButton = ({ initialActive = false, onChange }) => {
  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    setActive(initialActive);
  }, [initialActive]);

  const toggle = () => {
    const next = !active;
    setActive(next);
    onChange?.(next);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggle}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={active ? "Убрать из избранного" : "В избранное"}
    >
      <View style={styles.iconWrap}>
        {active ? (
          <FavFilled width={22} height={22} />
        ) : (
          <FavOutline width={22} height={22} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

