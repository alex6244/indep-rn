import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import PhotosBg from "../../../assets/addCar/photosBG.svg";
import AddPhotoIcon from "../../../assets/addCar/addPhoto.svg";
import AddVideoIcon from "../../../assets/addCar/addVideo.svg";

type MediaKey = "salonPhoto" | "bodyPhoto" | "salonVideo" | "bodyVideo";

export type MediaUploadState = Record<MediaKey, boolean>;

type Row = {
  key: MediaKey;
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
  const rows: Row[] = [
    {
      key: "salonPhoto",
      label: "Фото салона",
      icon: <AddPhotoIcon width={16} height={16} />,
      successColor: "#43C356",
      failColor: "#DB4431",
    },
    {
      key: "bodyPhoto",
      label: "Фото кузова",
      icon: <AddPhotoIcon width={16} height={16} />,
      successColor: "#43C356",
      failColor: "#43C356",
    },
    {
      key: "salonVideo",
      label: "Видео салона",
      icon: <AddVideoIcon width={16} height={16} />,
      successColor: "#43C356",
      failColor: "#DB4431",
    },
    {
      key: "bodyVideo",
      label: "Видео кузова",
      icon: <AddVideoIcon width={16} height={16} />,
      successColor: "#43C356",
      failColor: "#DB4431",
    },
  ];

  const setAdded = (key: MediaKey) => {
    onChange({ ...value, [key]: !value[key] });
  };

  return (
    <View style={styles.section}>
      <View style={styles.bgWrap} pointerEvents="none">
        <PhotosBg
          style={StyleSheet.absoluteFillObject}
          width="100%"
          height="100%"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Добавьте фото авто</Text>

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
                  onPress={() => setAdded(r.key)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingTop: 12,
  },
  bgWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 14,
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
  },
});

