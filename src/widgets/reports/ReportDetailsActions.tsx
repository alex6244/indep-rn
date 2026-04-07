import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FONT_FAMILY } from "../../shared/theme/fonts";
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
    backgroundColor: "#DB4431",
  },
  btnSecondary: {
    backgroundColor: "#F3F3F3",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: FONT_FAMILY.button,
  },
  btnTextSecondary: {
    color: "#1E1E1E",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: FONT_FAMILY.button,
  },
});

