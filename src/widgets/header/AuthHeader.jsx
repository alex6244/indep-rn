import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {
  getMainBurgerMenuItems,
  MainBurgerMenuFooter,
} from "../../shared/config/mainBurgerMenu";
import { BurgerButton } from "../../shared/ui/BurgerButton";
import { BurgerMenu } from "../../shared/ui/BurgerMenu";

/** Шапка auth-экранов: бургер открывает то же меню, что в приложении; «Выйти» только для залогиненного пользователя. */
export function AuthHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logoImage}
          />
        </View>
        <BurgerButton
          onPress={() => setMenuOpen(true)}
          hitSlop={12}
          accessibilityLabel="Открыть меню"
        />
      </View>
      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={getMainBurgerMenuItems()}
        footer={
          user ? <MainBurgerMenuFooter onLogout={logout} /> : undefined
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 120,
    height: 24,
    resizeMode: "contain",
  },
});
