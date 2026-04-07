import React from "react";
import { Text, View } from "react-native";
import { Header } from "../../../widgets/header/Header";

export function CatalogHeaderSection({ onLogoPress, onOpenBurger, styles }) {
  return (
    <>
      <Header
        title={null}
        showLogo
        onLogoPress={onLogoPress}
        onOpenBurger={onOpenBurger}
        rightAction="favorites"
      />
      <View style={styles.breadcrumbs}>
        <Text style={styles.breadcrumbText}>Главная {">"} Каталог</Text>
      </View>
    </>
  );
}

