import React, { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

import PhotosBg from "../../../assets/addCar/photosBG.svg";
import type { MediaKey, MediaUploadState } from "../../../types/draftReport";
import type { RequiredMediaKey } from "../../../shared/validation/mediaValidation";
import { PR_TYPO } from "./pickerReport.styles";
import { colors } from "../../../shared/theme/colors";
import { InlineMessage } from "../../../shared/ui/InlineMessage";
import { MediaPreviewModal } from "./media/MediaPreviewModal";
import { UploadMediaModal } from "./media/UploadMediaModal";
import {
  getUploadModalConfig,
  type UploadMediaKind,
} from "./media/uploadModalsConfig";

export type { MediaUploadState };

type Row = {
  key: MediaKey;
  modalKind: UploadMediaKind;
  label: string;
  required: boolean;
};

type Props = {
  value: MediaUploadState;
  onChange: (next: MediaUploadState) => void;
  highlightKeys?: RequiredMediaKey[];
};

const VIDEO_KINDS: UploadMediaKind[] = ["salon_video", "body_video"];

/** Figma `photosBG.svg` viewBox. */
const PHOTOS_BG_WIDTH = 335;
const PHOTOS_BG_HEIGHT = 295;
const CARD_MARGIN_H = 16;
const CARD_PADDING_H = 16;
const CONTENT_TOP_RATIO = 0.53;
const ROW_BLOCK_ESTIMATE = 230;

const MEDIA_ROWS: Row[] = [
  { key: "bodyPhoto", modalKind: "body_photo", label: "Фото кузова", required: true },
  { key: "salonPhoto", modalKind: "salon_photo", label: "Фото салона", required: true },
  { key: "salonVideo", modalKind: "salon_video", label: "Видео салона", required: false },
  { key: "bodyVideo", modalKind: "body_video", label: "Видео кузова", required: false },
];

export function MediaUploadCard({ value, onChange, highlightKeys = [] }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const [activeModalKind, setActiveModalKind] = useState<UploadMediaKind | null>(null);
  const [preview, setPreview] = useState<{ uris: string[]; mediaType: "photo" | "video" } | null>(
    null,
  );
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

  const activeRow = useMemo(
    () => MEDIA_ROWS.find((row) => row.modalKind === activeModalKind),
    [activeModalKind],
  );
  const isModalVisible = activeModalKind !== null;
  const modalConfig = activeModalKind ? getUploadModalConfig(activeModalKind) : null;

  const closeModal = useCallback(() => setActiveModalKind(null), []);

  const isVideoKind = activeModalKind !== null && VIDEO_KINDS.includes(activeModalKind);

  const appendUris = useCallback(
    (key: MediaKey, uris: string[]) => {
      if (uris.length === 0) return;
      const existing = value[key];
      const merged = [...existing, ...uris.filter((uri) => !existing.includes(uri))];
      onChange({ ...value, [key]: merged });
    },
    [onChange, value],
  );

  const handlePickPress = useCallback(async () => {
    if (!activeRow) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      closeModal();
      setNotice("Разрешите доступ к галерее в настройках");
      return;
    }

    const options: ImagePicker.ImagePickerOptions = isVideoKind
      ? {
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          videoMaxDuration: 60,
          allowsMultipleSelection: true,
        }
      : {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsEditing: false,
          allowsMultipleSelection: true,
        };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    closeModal();

    if (!result.canceled) {
      appendUris(
        activeRow.key,
        result.assets.map((asset) => asset.uri),
      );
    }
  }, [activeRow, appendUris, closeModal, isVideoKind]);

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

    if (!result.canceled && result.assets[0]?.uri) {
      appendUris(activeRow.key, [result.assets[0].uri]);
    }
  }, [activeRow, appendUris, closeModal, isVideoKind]);

  const handleOpenModal = useCallback((kind: UploadMediaKind) => {
    setNotice(null);
    setActiveModalKind(kind);
  }, []);

  const handleOpenPreview = useCallback(
    (row: Row) => {
      const uris = value[row.key];
      if (uris.length === 0) return;
      const config = getUploadModalConfig(row.modalKind);
      setPreview({ uris, mediaType: config.mediaType });
    },
    [value],
  );

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

          {MEDIA_ROWS.map((r) => {
            const uris = value[r.key];
            const config = getUploadModalConfig(r.modalKind);
            const added = uris.length >= config.minFiles;
            const bg = added ? colors.status.successStrong : colors.brand.primary;
            const text = added ? "Добавлено" : "Добавить";
            const isHighlighted = highlightKeys.includes(r.key as RequiredMediaKey);
            const previewUri = uris[0];
            const countLabel =
              uris.length > 0 ? `${uris.length}/${config.minFiles}` : null;

            return (
              <View
                key={r.key}
                style={[styles.row, isHighlighted ? styles.rowHighlighted : null]}
              >
                <Text
                  style={[styles.rowLabel, isHighlighted ? styles.rowLabelHighlighted : null]}
                >
                  {r.label}
                  {r.required ? <Text style={styles.requiredMark}> *</Text> : null}
                </Text>
                <View style={styles.rowRight}>
                  {countLabel ? <Text style={styles.countLabel}>{countLabel}</Text> : null}
                  {previewUri ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Просмотр: ${r.label}`}
                      onPress={() => handleOpenPreview(r)}
                    >
                      <Image
                        source={{ uri: previewUri }}
                        style={styles.preview}
                        contentFit="cover"
                      />
                    </Pressable>
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
        intro={modalConfig?.intro}
        bullets={modalConfig?.bullets}
        minFilesText={modalConfig?.minFilesText}
        mediaType={modalConfig?.mediaType}
        pickLabel={modalConfig?.pickLabel}
        closeLabel={modalConfig?.closeLabel}
        onPickPress={handlePickPress}
        onCameraPress={handleCameraPress}
        onClose={closeModal}
      />

      <MediaPreviewModal
        visible={preview !== null}
        uris={preview?.uris ?? []}
        mediaType={preview?.mediaType}
        onClose={() => setPreview(null)}
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
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  rowHighlighted: {
    borderWidth: 1,
    borderColor: colors.brand.primary,
    backgroundColor: colors.status.warningMutedBg,
  },
  rowLabel: {
    ...PR_TYPO.body,
    flex: 1,
    marginRight: 8,
  },
  rowLabelHighlighted: {
    color: colors.text.warning,
  },
  requiredMark: {
    color: colors.brand.primary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  countLabel: {
    ...PR_TYPO.caption,
    color: colors.text.muted,
    minWidth: 36,
    textAlign: "right",
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
