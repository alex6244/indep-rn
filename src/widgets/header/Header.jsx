import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../assets/logo.svg";
import FavNavIcon from "../../assets/icons/burger/favourites.svg";
import { useAuth } from "../../contexts/AuthContext";
import { FavoriteButton } from "../../features/favorites/ui/FavoriteButton";
import {
  getMainBurgerMenuItems,
  MainBurgerMenuFooter,
} from "../../shared/config/mainBurgerMenu";
import { BurgerMenu } from "../../shared/ui/BurgerMenu";

/**
 * @param {object} props
 * @param {string | null} [props.title]
 * @param {boolean} [props.showLogo]
 * @param {() => void} [props.onLogoPress]
 * @param {() => void} [props.onOpenBurger] — если задан, BurgerMenu рендерится снаружи, здесь только кнопка
 * @param {'favoriteToggle' | 'favorites' | 'none'} [props.rightAction] — справа: избранное-toggle, переход в избранное, пусто
 */
export const Header = ({
  title = "Каталог",
  showLogo = false,
  onLogoPress,
  onOpenBurger,
  rightAction = "favoriteToggle",
}) => {
  const [burgerOpen, setBurgerOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const router = useRouter();

  const useExternalBurger = typeof onOpenBurger === "function";

  const openBurger = () => {
    if (useExternalBurger) {
      onOpenBurger();
      return;
    }
    setBurgerOpen(true);
  };

  const closeBurger = () => setBurgerOpen(false);

  const showTitle =
    !showLogo && title != null && String(title).length > 0;

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={openBurger} hitSlop={12}>
          <Text style={styles.burger}>≡</Text>
        </TouchableOpacity>

        <View style={styles.center}>
          {showLogo ? (
            <TouchableOpacity
              onPress={onLogoPress}
              disabled={!onLogoPress}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="На главную"
            >
              <Logo width={82} height={22} />
            </TouchableOpacity>
          ) : showTitle ? (
            <Text style={styles.title}>{title}</Text>
          ) : null}
        </View>

        <View style={styles.right}>
          {rightAction === "favoriteToggle" ? (
            <FavoriteButton />
          ) : rightAction === "favorites" ? (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/favorites")}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Открыть избранное"
              style={styles.favNavBtn}
            >
              <FavNavIcon width={22} height={22} />
            </TouchableOpacity>
          ) : (
            <View style={styles.rightSpacer} />
          )}
        </View>
      </View>

      {!useExternalBurger ? (
        <BurgerMenu
          open={burgerOpen}
          onClose={closeBurger}
          items={getMainBurgerMenuItems()}
          footer={<MainBurgerMenuFooter onLogout={logout} />}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  burger: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 44,
    justifyContent: "flex-end",
  },
  favNavBtn: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rightSpacer: {
    width: 44,
    height: 44,
  },
});
