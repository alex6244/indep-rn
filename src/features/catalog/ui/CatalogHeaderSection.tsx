import React from "react";
import { Text, View } from "react-native";
import { Header } from "../../../widgets/header/Header";

type CatalogStyles = typeof import("./Catalog.styles").catalogStyles;

type CatalogHeaderSectionProps = {
  onLogoPress: () => void;
  onOpenBurger: () => void;
  styles: CatalogStyles;
};

export function CatalogHeaderSection({ onLogoPress, onOpenBurger, styles }: CatalogHeaderSectionProps) {
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
