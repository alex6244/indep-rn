import { useRouter, type Href } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AboutIcon from "../../assets/icons/burger/about.svg";
import CooperationIcon from "../../assets/icons/burger/ads.svg";
import FavIcon from "../../assets/icons/burger/favourites.svg";
import LogoutIcon from "../../assets/icons/burger/logout.svg";
import SelectionIcon from "../../assets/icons/burger/selection.svg";
import type { BurgerMenuItem } from "../ui/BurgerMenu";

export function getMainBurgerMenuItems(): BurgerMenuItem[] {
  return [
    {
      key: "favorites",
      label: "Избранное",
      href: "/(tabs)/favorites" as Href,
      Icon: FavIcon,
    },
    {
      key: "selection",
      label: "Подбор авто",
      href: "/selection" as Href,
      Icon: SelectionIcon,
    },
    {
      key: "coop",
      label: "Сотрудничество",
      href: "/cooperation" as Href,
      Icon: CooperationIcon,
    },
    {
      key: "about",
      label: "О нас",
      href: "/about" as Href,
      Icon: AboutIcon,
    },
  ];
}

type FooterProps = {
  onLogout: () => Promise<void>;
};

export function MainBurgerMenuFooter({ onLogout }: FooterProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.footerBtn}
      onPress={async () => {
        await onLogout();
        router.replace("/(auth)" as Href);
      }}
    >
      <View style={styles.footerRow}>
        <LogoutIcon width={22} height={22} />
        <Text style={styles.footerText}>Выйти из аккаунта</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  footerBtn: {
    padding: 16,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
});
