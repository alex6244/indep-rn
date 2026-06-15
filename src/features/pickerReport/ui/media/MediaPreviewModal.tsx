import React, { useCallback, useMemo, useState } from "react";
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as Linking from "expo-linking";

import CloseIcon from "../../../../assets/icons/close.svg";
import { colors } from "../../../../shared/theme/colors";
import { PR_TYPO } from "../pickerReport.styles";
import type { UploadModalMediaType } from "./uploadModalsConfig";

export type MediaPreviewModalProps = {
  visible: boolean;
  uris: string[];
  mediaType?: UploadModalMediaType;
  onClose: () => void;
};

export function MediaPreviewModal({
  visible,
  uris,
  mediaType = "photo",
  onClose,
}: MediaPreviewModalProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const pageWidth = windowWidth;

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
      setIndex(Math.max(0, Math.min(nextIndex, uris.length - 1)));
    },
    [pageWidth, uris.length],
  );

  const counterText = useMemo(() => {
    if (uris.length <= 1) return null;
    return `${index + 1} / ${uris.length}`;
  }, [index, uris.length]);

  const openCurrentVideo = useCallback(async () => {
    const uri = uris[index];
    if (!uri) return;
    try {
      await Linking.openURL(uri);
    } catch {
      // noop — device may not resolve local file URIs
    }
  }, [index, uris]);

  if (!visible || uris.length === 0) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <View style={styles.header}>
          {counterText ? <Text style={styles.counter}>{counterText}</Text> : <View />}
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

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          contentContainerStyle={styles.scrollContent}
        >
          {uris.map((uri) => (
            <View key={uri} style={[styles.page, { width: pageWidth, height: windowHeight * 0.72 }]}>
              {mediaType === "photo" ? (
                <Image source={{ uri }} style={styles.image} contentFit="contain" />
              ) : (
                <Pressable style={styles.videoPlaceholder} onPress={() => void openCurrentVideo()}>
                  <Text style={styles.videoPlaceholderText}>Открыть видео</Text>
                  <Text style={styles.videoUri} numberOfLines={2}>
                    {uri.split("/").pop()}
                  </Text>
                </Pressable>
              )}
            </View>
          ))}
        </ScrollView>

        <Pressable style={styles.footerTap} onPress={onClose}>
          <Text style={styles.footerHint}>Нажмите, чтобы закрыть</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  counter: {
    ...PR_TYPO.body,
    color: colors.text.inverse,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.overlay.soft,
  },
  scrollContent: {
    alignItems: "center",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  videoPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  videoPlaceholderText: {
    ...PR_TYPO.sectionTitle,
    color: colors.text.inverse,
    marginBottom: 8,
  },
  videoUri: {
    ...PR_TYPO.body,
    color: colors.text.inverse,
    opacity: 0.8,
    textAlign: "center",
  },
  footerTap: {
    paddingVertical: 16,
    alignItems: "center",
  },
  footerHint: {
    ...PR_TYPO.body,
    color: colors.text.inverse,
    opacity: 0.7,
  },
});
