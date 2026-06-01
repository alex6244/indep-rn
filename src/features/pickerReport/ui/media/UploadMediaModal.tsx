import React, { useMemo } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import AddPhotoIllustration from "../../../../assets/addCar/addPhoto.svg";
import AddVideoIllustration from "../../../../assets/addCar/addVideo.svg";
import CloseIcon from "../../../../assets/icons/close.svg";
import { PR_TYPO } from "../pickerReport.styles";
import { shadowStyle } from "../../../../shared/theme/shadow";
import { colors } from "../../../../shared/theme/colors";
import type { UploadModalMediaType } from "./uploadModalsConfig";

const HERO_ASPECT = 134 / 303;

export type UploadMediaModalProps = {
  visible: boolean;
  title: string;
  intro?: string;
  bullets?: string[];
  minFilesText?: string;
  mediaType?: UploadModalMediaType;
  pickLabel?: string;
  cameraLabel?: string;
  closeLabel?: string;
  onPickPress: () => void;
  onCameraPress?: () => void;
  onClose: () => void;
};

export function UploadMediaModal({
  visible,
  title,
  intro,
  bullets = [],
  minFilesText,
  mediaType = "photo",
  pickLabel = "Выбрать файл",
  cameraLabel = "Снять сейчас",
  closeLabel = "Закрыть",
  onPickPress,
  onCameraPress,
  onClose,
}: UploadMediaModalProps) {
  const { width: windowWidth } = useWindowDimensions();

  const heroHeight = useMemo(() => {
    const cardInnerWidth = windowWidth - 16 * 2 - 16 * 2;
    return Math.round(cardInnerWidth * HERO_ASPECT);
  }, [windowWidth]);

  const Illustration = mediaType === "video" ? AddVideoIllustration : AddPhotoIllustration;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={[styles.center, { pointerEvents: "box-none" }]}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Закрыть"
              activeOpacity={0.9}
              style={styles.closeBtn}
              onPress={onClose}
            >
              <CloseIcon width={10} height={10} />
            </TouchableOpacity>
          </View>

          {intro ? <Text style={styles.intro}>{intro}</Text> : null}

          {bullets.length > 0 ? (
            <View style={styles.bulletList}>
              {bullets.map((item) => (
                <Text key={item} style={styles.bullet}>
                  • {item}
                </Text>
              ))}
            </View>
          ) : null}

          {minFilesText ? <Text style={styles.minFiles}>{minFilesText}</Text> : null}

          <View style={[styles.hero, { height: heroHeight }]}>
            <Illustration width="100%" height={heroHeight} preserveAspectRatio="xMidYMid slice" />
          </View>

          <TouchableOpacity activeOpacity={0.9} style={styles.actionBtn} onPress={onPickPress}>
            <Text style={styles.actionBtnText}>{pickLabel}</Text>
          </TouchableOpacity>

          {onCameraPress ? (
            <TouchableOpacity activeOpacity={0.9} style={styles.actionBtn} onPress={onCameraPress}>
              <Text style={styles.actionBtnText}>{cameraLabel}</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity activeOpacity={0.9} style={styles.closeActionBtn} onPress={onClose}>
            <Text style={styles.closeActionBtnText}>{closeLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.backdrop,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.surface.primary,
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    ...(shadowStyle({
      boxShadow: "0px 10px 18px rgba(0,0,0,0.12)",
      shadowColor: colors.overlay.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    }) as object),
    elevation: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingRight: 4,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.overlay.soft,
    marginTop: -2,
    marginLeft: 8,
  },
  title: {
    ...PR_TYPO.modalTitle,
    flex: 1,
    paddingRight: 8,
  },
  intro: {
    ...PR_TYPO.modalBody,
    color: colors.text.primary,
    marginBottom: 6,
  },
  bulletList: {
    marginBottom: 8,
    gap: 2,
  },
  bullet: {
    ...PR_TYPO.modalBody,
    color: colors.text.primary,
  },
  minFiles: {
    ...PR_TYPO.modalBody,
    color: colors.text.primary,
    marginBottom: 12,
  },
  hero: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#D9D9D9",
    marginBottom: 14,
  },
  actionBtn: {
    width: "100%",
    borderRadius: 22,
    height: 44,
    backgroundColor: colors.surface.inverse,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionBtnText: {
    ...PR_TYPO.buttonSmall,
  },
  closeActionBtn: {
    width: "100%",
    borderRadius: 22,
    height: 44,
    backgroundColor: colors.surface.disabled,
    alignItems: "center",
    justifyContent: "center",
  },
  closeActionBtnText: {
    ...PR_TYPO.body,
    color: colors.text.primary,
  },
});
