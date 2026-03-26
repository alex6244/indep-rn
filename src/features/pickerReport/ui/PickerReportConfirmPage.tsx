import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";

import Logo from "../../../assets/logo.svg";
import SchemeSvg from "../../../assets/auto/scheme.svg";

import CheckBadgeIcon from "../../../assets/icons/badges/check.svg";
import AlertBadgeIcon from "../../../assets/icons/badges/alert.svg";

import { reports } from "../../../data/reports";
import { PenaltiesCard } from "../../../widgets/reports/PenaltiesCard";
import { CostEstimationCard } from "../../../widgets/reports/CostEstimationCard";

import {
  type DraftReport,
  PICKER_REPORT_DRAFT_STORAGE_KEY,
} from "./pickerReportTypes";

const normalizeVin = (vin: string) =>
  (vin ?? "").toUpperCase().replace(/\s+/g, "");

function CheckRow({
  label,
  ok,
}: {
  label: string;
  ok: boolean;
}) {
  return (
    <View style={styles.checkRow}>
      {ok ? (
        <CheckBadgeIcon width={16} height={16} />
      ) : (
        <AlertBadgeIcon width={16} height={16} />
      )}
      <Text style={[styles.checkText, ok ? styles.checkTextOk : styles.checkTextBad]}>
        {label}
      </Text>
    </View>
  );
}

function VinExistsModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.vinModalBackdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.vinModalCard} onStartShouldSetResponder={() => true}>
          <Text style={styles.vinModalTitle}>Такой VIN-номер уже существует</Text>
          <Text style={styles.vinModalSubtitle}>
            Проверьте корректность введенных данных или укажите другой VIN.
          </Text>
          <TouchableOpacity style={styles.vinModalButton} onPress={onClose}>
            <Text style={styles.vinModalButtonText}>Понятно</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export function PickerReportConfirmPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [draftReport, setDraftReport] = useState<DraftReport | null>(null);
  const [loading, setLoading] = useState(true);

  const [defectsMode, setDefectsMode] = useState<"scheme" | "photos">("scheme");
  const [vinModalOpen, setVinModalOpen] = useState(false);

  const baseReport = useMemo(() => reports[0], []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(
          PICKER_REPORT_DRAFT_STORAGE_KEY,
        );

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

    for (const r of reports) {
      const vinRow = r.ptsData.find((x) => x.label === "VIN");
      const mockVin = vinRow?.value;
      if (!mockVin) continue;

      const mockNormalized = normalizeVin(mockVin).replace(/\*/g, "");
      if (!mockNormalized) continue;

      // “includes” после упрощения шаблона mock-строки
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

  if (loading) {
    return (
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingTop: insets.top + 6 }]} />
      </View>
    );
  }

  if (!draftReport) {
    return (
      <View style={styles.screen}>
        <Text style={styles.centerText}>Черновик не загружен</Text>
      </View>
    );
  }

  const defectsTab = [
    { key: "scheme" as const, label: "Схема повреждений" },
    { key: "photos" as const, label: "Фото повреждений" },
  ];

  const pts = draftReport.pts;
  const ptsText =
    (pts.ptsType === "original" ? "Оригинал" : "Неоригинал") +
    (pts.hasElectronicPts ? " + электронный ПТС" : "");

  const commercial = draftReport.commercialUsage;
  const carSharingOk = commercial.carSharing === false;
  const leasingOk = commercial.leasing === false;
  const notUsed = !commercial.carSharing && !commercial.leasing && !commercial.taxiPermission;

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Logo width={82} height={22} />
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 160 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Всё верно?</Text>
        <Text style={styles.subtitle}>
          Пожалуйста, проверьте введенные данные перед отправкой.
        </Text>

        {/* Дефекты */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Дефекты</Text>

          <View style={styles.defectsTabs}>
            {defectsTab.map((t) => {
              const active = defectsMode === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.defectsTabBtn, active && styles.defectsTabBtnActive]}
                  activeOpacity={0.9}
                  onPress={() => setDefectsMode(t.key)}
                >
                  <Text
                    style={[
                      styles.defectsTabText,
                      active && styles.defectsTabTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.defectsPreview}>
            {defectsMode === "scheme" ? (
              <View style={styles.schemePreview}>
                <SchemeSvg width="100%" height={140} />
              </View>
            ) : (
              <View style={styles.photosPreview}>
                <Text style={styles.photosPreviewText}>Фото повреждений (заглушка)</Text>
              </View>
            )}
          </View>
        </View>

        {/* Общая информация */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Общая информация</Text>
          <View style={styles.checkList}>
            {Object.entries(draftReport.generalInfo).map(([label, ok]) => (
              <CheckRow key={label} label={label} ok={ok} />
            ))}
          </View>
        </View>

        {/* Данные из ПТС */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Данные из ПТС</Text>
          <View style={styles.ptsBox}>
            <View style={styles.ptsGrid}>
              <View style={styles.ptsRow}>
                <Text style={styles.ptsLabel}>VIN</Text>
                <Text style={styles.ptsValue}>{pts.vin || "—"}</Text>
              </View>
              <View style={styles.ptsRow}>
                <Text style={styles.ptsLabel}>Марка</Text>
                <Text style={styles.ptsValue}>{pts.brand || "—"}</Text>
              </View>
              <View style={styles.ptsRow}>
                <Text style={styles.ptsLabel}>Модель</Text>
                <Text style={styles.ptsValue}>{pts.model || "—"}</Text>
              </View>
              <View style={styles.ptsRow}>
                <Text style={styles.ptsLabel}>Год выпуска</Text>
                <Text style={styles.ptsValue}>{pts.year || "—"}</Text>
              </View>
              <View style={styles.ptsRow}>
                <Text style={styles.ptsLabel}>Цвет</Text>
                <Text style={styles.ptsValue}>{pts.color || "—"}</Text>
              </View>
              <View style={styles.ptsRow}>
                <Text style={styles.ptsLabel}>Объём двигателя</Text>
                <Text style={styles.ptsValue}>{pts.engineVolume || "—"}</Text>
              </View>
              <View style={styles.ptsRow}>
                <Text style={styles.ptsLabel}>ПТС</Text>
                <Text style={styles.ptsValue}>{ptsText}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Пробег */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Пробег</Text>
          <View style={styles.simpleRow}>
            <Text style={styles.simpleLabel}>Пробег авто</Text>
            <Text style={styles.simpleValue}>
              {(draftReport.mileage || "—") + " км"}
            </Text>
          </View>
        </View>

        {/* 2 владельца */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2 владельца по ПТС</Text>
          <View style={styles.ownerGroup}>
            <Text style={styles.ownerLabel}>Юридическое лицо</Text>
            <Text style={styles.ownerValue}>
              {(() => {
                const jur = draftReport.owners.find((o) => o.type === "jur");
                if (!jur) return "(нет данных)";
                if (!jur.startDate && !jur.endDate) return "(нет данных)";
                return `${jur.startDate || "—"} - ${jur.endDate || "—"}`;
              })()}
            </Text>
          </View>
          <View style={styles.ownerGroup}>
            <Text style={styles.ownerLabel}>Физическое лицо</Text>
            <Text style={styles.ownerValue}>
              {(() => {
                const phys = draftReport.owners.find((o) => o.type === "phys");
                if (!phys) return "(нет данных)";
                if (!phys.startDate && !phys.endDate) return "(нет данных)";
                return `${phys.startDate || "—"} - ${phys.endDate || "—"}`;
              })()}
            </Text>
          </View>
        </View>

        {/* Юридическая чистота */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Юридическая чистота</Text>
          <View style={styles.checkList}>
            <CheckRow
              label={
                draftReport.legalCleanliness.pledge
                  ? "Сведения о нахождении в залоге обнаружены"
                  : "Сведения о нахождении в залоге не обнаружены"
              }
              ok={!draftReport.legalCleanliness.pledge}
            />
            <CheckRow
              label={
                draftReport.legalCleanliness.registrationRestrictions
                  ? "Ограничения на регистрационные действия обнаружены"
                  : "Ограничения на регистрационные действия не обнаружены"
              }
              ok={!draftReport.legalCleanliness.registrationRestrictions}
            />
            <CheckRow
              label={
                draftReport.legalCleanliness.wanted
                  ? "Сведения о нахождении в розыске обнаружены"
                  : "Сведения о нахождении в розыске не обнаружены"
              }
              ok={!draftReport.legalCleanliness.wanted}
            />
          </View>
        </View>

        {/* Коммерческое использование */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Коммерческое использование</Text>
            <View
              style={[
                styles.badge,
                notUsed ? styles.badgeOk : styles.badgeBad,
              ]}
            >
              <Text style={[styles.badgeText, notUsed ? styles.badgeTextOk : styles.badgeTextBad]}>
                {notUsed ? "Не используется" : "Используется"}
              </Text>
            </View>
          </View>

          <View style={styles.checkList}>
            <CheckRow
              label={
                carSharingOk
                  ? "Не зарегистрировался для работы в каршеринге"
                  : "Зарегистрирован для работы в каршеринге"
              }
              ok={carSharingOk}
            />
            <CheckRow
              label={
                leasingOk
                  ? "Не обнаружен в договорах лизинга"
                  : "Обнаружен в договорах лизинга"
              }
              ok={leasingOk}
            />
          </View>
        </View>

        {/* Штрафы + Оценка стоимости (как в отчёт-details) */}
        {baseReport ? (
          <>
            <PenaltiesCard report={baseReport} />
            <CostEstimationCard report={baseReport} />
          </>
        ) : null}
      </ScrollView>

      {/* Bottom actions */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + 12 },
        ]}
      >
        <TouchableOpacity
          style={[styles.bottomBtn, styles.editBtn]}
          activeOpacity={0.9}
          onPress={() => router.push("/selection" as Href)}
        >
          <Text style={styles.bottomBtnTextEdit}>Исправить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomBtn, styles.confirmBtn]}
          activeOpacity={0.9}
          onPress={handleConfirm}
        >
          <Text style={styles.bottomBtnTextConfirm}>Подтвердить</Text>
        </TouchableOpacity>
      </View>

      <VinExistsModal
        visible={vinModalOpen}
        onClose={() => setVinModalOpen(false)}
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
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1E1E1E",
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B757C",
    fontWeight: "600",
    lineHeight: 18,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1E1E1E",
    marginBottom: 12,
  },
  defectsTabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  defectsTabBtn: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
  },
  defectsTabBtnActive: {
    backgroundColor: "#DB4431",
  },
  defectsTabText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6B757C",
  },
  defectsTabTextActive: {
    color: "#FFFFFF",
  },
  defectsPreview: {},
  schemePreview: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F7F7F7",
  },
  photosPreview: {
    height: 140,
    borderRadius: 14,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  photosPreviewText: {
    fontSize: 12,
    color: "#6B757C",
    fontWeight: "700",
    textAlign: "center",
  },
  checkList: {
    gap: 10,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkText: {
    fontSize: 14,
    fontWeight: "700",
  },
  checkTextOk: {
    color: "#1E1E1E",
  },
  checkTextBad: {
    color: "#1E1E1E",
  },
  ptsBox: {
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#0A84FF",
    padding: 12,
  },
  ptsGrid: {
    gap: 12,
  },
  ptsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  ptsLabel: {
    flex: 1,
    color: "#1E1E1E",
    fontSize: 13,
    fontWeight: "700",
  },
  ptsValue: {
    flex: 1,
    color: "#1E1E1E",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
  },
  simpleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  simpleLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#979797",
    flex: 1,
  },
  simpleValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E1E1E",
    textAlign: "right",
  },
  ownerGroup: {
    marginBottom: 10,
  },
  ownerLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 6,
  },
  ownerValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6B757C",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeOk: {
    backgroundColor: "#EAF7EE",
  },
  badgeBad: {
    backgroundColor: "#FFF1F3",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  badgeTextOk: {
    color: "#4DB95C",
  },
  badgeTextBad: {
    color: "#DB4431",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 14,
  },
  bottomBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    backgroundColor: "#080717",
  },
  confirmBtn: {
    backgroundColor: "#DB4431",
  },
  bottomBtnTextEdit: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  bottomBtnTextConfirm: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  vinModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },
  vinModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  vinModalTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1E1E1E",
    marginBottom: 10,
  },
  vinModalSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B757C",
    fontWeight: "700",
    marginBottom: 14,
  },
  vinModalButton: {
    backgroundColor: "#DB4431",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  vinModalButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
  centerText: {
    padding: 16,
    color: "#6B757C",
    fontWeight: "700",
  },
});

