import React from "react";
import { View } from "react-native";
import Logo from "../../../../assets/logo.svg";

import { styles } from "./PickerReportCreatePage.styles";

type Props = {
  topPadding: number;
};

export function CreateHeader({ topPadding }: Props) {
  return (
    <View style={[styles.topBar, { paddingTop: topPadding }]}>
      <Logo width={82} height={22} />
      <View style={{ width: 40 }} />
    </View>
  );
}

