import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";

import Logo from "../../../assets/logo.svg";
import { useAuth } from "../../../contexts/AuthContext";

import {
  MediaUploadCard,
  type MediaUploadState,
} from "./MediaUploadCard";
import {
  GeneralInfoCheckboxes,
} from "./GeneralInfoCheckboxes";
import type { PtsFormState } from "./PtsForm";
import { PtsForm } from "./PtsForm";
import { MileageSection } from "./MileageSection";
import type { OwnerDraft } from "./OwnersForm";
import { OwnersForm } from "./OwnersForm";
import type { LegalCleanlinessState } from "./LegalCleanlinessForm";
import { LegalCleanlinessForm } from "./LegalCleanlinessForm";
import type { CommercialUsageState } from "./CommercialUsageForm";
import { CommercialUsageForm } from "./CommercialUsageForm";
import type { DefectsState } from "./DefectsForm";
import { DefectsForm } from "./DefectsForm";
import { BottomNextButton } from "./BottomNextButton";

type DraftReport = {
  media: MediaUploadState;
  generalInfo: Record<string, boolean>;
  pts: PtsFormState;
  mileage: string;
  owners: OwnerDraft[];
  legalCleanliness: LegalCleanlinessState;
  commercialUsage: CommercialUsageState;
  defects: DefectsState;
};

export function PickerReportCreatePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, loading } = useAuth();

  const [draftReport, setDraftReport] = useState<DraftReport>(() => ({
    media: {
      salonPhoto: false,
      bodyPhoto: true,
      salonVideo: false,
      bodyVideo: false,
    },
    generalInfo: {
      "ПТС оригинал": false,
      "Заводская оптика": false,
      "Юридически чиста": true,
      "Коробка, двигатель - без нареканий": true,
      "Тест-драйв - без нареканий": true,
      "Сухое подкапотное пространство": true,
      "Подвеска - без серьезных нареканий": true,
      "2 комплекта резины": true,
    },
    pts: {
      vin: "",
      brand: "",
      model: "",
      year: "",
      color: "",
      engineVolume: "",
      ptsType: "original",
      hasElectronicPts: true,
    },
    mileage: "",
    owners: [
      {
        id: "owner_1",
        type: "jur",
        startDate: "",
        endDate: "",
      },
    ],
    legalCleanliness: {
      pledge: true,
      registrationRestrictions: true,
      wanted: true,
    },
    commercialUsage: {
      taxiPermission: true,
      carSharing: true,
      leasing: true,
    },
    defects: {
      mode: "scheme",
      damages: [{ id: "damage_1", description: "" }],
      activeDamageId: "damage_1",
    },
  }));

  useEffect(() => {
    if (!loading && !user) {
      router.push("/(auth)" as Href);
    }
  }, [loading, user, router]);

  const isPicker = user?.role === "picker";

  const nonPicker = useMemo(() => {
    if (!user) return null;
    if (user.role === "picker") return null;
    return (
      <View style={styles.center}>
        <Text style={styles.noticeTitle}>Этот раздел доступен только подборщикам</Text>
        <Text style={styles.noticeText}>
          Чтобы создать отчет, нужно перейти в роль подборщика.
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/(tabs)/profile" as Href)}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryBtnText}>Перейти в профиль</Text>
        </TouchableOpacity>
      </View>
    );
  }, [router, user]);

  if (loading || !user) {
    return <View style={styles.center} />;
  }

  if (!isPicker) return nonPicker;

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Logo width={82} height={22} />
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 140 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <MediaUploadCard
          value={draftReport.media}
          onChange={(next) => setDraftReport((p) => ({ ...p, media: next }))}
        />

        <GeneralInfoCheckboxes
          value={draftReport.generalInfo}
          onChange={(next) => setDraftReport((p) => ({ ...p, generalInfo: next }))}
        />

        <PtsForm
          value={draftReport.pts}
          onChange={(next) => setDraftReport((p) => ({ ...p, pts: next }))}
        />

        <MileageSection
          value={draftReport.mileage}
          onChange={(next) => setDraftReport((p) => ({ ...p, mileage: next }))}
        />

        <OwnersForm
          value={draftReport.owners}
          onChange={(next) => setDraftReport((p) => ({ ...p, owners: next }))}
        />

        <LegalCleanlinessForm
          value={draftReport.legalCleanliness}
          onChange={(next) =>
            setDraftReport((p) => ({ ...p, legalCleanliness: next }))
          }
        />

        <CommercialUsageForm
          value={draftReport.commercialUsage}
          onChange={(next) =>
            setDraftReport((p) => ({ ...p, commercialUsage: next }))
          }
        />

        <DefectsForm
          value={draftReport.defects}
          onChange={(next) => setDraftReport((p) => ({ ...p, defects: next }))}
        />
      </ScrollView>

      <BottomNextButton
        bottomPadding={insets.bottom + 12}
        onPress={() => Alert.alert("Черновик сохранен", "Переход на следующий шаг (пока заглушка)")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  topBar: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
  },
  content: {
    paddingTop: 10,
  },
  center: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    padding: 16,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: "#1E1E1E",
    textAlign: "center",
  },
  noticeText: {
    fontSize: 14,
    color: "#6B757C",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: "#DB4431",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});

