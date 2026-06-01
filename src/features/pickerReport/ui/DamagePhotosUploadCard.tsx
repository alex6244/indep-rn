import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

import PhotosBg from "../../../assets/addCar/photosBG.svg";
import { PR_TYPO } from "./pickerReport.styles";
import { colors } from "../../../shared/theme/colors";
import { InlineMessage } from "../../../shared/ui/InlineMessage";
import { UploadMediaModal } from "./media/UploadMediaModal";
import { DAMAGE_PHOTO_MODAL_CONFIG } from "./media/uploadModalsConfig";
import type { DamageDraft } from "../../../types/draftReport";

type Props = {
  damages: DamageDraft[];
  onPhotoChange: (damageId: string, uri: string | null) => void;
};

const PHOTOS_BG_WIDTH = 335;
const PHOTOS_BG_HEIGHT = 295;
const CARD_MARGIN_H = 0;
const CARD_PADDING_H = 16;
const CONTENT_TOP_RATIO = 0.53;
const ROW_BLOCK_ESTIMATE = 56;

export function DamagePhotosUploadCard({ damages, onPhotoChange }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const [activeDamageId, setActiveDamageId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const illustrationHeight = useMemo(() => {
    const cardWidth = windowWidth - 16 * 2 - 16 * 2;
    return Math.round(cardWidth * (PHOTOS_BG_HEIGHT / PHOTOS_BG_WIDTH));
  }, [windowWidth]);

  const contentTop = useMemo(
    () => Math.round(illustrationHeight * CONTENT_TOP_RATIO),
    [illustrationHeight],
  );

  const rowBlockEstimate = useMemo(
    () => Math.max(ROW_BLOCK_ESTIMATE, damages.length * 52 + 40),
    [damages.length],
  );

  const sectionMinHeight = useMemo(
    () => Math.max(illustrationHeight, contentTop + rowBlockEstimate),
    [contentTop, illustrationHeight, rowBlockEstimate],
  );

  const activeDamage = useMemo(
    () => damages.find((d) => d.id === activeDamageId),
    [activeDamageId, damages],
  );

  const isModalVisible = activeDamageId !== null;
  const closeModal = useCallback(() => setActiveDamageId(null), []);

  const handlePickPress = useCallback(async () => {
    if (!activeDamage) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      closeModal();
      setNotice("Разрешите доступ к галерее в настройках");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    closeModal();

    if (!result.canceled) {
      onPhotoChange(activeDamage.id, result.assets[0].uri);
    }
  }, [activeDamage, closeModal, onPhotoChange]);

  const handleCameraPress = useCallback(async () => {
    if (!activeDamage) return;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      closeModal();
      setNotice("Разрешите доступ к камере в настройках");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    closeModal();

    if (!result.canceled) {
      onPhotoChange(activeDamage.id, result.assets[0].uri);
    }
  }, [activeDamage, closeModal, onPhotoChange]);

  const handleOpenModal = useCallback((damageId: string) => {
    setNotice(null);
    setActiveDamageId(damageId);
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
          <Text style={styles.title}>Добавьте фото повреждений</Text>

          {notice ? <InlineMessage tone="info" message={notice} /> : null}

          {damages.map((damage, index) => {
            const uri = damage.photoUri ?? null;
            const added = uri !== null;
            const bg = added ? colors.status.successStrong : colors.brand.primary;
            const text = added ? "Добавлено" : "Добавить";
            const label = damage.description.trim()
              ? damage.description.trim()
              : `Повреждение ${index + 1}`;

            return (
              <View key={damage.id} style={styles.row}>
                <Text style={styles.rowLabel} numberOfLines={2}>
                  {label}
                </Text>
                <View style={styles.rowRight}>
                  {uri ? (
                    <Image source={{ uri }} style={styles.preview} contentFit="cover" />
                  ) : null}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.btn, { backgroundColor: bg }]}
                    onPress={() => handleOpenModal(damage.id)}
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
        visible={isModalVisible}
        title={DAMAGE_PHOTO_MODAL_CONFIG.title}
        intro={DAMAGE_PHOTO_MODAL_CONFIG.intro}
        bullets={DAMAGE_PHOTO_MODAL_CONFIG.bullets}
        minFilesText={DAMAGE_PHOTO_MODAL_CONFIG.minFilesText}
        mediaType={DAMAGE_PHOTO_MODAL_CONFIG.mediaType}
        pickLabel={DAMAGE_PHOTO_MODAL_CONFIG.pickLabel}
        closeLabel={DAMAGE_PHOTO_MODAL_CONFIG.closeLabel}
        onPickPress={handlePickPress}
        onCameraPress={handleCameraPress}
        onClose={closeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 14,
    overflow: "hidden",
    marginHorizontal: CARD_MARGIN_H,
  },
  cardInner: {
    position: "relative",
    paddingBottom: 16,
    backgroundColor: colors.surface.neutral,
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
