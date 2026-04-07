import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useMemo, useState } from "react";
import { useRouter, type Href } from "expo-router";
import { useRequireAuth } from "../../../../hooks/useProtected";

import type { DraftReport } from "./../pickerReportTypes";
import { PICKER_REPORT_DRAFT_STORAGE_KEY } from "./../pickerReportTypes";
import type { DefectsState } from "../DefectsForm";
import type { LegalCleanlinessState } from "../LegalCleanlinessForm";
import type { CommercialUsageState } from "../CommercialUsageForm";
import type { MediaUploadState } from "../MediaUploadCard";
import type { PtsFormState } from "../PtsForm";
import type { OwnerDraft } from "../OwnersForm";

export function usePickerReportCreateController() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();

  const isPicker = user?.role === "picker";

  const initialDraftReport = useMemo<DraftReport>(
    () => ({
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
      } as DefectsState,
    }),
    [],
  );

  const [draftReport, setDraftReport] = useState<DraftReport>(initialDraftReport);
  const [notice, setNotice] = useState<{ tone: "error" | "info" | "success"; message: string } | null>(
    null,
  );

  const goToProfile = useCallback(() => {
    router.push("/(tabs)/profile" as Href);
  }, [router]);

  const onChangeMedia = useCallback((next: MediaUploadState) => {
    setDraftReport((p) => ({ ...p, media: next }));
  }, []);

  const onChangeGeneralInfo = useCallback((next: Record<string, boolean>) => {
    setDraftReport((p) => ({ ...p, generalInfo: next }));
  }, []);

  const onChangePts = useCallback((next: PtsFormState) => {
    setDraftReport((p) => ({ ...p, pts: next }));
  }, []);

  const onChangeMileage = useCallback((next: string) => {
    setDraftReport((p) => ({ ...p, mileage: next }));
  }, []);

  const onChangeOwners = useCallback((next: OwnerDraft[]) => {
    setDraftReport((p) => ({ ...p, owners: next }));
  }, []);

  const onChangeLegalCleanliness = useCallback((next: LegalCleanlinessState) => {
    setDraftReport((p) => ({ ...p, legalCleanliness: next }));
  }, []);

  const onChangeCommercialUsage = useCallback((next: CommercialUsageState) => {
    setDraftReport((p) => ({ ...p, commercialUsage: next }));
  }, []);

  const onChangeDefects = useCallback((next: DefectsState) => {
    setDraftReport((p) => ({ ...p, defects: next }));
  }, []);

  const saveDraftAndContinue = useCallback(() => {
    void (async () => {
      try {
        await AsyncStorage.setItem(
          PICKER_REPORT_DRAFT_STORAGE_KEY,
          JSON.stringify(draftReport),
        );
      } catch {
        setNotice({
          tone: "error",
          message: "Не удалось сохранить черновик. Попробуйте ещё раз.",
        });
        return;
      }

      router.push("/selection-confirm" as Href);
    })();
  }, [draftReport, router]);

  return {
    user,
    loading,
    isPicker,
    draftReport,
    onChangeMedia,
    onChangeGeneralInfo,
    onChangePts,
    onChangeMileage,
    onChangeOwners,
    onChangeLegalCleanliness,
    onChangeCommercialUsage,
    onChangeDefects,
    saveDraftAndContinue,
    goToProfile,
    notice,
    clearNotice: () => setNotice(null),
  };
}

