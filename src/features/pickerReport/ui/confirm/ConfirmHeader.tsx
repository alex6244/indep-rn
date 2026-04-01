import React from "react";
import { Text, View } from "react-native";
import Logo from "../../../../assets/logo.svg";
import { styles } from "./PickerReportConfirmPage.styles";

type Props = {
  topPadding: number;
};

export function ConfirmHeader({ topPadding }: Props) {
  return (
    <>
      <View style={[styles.topBar, { paddingTop: topPadding }]}>
        <Logo width={82} height={22} />
        <View style={{ width: 40 }} />
      </View>
      <Text style={styles.title}>Всё верно?</Text>
      <Text style={styles.subtitle}>
        Пожалуйста, проверьте введенные данные перед отправкой.
      </Text>
    </>
  );
}
