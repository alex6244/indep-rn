import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Href, Router } from "expo-router";
import { Alert } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { reports } from "../../../../data/reports";
import {
  type DraftReport,
  PICKER_REPORT_DRAFT_STORAGE_KEY,
} from "../pickerReportTypes";

const normalizeVin = (vin: string) => (vin ?? "").toUpperCase().replace(/\s+/g, "");

export type DefectsMode = "scheme" | "photos";

export function usePickerReportConfirmController(router: Router) {
  const [draftReport, setDraftReport] = useState<DraftReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [defectsMode, setDefectsMode] = useState<DefectsMode>("scheme");
  const [vinModalOpen, setVinModalOpen] = useState(false);

  const baseReport = useMemo(() => reports[0], []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(PICKER_REPORT_DRAFT_STORAGE_KEY);

        if (!raw) {
          Alert.alert("Черновик не найден", "Попробуйте создать отчёт заново", [
            {
              text: "Ок",
              onPress: () => router.push("/selection" as Href),
            },
          ]);
          return;
        }

        const parsed = JSON.parse(raw) as DraftReport;
        if (!cancelled) {
          setDraftReport(parsed);
          setDefectsMode(parsed?.defects?.mode ?? "scheme");
        }
      } catch {
        Alert.alert("Ошибка", "Не удалось прочитать черновик", [
          {
            text: "Ок",
            onPress: () => router.push("/selection" as Href),
          },
        ]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const isVinDuplicate = useMemo(() => {
    if (!draftReport) return false;
    const inputVin = normalizeVin(draftReport.pts?.vin ?? "");
    if (!inputVin) return false;

    for (const report of reports) {
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
  }, [draftReport]);

  const handleConfirm = () => {
    if (!draftReport) return;

    if (isVinDuplicate) {
      setVinModalOpen(true);
      return;
    }

    Alert.alert("Подтверждено", "Заявка отправлена", [
      {
        text: "Ок",
        onPress: () => router.push("/reports" as Href),
      },
    ]);
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
  };
}
