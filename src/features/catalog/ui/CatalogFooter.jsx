import React from "react";
import { Text, View } from "react-native";

export function CatalogFooter({ styles }) {
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
