import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

import PhotosBg from "../../../assets/addCar/photosBG.svg";
import { PR_TYPO } from "./pickerReport.styles";
import { colors } from "../../../shared/theme/colors";
import { InlineMessage } from "../../../shared/ui/InlineMessage";
import { UploadMediaModal } from "./media/UploadMediaModal";
import {
  getUploadModalConfig,
  type UploadMediaKind,
} from "./media/uploadModalsConfig";

type MediaKey = "salonPhoto" | "bodyPhoto" | "salonVideo" | "bodyVideo";

export type MediaUploadState = Record<MediaKey, string | null>;

type Row = {
  key: MediaKey;
  modalKind: UploadMediaKind;
  label: string;
};

type Props = {
  value: MediaUploadState;
  onChange: (next: MediaUploadState) => void;
};

const VIDEO_KINDS: UploadMediaKind[] = ["salon_video", "body_video"];

/** Figma `photosBG.svg` viewBox. */
const PHOTOS_BG_WIDTH = 335;
const PHOTOS_BG_HEIGHT = 295;
const CARD_MARGIN_H = 16;
const CARD_PADDING_H = 16;
/**
 * Y-offset for title + rows — lower rays of the burst in `photosBG.svg`
 * (viewBox y ≈ 155–200 of 295).
 */
const CONTENT_TOP_RATIO = 0.53;
const ROW_BLOCK_ESTIMATE = 230;

export function MediaUploadCard({ value, onChange }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const [activeModalKind, setActiveModalKind] = useState<UploadMediaKind | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const illustrationHeight = useMemo(() => {
    const cardWidth = windowWidth - CARD_MARGIN_H * 2;
    return Math.round(cardWidth * (PHOTOS_BG_HEIGHT / PHOTOS_BG_WIDTH));
  }, [windowWidth]);

  const contentTop = useMemo(
    () => Math.round(illustrationHeight * CONTENT_TOP_RATIO),
    [illustrationHeight],
  );

  const sectionMinHeight = useMemo(
    () => Math.max(illustrationHeight, contentTop + ROW_BLOCK_ESTIMATE),
    [contentTop, illustrationHeight],
  );

  const rows: Row[] = useMemo(
    () => [
      { key: "salonPhoto", modalKind: "salon_photo", label: "Фото салона" },
      { key: "bodyPhoto", modalKind: "body_photo", label: "Фото кузова" },
      { key: "salonVideo", modalKind: "salon_video", label: "Видео салона" },
      { key: "bodyVideo", modalKind: "body_video", label: "Видео кузова" },
    ],
    [],
  );

  const activeRow = useMemo(
    () => rows.find((row) => row.modalKind === activeModalKind),
    [activeModalKind, rows],
  );
  const isModalVisible = activeModalKind !== null;
  const modalConfig = activeModalKind ? getUploadModalConfig(activeModalKind) : null;

  const closeModal = useCallback(() => setActiveModalKind(null), []);

  const isVideoKind = activeModalKind !== null && VIDEO_KINDS.includes(activeModalKind);

  const handlePickPress = useCallback(async () => {
    if (!activeRow) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      closeModal();
      setNotice("Разрешите доступ к галерее в настройках");
      return;
    }

    const options: ImagePicker.ImagePickerOptions = isVideoKind
      ? { mediaTypes: ImagePicker.MediaTypeOptions.Videos, videoMaxDuration: 60 }
      : { mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: false };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    closeModal();

    if (!result.canceled) {
      onChange({ ...value, [activeRow.key]: result.assets[0].uri });
    }
  }, [activeRow, closeModal, isVideoKind, onChange, value]);

  const handleCameraPress = useCallback(async () => {
    if (!activeRow) return;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      closeModal();
      setNotice("Разрешите доступ к камере в настройках");
      return;
    }

    const options: ImagePicker.ImagePickerOptions = isVideoKind
      ? { mediaTypes: ImagePicker.MediaTypeOptions.Videos, videoMaxDuration: 60 }
      : { mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 };

    const result = await ImagePicker.launchCameraAsync(options);

    closeModal();

    if (!result.canceled) {
      onChange({ ...value, [activeRow.key]: result.assets[0].uri });
    }
  }, [activeRow, closeModal, isVideoKind, onChange, value]);

  const handleOpenModal = useCallback((kind: UploadMediaKind) => {
    setNotice(null);
    setActiveModalKind(kind);
  }, []);

  return (
    <View style={styles.section}>
      <View style={[styles.cardInner, { minHeight: sectionMinHeight }]}>
        <View style={[styles.heroLayer, { height: illustrationHeight }]}>
          <PhotosBg
            width="100%"
            height={illustrationHeight}
            preserveAspectRatio="xMidYMid meet"
          />
        </View>

        <View style={[styles.contentLayer, { top: contentTop }]}>
          <Text style={styles.title}>Добавьте фото авто</Text>

          {notice ? <InlineMessage tone="info" message={notice} /> : null}

          {rows.map((r) => {
            const uri = value[r.key];
            const added = uri !== null;
            const bg = added ? colors.status.successStrong : colors.brand.primary;
            const text = added ? "Добавлено" : "Добавить";

            return (
              <View key={r.key} style={styles.row}>
                <Text style={styles.rowLabel}>{r.label}</Text>
                <View style={styles.rowRight}>
                  {uri ? (
                    <Image
                      source={{ uri }}
                      style={styles.preview}
                      contentFit="cover"
                    />
                  ) : null}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.btn, { backgroundColor: bg }]}
                    onPress={() => handleOpenModal(r.modalKind)}
                  >
                    <Text style={styles.btnText}>{text}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <UploadMediaModal
        visible={isModalVisible && Boolean(modalConfig)}
        title={modalConfig?.title ?? ""}
        subtitle={modalConfig?.subtitle}
        primaryActionLabel={modalConfig?.primaryActionLabel}
        secondaryActionLabel={modalConfig?.secondaryActionLabel}
        onPickPress={handlePickPress}
        onCameraPress={handleCameraPress}
        onClose={closeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.surface.card,
    borderRadius: 18,
    marginHorizontal: CARD_MARGIN_H,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardInner: {
    position: "relative",
    paddingBottom: 16,
    backgroundColor: colors.surface.card,
  },
  heroLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  contentLayer: {
    position: "absolute",
    left: CARD_PADDING_H,
    right: CARD_PADDING_H,
    zIndex: 2,
  },
  title: {
    ...PR_TYPO.sectionTitle,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  rowLabel: {
    ...PR_TYPO.body,
    flex: 1,
    marginRight: 8,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  preview: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  btn: {
    minWidth: 124,
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    ...PR_TYPO.buttonSmall,
    color: colors.text.inverse,
  },
});
