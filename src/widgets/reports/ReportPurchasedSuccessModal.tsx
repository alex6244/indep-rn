import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CloseIcon from "../../assets/icons/close.svg";
import SuccessIllustration from "../../assets/mainpage/result/2.svg";
import { shadowStyle } from "../../shared/theme/shadow";
import { colors } from "../../shared/theme/colors";
import { spacing } from "../../shared/theme/spacing";

const pickReportWord = (count: number) => {
  // Упрощенная склонялка для RU:
  // 1 -> "отчет", 2-4 -> "отчета", остальные -> "отчетов"
  const n = Math.abs(count);
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) return "отчет";
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return "отчета";
  return "отчетов";
};

type Props = {
  visible: boolean;
  spentCount: number;
  remainingCount: number;
  onClose: () => void;
};

export function ReportPurchasedSuccessModal({
  visible,
  spentCount,
  remainingCount,
  onClose,
}: Props) {
  const spentWord = pickReportWord(spentCount);

  const remainingText =
    remainingCount >= 0
      ? `В пакете осталось ${remainingCount} ${pickReportWord(remainingCount)}.`
      : "";

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.9}>
            <CloseIcon width={10} height={10} />
          </TouchableOpacity>

          <Text style={styles.title}>Готово!</Text>

          <Text style={styles.text}>
            С вашего пакета был успешно списан {spentCount} {spentWord}.
          </Text>
          <Text style={styles.text}>
            Отчет уже доступен для просмотра и скачивания в личном кабинете.
          </Text>

          {remainingText ? <Text style={styles.text}>{remainingText}</Text> : null}

          <View style={styles.illustrationWrap}>
            <SuccessIllustration width="100%" height="100%" />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay.backdrop,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surface.primary,
    borderRadius: 20,
    padding: 20,
    ...(shadowStyle({
      // Shadow raw values are kept intentionally for platform-specific shadow rendering.
      boxShadow: "0px 10px 16px rgba(0,0,0,0.12)",
      shadowColor: colors.text.primary,
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    }) as object),
    elevation: 8,
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 44,
    minHeight: 44,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text.primary,
    marginBottom: 10,
  },
  text: {
    color: colors.text.tertiary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  illustrationWrap: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 220,
  },
});

