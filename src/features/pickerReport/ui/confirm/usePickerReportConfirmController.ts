import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Href, Router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import type { Report } from "../../../../types/report";
import { reportService } from "../../../../services/reportService";
import { reportsService } from "../../../../services/reportsService";
import {
  type DraftReport,
  PICKER_REPORT_DRAFT_STORAGE_KEY,
} from "../pickerReportTypes";

const normalizeVin = (vin: string) => (vin ?? "").toUpperCase().replace(/\s+/g, "");

function isValidDraftReport(obj: unknown): obj is DraftReport {
  if (!obj || typeof obj !== "object") return false;
  const d = obj as Record<string, unknown>;
  return (
    typeof d.media === "object" && d.media !== null &&
    typeof d.generalInfo === "object" && d.generalInfo !== null &&
    typeof d.pts === "object" && d.pts !== null &&
    typeof d.mileage === "string" &&
    Array.isArray(d.owners) &&
    typeof d.legalCleanliness === "object" && d.legalCleanliness !== null &&
    typeof d.commercialUsage === "object" && d.commercialUsage !== null &&
    typeof d.defects === "object" && d.defects !== null
  );
}

export type DefectsMode = "scheme" | "photos";

export function usePickerReportConfirmController(router: Router) {
  const [draftReport, setDraftReport] = useState<DraftReport | null>(null);
  const [reportsForDuplicateCheck, setReportsForDuplicateCheck] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [defectsMode, setDefectsMode] = useState<DefectsMode>("scheme");
  const [vinModalOpen, setVinModalOpen] = useState(false);
  const [notice, setNotice] = useState<{ tone: "error" | "success" | "info"; message: string } | null>(
    null,
  );

  const baseReport = useMemo(() => reportsForDuplicateCheck[0], [reportsForDuplicateCheck]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(PICKER_REPORT_DRAFT_STORAGE_KEY);

        if (!raw) {
          setNotice({
            tone: "error",
            message: "Черновик не найден. Попробуйте создать отчёт заново.",
          });
          return;
        }

        const parsed: unknown = JSON.parse(raw);
        if (!isValidDraftReport(parsed)) {
          setNotice({
            tone: "error",
            message: "Черновик повреждён или устарел. Попробуйте создать отчёт заново.",
          });
          return;
        }
        if (!cancelled) {
          setDraftReport(parsed);
          setDefectsMode(parsed?.defects?.mode ?? "scheme");
        }
      } catch {
        if (!cancelled) {
          setNotice({
            tone: "error",
            message: "Не удалось прочитать черновик.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const reportList = await reportsService.getReportsForDuplicateCheck();
        if (!active) return;
        setReportsForDuplicateCheck(Array.isArray(reportList) ? reportList : []);
      } catch {
        if (!active) return;
        setReportsForDuplicateCheck([]);
        setNotice((prev) =>
          prev ?? {
            tone: "info",
            message: "Проверка дубликатов VIN временно недоступна. Можно продолжить без этой проверки.",
          },
        );
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const isVinDuplicate = useMemo(() => {
    if (!draftReport) return false;
    const inputVin = normalizeVin(draftReport.pts?.vin ?? "");
    if (!inputVin) return false;

    for (const report of reportsForDuplicateCheck) {
      const vinRow = report.ptsData.find((x) => x.label === "VIN");
      const mockVin = vinRow?.value;
      if (!mockVin) continue;

      const mockNormalized = normalizeVin(mockVin).replace(/\*/g, "");
      if (!mockNormalized) continue;

      if (inputVin.includes(mockNormalized) || mockNormalized.includes(inputVin)) {
        return true;
      }
    }

    return false;
  }, [draftReport, reportsForDuplicateCheck]);

  const handleConfirm = async () => {
    if (!draftReport) return;

    if (isVinDuplicate) {
      setVinModalOpen(true);
      return;
    }

    try {
      await reportService.submit(draftReport);
      await AsyncStorage.removeItem(PICKER_REPORT_DRAFT_STORAGE_KEY);
      router.push("/reports" as Href);
    } catch {
      setNotice({
        tone: "error",
        message: "Не удалось отправить отчёт. Попробуйте ещё раз.",
      });
    }
  };

  const handleEdit = () => {
    router.push("/selection" as Href);
  };

  return {
    baseReport,
    defectsMode,
    draftReport,
    loading,
    vinModalOpen,
    setDefectsMode,
    setVinModalOpen,
    handleConfirm,
    handleEdit,
    notice,
    clearNotice: () => setNotice(null),
  };
}
