import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePickerReportCreateController } from "./create/usePickerReportCreateController";
import { CreateCommercialUsageSection } from "./create/CreateCommercialUsageSection";
import { CreateDefectsSection } from "./create/CreateDefectsSection";
import { CreateFooterActions } from "./create/CreateFooterActions";
import { CreateGeneralInfoSection } from "./create/CreateGeneralInfoSection";
import { CreateHeader } from "./create/CreateHeader";
import { CreateLegalCleanlinessSection } from "./create/CreateLegalCleanlinessSection";
import { CreateMileageSection } from "./create/CreateMileageSection";
import { CreateMediaSection } from "./create/CreateMediaSection";
import { CreateOwnersSection } from "./create/CreateOwnersSection";
import { CreatePtsSection } from "./create/CreatePtsSection";
import { CreateRoleGate } from "./create/CreateRoleGate";
import { styles } from "./create/PickerReportCreatePage.styles";
import { InlineMessage } from "../../../shared/ui/InlineMessage";
import { ScreenStateLoading } from "../../../shared/ui/ScreenStateLoading";

export function PickerReportCreatePage() {
  const insets = useSafeAreaInsets();
  const controller = usePickerReportCreateController();

  if (controller.loading || !controller.user) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ScreenStateLoading message="Загружаем данные..." />
      </View>
    );
  }

  if (!controller.isPicker) {
    return <CreateRoleGate onGoToProfile={controller.goToProfile} />;
  }

  return (
    <View style={styles.screen}>
      <CreateHeader topPadding={insets.top + 6} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 140 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {controller.notice ? (
          <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
            <InlineMessage tone={controller.notice.tone} message={controller.notice.message} />
          </View>
        ) : null}
        <CreateMediaSection
          value={controller.draftReport.media}
          onChange={controller.onChangeMedia}
        />

        <CreateGeneralInfoSection
          value={controller.draftReport.generalInfo}
          onChange={controller.onChangeGeneralInfo}
        />

        <CreatePtsSection
          value={controller.draftReport.pts}
          onChange={controller.onChangePts}
        />

        <CreateMileageSection
          value={controller.draftReport.mileage}
          onChange={controller.onChangeMileage}
        />

        <CreateOwnersSection
          value={controller.draftReport.owners}
          onChange={controller.onChangeOwners}
        />

        <CreateLegalCleanlinessSection
          value={controller.draftReport.legalCleanliness}
          onChange={controller.onChangeLegalCleanliness}
        />

        <CreateCommercialUsageSection
          value={controller.draftReport.commercialUsage}
          onChange={controller.onChangeCommercialUsage}
        />

        <CreateDefectsSection
          value={controller.draftReport.defects}
          onChange={controller.onChangeDefects}
        />
      </ScrollView>

      <CreateFooterActions
        bottomPadding={insets.bottom + 12}
        onPress={controller.saveDraftAndContinue}
      />
    </View>
  );
}

