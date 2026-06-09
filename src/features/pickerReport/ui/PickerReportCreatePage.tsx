import React, { useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePickerReportCreateController } from "./create/usePickerReportCreateController";
import type { CreateReportSection } from "./create/createReportValidation";
import { CreateCommercialUsageSection } from "./create/CreateCommercialUsageSection";
import { CreateDefectsSection } from "./create/CreateDefectsSection";
import { CreateFooterActions } from "./create/CreateFooterActions";
import { CreateGeneralInfoSection } from "./create/CreateGeneralInfoSection";
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
  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef<Record<CreateReportSection, number>>({
    media: 0,
    pts: 0,
    mileage: 0,
    owners: 0,
  });

  useEffect(() => {
    if (!controller.validationFeedback) return;

    const { scrollTo } = controller.validationFeedback;
    const y = sectionY.current[scrollTo] ?? 0;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    });
  }, [controller.validationFeedback, controller.submitAttempt]);

  const registerSection =
    (key: CreateReportSection) =>
    (event: { nativeEvent: { layout: { y: number } } }) => {
      sectionY.current[key] = event.nativeEvent.layout.y;
    };

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
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: insets.top + 4,
              paddingBottom: insets.bottom + 140,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {controller.notice ? (
            <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
              <InlineMessage tone={controller.notice.tone} message={controller.notice.message} />
            </View>
          ) : null}

          <View onLayout={registerSection("media")}>
            <CreateMediaSection
              value={controller.draftReport.media}
              onChange={controller.onChangeMedia}
              highlightKeys={controller.validationFeedback?.missingMediaKeys}
            />
          </View>

          <CreateGeneralInfoSection
            value={controller.draftReport.generalInfo}
            onChange={controller.onChangeGeneralInfo}
          />

          <View onLayout={registerSection("pts")}>
            <CreatePtsSection
              value={controller.draftReport.pts}
              onChange={controller.onChangePts}
              externalErrors={controller.validationFeedback?.ptsErrors}
              submitAttempt={controller.submitAttempt}
            />
          </View>

          <View onLayout={registerSection("mileage")}>
            <CreateMileageSection
              value={controller.draftReport.mileage}
              onChange={controller.onChangeMileage}
              externalError={controller.validationFeedback?.mileageError}
              submitAttempt={controller.submitAttempt}
            />
          </View>

          <View onLayout={registerSection("owners")}>
            <CreateOwnersSection
              value={controller.draftReport.owners}
              onChange={controller.onChangeOwners}
              externalErrorsByOwnerId={controller.validationFeedback?.ownersErrors}
              submitAttempt={controller.submitAttempt}
            />
          </View>

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
      </KeyboardAvoidingView>

      <CreateFooterActions
        bottomPadding={insets.bottom + 12}
        onPress={controller.saveDraftAndContinue}
      />
    </View>
  );
}
