import React from "react";
import { Text, View } from "react-native";

type CatalogStyles = typeof import("./Catalog.styles").catalogStyles;

type CatalogFooterProps = {
  styles: CatalogStyles;
};

export function CatalogFooter({ styles }: CatalogFooterProps) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerLogo}>INDEP</Text>
      <View style={styles.footerLinks}>
        <Text style={styles.footerLink}>Каталог</Text>
        <Text style={styles.footerLink}>Подбор авто</Text>
        <Text style={styles.footerLink}>Сотрудничество</Text>
        <Text style={styles.footerLink}>О нас</Text>
      </View>
      <Text style={styles.footerCopyright}>Все права защищены. ООО EXAMPLE.</Text>
    </View>
  );
}
