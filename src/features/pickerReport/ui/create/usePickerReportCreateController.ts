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
import type { OwnerDraft } from "../OwnersForm";
import type { PtsFormState } from "../../../../types/draftReport";
import { collectAllOwnerDateErrors } from "../../../../shared/validation/formatDdMmYyyy";
import { validateMileage } from "../../../../shared/validation/mileageValidation";
import {
  getMissingRequiredMediaKeys,
  validateMediaUpload,
} from "../../../../shared/validation/mediaValidation";
import { normalizePtsForm, validatePtsFormFields } from "../../../../shared/validation/ptsValidation";
import type { CreateReportValidationFeedback } from "./createReportValidation";

export function usePickerReportCreateController() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();

  const isPicker = user?.role === "picker";

  const initialDraftReport = useMemo<DraftReport>(
    () => ({
      media: {
        salonPhoto: null,
        bodyPhoto: null,
        salonVideo: null,
        bodyVideo: null,
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
        damages: [{ id: "damage_1", description: "", photoUri: null }],
        activeDamageId: "damage_1",
      } as DefectsState,
    }),
    [],
  );

  const [draftReport, setDraftReport] = useState<DraftReport>(initialDraftReport);
  const [notice, setNotice] = useState<{ tone: "error" | "info" | "success"; message: string } | null>(
    null,
  );
  const [validationFeedback, setValidationFeedback] =
    useState<CreateReportValidationFeedback | null>(null);
  const [submitAttempt, setSubmitAttempt] = useState(0);

  const failValidation = useCallback((feedback: CreateReportValidationFeedback) => {
    setSubmitAttempt((attempt) => attempt + 1);
    setValidationFeedback(feedback);
    setNotice({
      tone: "error",
      message: feedback.message,
    });
  }, []);

  const goToProfile = useCallback(() => {
    router.push("/(tabs)/profile" as Href);
  }, [router]);

  const onChangeMedia = useCallback((next: MediaUploadState) => {
    setDraftReport((p) => ({ ...p, media: next }));
    if (!validateMediaUpload(next)) {
      setValidationFeedback((prev) =>
        prev?.scrollTo === "media" ? null : prev,
      );
    }
  }, []);

  const onChangeGeneralInfo = useCallback((next: Record<string, boolean>) => {
    setDraftReport((p) => ({ ...p, generalInfo: next }));
  }, []);

  const onChangePts = useCallback((next: PtsFormState) => {
    setDraftReport((p) => ({ ...p, pts: next }));
    if (!validatePtsFormFields(next)) {
      setValidationFeedback((prev) =>
        prev?.scrollTo === "pts" ? null : prev,
      );
    }
  }, []);

  const onChangeMileage = useCallback((next: string) => {
    setDraftReport((p) => ({ ...p, mileage: next }));
    const result = validateMileage(next);
    if (result.ok) {
      setValidationFeedback((prev) =>
        prev?.scrollTo === "mileage" ? null : prev,
      );
    }
  }, []);

  const onChangeOwners = useCallback((next: OwnerDraft[]) => {
    setDraftReport((p) => ({ ...p, owners: next }));
    const { firstError } = collectAllOwnerDateErrors(next);
    if (!firstError) {
      setValidationFeedback((prev) =>
        prev?.scrollTo === "owners" ? null : prev,
      );
    }
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

  const saveDraftAndContinue = useCallback(async () => {
    const mediaError = validateMediaUpload(draftReport.media);
    if (mediaError) {
      failValidation({
        scrollTo: "media",
        message: mediaError,
        missingMediaKeys: getMissingRequiredMediaKeys(draftReport.media),
      });
      return;
    }

    const ptsErrors = validatePtsFormFields(draftReport.pts);
    if (ptsErrors) {
      failValidation({
        scrollTo: "pts",
        message:
          ptsErrors.vin ??
          ptsErrors.year ??
          ptsErrors.engineVolume ??
          "Заполните данные ПТС",
        ptsErrors,
      });
      return;
    }

    const mileageResult = validateMileage(draftReport.mileage);
    if (!mileageResult.ok) {
      failValidation({
        scrollTo: "mileage",
        message: mileageResult.message,
        mileageError: mileageResult.message,
      });
      return;
    }

    const { errorsByOwnerId, firstError } = collectAllOwnerDateErrors(draftReport.owners);
    if (firstError) {
      failValidation({
        scrollTo: "owners",
        message: firstError.message,
        ownersErrors: errorsByOwnerId,
      });
      return;
    }

    setValidationFeedback(null);
    setNotice(null);

    const normalizedDraft = {
      ...draftReport,
      pts: normalizePtsForm(draftReport.pts),
      mileage: mileageResult.normalized,
    };

    try {
      await AsyncStorage.setItem(
        PICKER_REPORT_DRAFT_STORAGE_KEY,
        JSON.stringify(normalizedDraft),
      );
    } catch {
      setNotice({
        tone: "error",
        message: "Не удалось сохранить черновик. Попробуйте ещё раз.",
      });
      return;
    }

    setDraftReport(normalizedDraft);
    router.push("/selection-confirm" as Href);
  }, [draftReport, failValidation, router]);

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
    validationFeedback,
    submitAttempt,
  };
}
