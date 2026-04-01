import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SchemeSvg from "../../../../assets/auto/scheme.svg";
import AlertBadgeIcon from "../../../../assets/icons/badges/alert.svg";
import CheckBadgeIcon from "../../../../assets/icons/badges/check.svg";
import type { DraftReport } from "../pickerReportTypes";
import { styles } from "./PickerReportConfirmPage.styles";

type DefectsMode = "scheme" | "photos";

type Props = {
  draftReport: DraftReport;
  defectsMode: DefectsMode;
  onChangeDefectsMode: (mode: DefectsMode) => void;
};

function CheckRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <View style={styles.checkRow}>
      {ok ? <CheckBadgeIcon width={16} height={16} /> : <AlertBadgeIcon width={16} height={16} />}
      <Text style={[styles.checkText, ok ? styles.checkTextOk : styles.checkTextBad]}>{label}</Text>
    </View>
  );
}

export function ConfirmStatusSection({
  draftReport,
  defectsMode,
  onChangeDefectsMode,
}: Props) {
  const defectsTabs = [
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

  const jurOwner = draftReport.owners.find((o) => o.type === "jur");
  const jurOwnerText =
    !jurOwner || (!jurOwner.startDate && !jurOwner.endDate)
      ? "(нет данных)"
      : `${jurOwner.startDate || "—"} - ${jurOwner.endDate || "—"}`;

  const physOwner = draftReport.owners.find((o) => o.type === "phys");
  const physOwnerText =
    !physOwner || (!physOwner.startDate && !physOwner.endDate)
      ? "(нет данных)"
      : `${physOwner.startDate || "—"} - ${physOwner.endDate || "—"}`;

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Дефекты</Text>

        <View style={styles.defectsTabs}>
          {defectsTabs.map((tab) => {
            const active = defectsMode === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.defectsTabBtn, active && styles.defectsTabBtnActive]}
                activeOpacity={0.9}
                onPress={() => onChangeDefectsMode(tab.key)}
              >
                <Text style={[styles.defectsTabText, active && styles.defectsTabTextActive]}>
                  {tab.label}
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

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Общая информация</Text>
        <View style={styles.checkList}>
          {Object.entries(draftReport.generalInfo).map(([label, ok]) => (
            <CheckRow key={label} label={label} ok={ok} />
          ))}
        </View>
      </View>

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

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Пробег</Text>
        <View style={styles.simpleRow}>
          <Text style={styles.simpleLabel}>Пробег авто</Text>
          <Text style={styles.simpleValue}>{(draftReport.mileage || "—") + " км"}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>2 владельца по ПТС</Text>
        <View style={styles.ownerGroup}>
          <Text style={styles.ownerLabel}>Юридическое лицо</Text>
          <Text style={styles.ownerValue}>{jurOwnerText}</Text>
        </View>
        <View style={styles.ownerGroup}>
          <Text style={styles.ownerLabel}>Физическое лицо</Text>
          <Text style={styles.ownerValue}>{physOwnerText}</Text>
        </View>
      </View>

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

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Коммерческое использование</Text>
          <View style={[styles.badge, notUsed ? styles.badgeOk : styles.badgeBad]}>
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
    </>
  );
}
