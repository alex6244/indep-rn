import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FONT_FAMILY } from "../../shared/theme/fonts";
import { colors } from "../../shared/theme/colors";
import { InlineMessage } from "../../shared/ui/InlineMessage";

export function ReportDetailsActions({ reportId }: { reportId: string }) {
  const [notice, setNotice] = React.useState<string | null>(null);

  return (
    <View style={styles.wrap}>
      {notice ? <InlineMessage tone="info" message={notice} /> : null}
      <TouchableOpacity
        style={[styles.btn, styles.btnPrimary]}
        onPress={() => {
          setNotice(`PDF пока недоступен. Отчёт: ${reportId}`);
        }}
      >
        <Text style={styles.btnText}>Открыть отчёт</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnSecondary]}
        onPress={() => {
          setNotice(`PDF пока недоступен. Отчёт: ${reportId}`);
        }}
      >
        <Text style={styles.btnTextSecondary}>Скачать отчёт PDF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  btn: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    backgroundColor: colors.control.buttonPrimaryBg,
  },
  btnSecondary: {
    backgroundColor: colors.control.buttonSecondaryBg,
  },
  btnText: {
    color: colors.control.buttonPrimaryText,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: FONT_FAMILY.regular,
  },
  btnTextSecondary: {
    color: colors.control.buttonSecondaryText,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: FONT_FAMILY.regular,
  },
});

