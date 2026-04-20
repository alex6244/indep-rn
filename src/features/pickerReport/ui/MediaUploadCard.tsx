import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import PhotosBg from "../../../assets/addCar/photosBG.svg";
import AddPhotoIcon from "../../../assets/addCar/addPhoto.svg";
import AddVideoIcon from "../../../assets/addCar/addVideo.svg";
import { FONT_FAMILY } from "../../../shared/theme/fonts";
import { InlineMessage } from "../../../shared/ui/InlineMessage";
import { UploadMediaModal } from "./media/UploadMediaModal";
import {
  getUploadModalConfig,
  type UploadMediaKind,
} from "./media/uploadModalsConfig";

type MediaKey = "salonPhoto" | "bodyPhoto" | "salonVideo" | "bodyVideo";

export type MediaUploadState = Record<MediaKey, boolean>;

type Row = {
  key: MediaKey;
  modalKind: UploadMediaKind;
  label: string;
  icon: React.ReactNode;
  successColor: string;
  failColor: string;
};

type Props = {
  value: MediaUploadState;
  onChange: (next: MediaUploadState) => void;
};

export function MediaUploadCard({ value, onChange }: Props) {
  const [activeModalKind, setActiveModalKind] = useState<UploadMediaKind | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const rows: Row[] = [
    {
      key: "salonPhoto",
      modalKind: "salon_photo",
      label: "Фото салона",
      icon: <AddPhotoIcon width={16} height={16} />,
      successColor: "#43C356",
      failColor: "#DB4431",
    },
    {
      key: "bodyPhoto",
      modalKind: "body_photo",
      label: "Фото кузова",
      icon: <AddPhotoIcon width={16} height={16} />,
      successColor: "#43C356",
      failColor: "#43C356",
    },
    {
      key: "salonVideo",
      modalKind: "salon_video",
      label: "Видео салона",
      icon: <AddVideoIcon width={16} height={16} />,
      successColor: "#43C356",
      failColor: "#DB4431",
    },
    {
      key: "bodyVideo",
      modalKind: "body_video",
      label: "Видео кузова",
      icon: <AddVideoIcon width={16} height={16} />,
      successColor: "#43C356",
      failColor: "#DB4431",
    },
  ];

  const activeRow = rows.find((row) => row.modalKind === activeModalKind);
  const isModalVisible = activeModalKind !== null;
  const modalConfig = activeModalKind ? getUploadModalConfig(activeModalKind) : null;

  const closeModal = () => setActiveModalKind(null);

  const handlePickPress = () => {
    if (activeRow) {
      onChange({ ...value, [activeRow.key]: true });
    }
    closeModal();
    setNotice("Подключим выбор фото и видео в следующем обновлении.");
  };

  return (
    <View style={styles.section}>
      <View style={[styles.illustrationWrap, { pointerEvents: "none" }]}>
        <PhotosBg width="100%" height="100%" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Добавьте фото авто</Text>
        {notice ? <InlineMessage tone="info" message={notice} /> : null}

        <View style={styles.rows}>
          {rows.map((r) => {
            const added = value[r.key];
            const bg = added ? r.successColor : r.failColor;
            const text = added ? "Добавлено" : "Добавить";

            return (
              <View key={r.key} style={styles.row}>
                <Text style={styles.rowLabel}>{r.label}</Text>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.btn, { backgroundColor: bg }]}
                  onPress={() => setActiveModalKind(r.modalKind)}
                >
                  <View style={styles.btnInner}>
                    {r.icon}
                    <Text style={styles.btnText}>{text}</Text>
                  </View>
                </TouchableOpacity>
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
        icon={
          activeRow ? (
            <View style={styles.modalIconWrap}>
              {activeRow.icon}
            </View>
          ) : undefined
        }
        onPickPress={handlePickPress}
        onClose={closeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#F1F1F1",
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingTop: 8,
    overflow: "hidden",
  },
  illustrationWrap: {
    height: 160,
    marginHorizontal: 8,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1E1E1E",
  },
  rows: {},
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rowLabel: {
    fontSize: 14,
    color: "#1E1E1E",
    width: 150,
  },
  btn: {
    minWidth: 132,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FONT_FAMILY.button,
  },
  modalIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});

