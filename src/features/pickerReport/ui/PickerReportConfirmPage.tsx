import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ConfirmFooterActions } from "./confirm/ConfirmFooterActions";
import { ConfirmHeader } from "./confirm/ConfirmHeader";
import { ConfirmModals } from "./confirm/ConfirmModals";
import { ConfirmReportCardsSection } from "./confirm/ConfirmReportCardsSection";
import { styles } from "./confirm/PickerReportConfirmPage.styles";
import { ConfirmStatusSection } from "./confirm/ConfirmStatusSection";
import { usePickerReportConfirmController } from "./confirm/usePickerReportConfirmController";
import { InlineMessage } from "../../../shared/ui/InlineMessage";
import { colors } from "../../../shared/theme/colors";

export function PickerReportConfirmPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const controller = usePickerReportConfirmController(router);

  if (controller.loading) {
    return (
      <View style={[styles.screen, styles.loadingScreen]}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
        <Text style={styles.loadingText}>Загружаем отчёт...</Text>
      </View>
    );
  }

  if (!controller.draftReport) {
    return (
      <View style={styles.screen}>
        {controller.notice ? (
          <View style={{ marginHorizontal: 16, marginTop: 16 }}>
            <InlineMessage tone={controller.notice.tone} message={controller.notice.message} />
          </View>
        ) : null}
        <Text style={styles.centerText}>Черновик не загружен</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ConfirmHeader topPadding={insets.top + 6} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 160 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {controller.notice ? (
          <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
            <InlineMessage tone={controller.notice.tone} message={controller.notice.message} />
          </View>
        ) : null}
        <ConfirmStatusSection
          draftReport={controller.draftReport}
          defectsMode={controller.defectsMode}
          onChangeDefectsMode={controller.setDefectsMode}
        />
        <ConfirmReportCardsSection report={controller.baseReport} />
      </ScrollView>

      <ConfirmFooterActions
        bottomPadding={insets.bottom + 12}
        onEdit={controller.handleEdit}
        onConfirm={controller.handleConfirm}
      />

      <ConfirmModals
        vinExistsVisible={controller.vinModalOpen}
        onCloseVinExists={() => controller.setVinModalOpen(false)}
      />
    </View>
  );
}

