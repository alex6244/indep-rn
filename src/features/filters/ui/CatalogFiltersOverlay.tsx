import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FilterBrandPickerModal } from "./FilterBrandPickerModal";
import { Path, Svg } from "react-native-svg";
import { colors } from "../../../shared/theme/colors";
import { spacing } from "../../../shared/theme/spacing";
import { radius } from "../../../shared/theme/radius";
import { typography } from "../../../shared/theme/typography";
import { AppInput } from "../../../shared/ui/AppInput";
import { EntitiesToggle } from "../../../widgets/entitiesToggle/EntitiesToggle";
import { MarkButton } from "./MarkButton";
import { FilterSelectDropdown } from "./FilterSelectDropdown";
import { CarSearchFiltersBottomPanel } from "./CarSearchFiltersBottomPanel";
import { MileageBottomSheet } from "./MileageBottomSheet";
import { formatMileageRange } from "./mileagePickerUtils";
import type { PaymentType } from "../../catalog/hooks/useCatalogFiltersController";

const SPACING_MD = spacing.md;
const INPUT_MIN_HEIGHT = 44;

const BODY_TYPE_OPTIONS = ["Седан", "Кроссовер", "Хэтчбек", "Универсал", "Внедорожник", "Купе", "Минивэн", "Пикап"];
const ENGINE_OPTIONS = ["Бензин", "Дизель", "Гибрид", "Электро", "Газ"];
const TRANSMISSION_OPTIONS = ["Автомат", "Механика", "Робот", "Вариатор"];
const DRIVE_OPTIONS = ["Передний", "Задний", "Полный"];

function BackCaretBlack({ width = 18, height = 18 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18">
      <Path
        fill={colors.text.primary}
        d="M11.847 14.0281C12.0055 14.1866 12.0945 14.4016 12.0945 14.6257C12.0945 14.8499 12.0055 15.0649 11.847 15.2234C11.6885 15.3819 11.4735 15.4709 11.2493 15.4709C11.0252 15.4709 10.8102 15.3819 10.6517 15.2234L5.02667 9.59839C4.94801 9.52 4.8856 9.42686 4.84301 9.3243C4.80042 9.22174 4.7785 9.11178 4.7785 9.00073C4.7785 8.88968 4.80042 8.77972 4.84301 8.67717C4.8856 8.57461 4.94801 8.48146 5.02667 8.40307L10.6517 2.77807C10.8102 2.61957 11.0252 2.53052 11.2493 2.53052C11.4735 2.53052 11.6885 2.61957 11.847 2.77808C12.0055 2.93658 12.0945 3.15157 12.0945 3.37573C12.0945 3.5999 12.0055 3.81488 11.847 3.97339L6.82034 9.00003L11.847 14.0281Z"
      />
    </Svg>
  );
}

function ChevronRight() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Path
        fill={colors.text.subtle}
        d="M6.153 3.47a.75.75 0 0 0 0 1.06L9.623 8l-3.47 3.47a.75.75 0 1 0 1.06 1.06l4-4a.75.75 0 0 0 0-1.06l-4-4a.75.75 0 0 0-1.06 0Z"
      />
    </Svg>
  );
}

function onlyDigits(s: string): string {
  return String(s ?? "").replace(/\D/g, "");
}

function SectionHeader({
  label,
  onReset,
  showReset,
}: {
  label: string;
  onReset?: () => void;
  showReset?: boolean;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.filterLabel}>{label}</Text>
      {showReset && onReset && (
        <TouchableOpacity onPress={onReset} hitSlop={8}>
          <Text style={styles.resetLink}>Сбросить</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

type CatalogFiltersOverlayProps = {
  brandQuery: string;
  onChangeBrandQuery: (v: string) => void;
  modelQuery: string;
  onChangeModelQuery: (v: string) => void;
  paymentType: PaymentType;
  onChangePaymentType: (v: PaymentType) => void;
  priceFromText: string;
  onChangePriceFromText: (v: string) => void;
  priceToText: string;
  onChangePriceToText: (v: string) => void;
  yearFromText: string;
  onChangeYearFromText: (v: string) => void;
  yearToText: string;
  onChangeYearToText: (v: string) => void;
  mileageFromText: string;
  onChangeMileageFromText: (v: string) => void;
  mileageToText: string;
  onChangeMileageToText: (v: string) => void;
  hasDiscount: boolean;
  onToggleHasDiscount: () => void;
  vatReturn: boolean;
  onToggleVatReturn: () => void;
  weeklyOffer: boolean;
  onToggleWeeklyOffer: () => void;
  bodyType: string | null;
  onChangeBodyType: (v: string | null) => void;
  engineType: string | null;
  onChangeEngineType: (v: string | null) => void;
  transmissionType: string | null;
  onChangeTransmissionType: (v: string | null) => void;
  driveTypeFilter: string | null;
  onChangeDriveTypeFilter: (v: string | null) => void;
  powerFromText: string;
  onChangePowerFromText: (v: string) => void;
  powerToText: string;
  onChangePowerToText: (v: string) => void;
  features: string[];
  onToggleFeature: (label: string) => void;
  filteredCount?: number;
  error: string | null;
  onReset: () => void;
  onApply: () => boolean;
  onClose: () => void;
};

export function CatalogFiltersOverlay({
  brandQuery,
  onChangeBrandQuery,
  modelQuery,
  onChangeModelQuery,
  paymentType,
  onChangePaymentType,
  priceFromText,
  onChangePriceFromText,
  priceToText,
  onChangePriceToText,
  yearFromText,
  onChangeYearFromText,
  yearToText,
  onChangeYearToText,
  mileageFromText,
  onChangeMileageFromText,
  mileageToText,
  onChangeMileageToText,
  hasDiscount,
  onToggleHasDiscount,
  vatReturn,
  onToggleVatReturn,
  weeklyOffer,
  onToggleWeeklyOffer,
  bodyType,
  onChangeBodyType,
  engineType,
  onChangeEngineType,
  transmissionType,
  onChangeTransmissionType,
  driveTypeFilter,
  onChangeDriveTypeFilter,
  powerFromText,
  onChangePowerFromText,
  powerToText,
  onChangePowerToText,
  features,
  onToggleFeature,
  filteredCount,
  error,
  onReset,
  onApply,
  onClose,
}: CatalogFiltersOverlayProps) {
  const [mileageSheetVisible, setMileageSheetVisible] = useState(false);
  const [brandPickerVisible, setBrandPickerVisible] = useState(false);

  const mileageLabel = formatMileageRange(mileageFromText, mileageToText);
  const hasMileageFilter = mileageFromText.trim() !== "" || mileageToText.trim() !== "";
  const hasYearFilter = yearFromText.trim() !== "" || yearToText.trim() !== "";
  const hasPowerFilter = powerFromText.trim() !== "" || powerToText.trim() !== "";

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
          <BackCaretBlack width={18} height={18} />
          <Text style={styles.backBtnText}>Назад</Text>
        </TouchableOpacity>

        <Text style={styles.filtersTitle}>Фильтры</Text>

        {/* Автомобиль */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Автомобиль</Text>
          <TouchableOpacity
            style={[styles.brandTrigger, styles.inputWrap]}
            onPress={() => setBrandPickerVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={brandQuery || "Марка"}
          >
            <Text style={brandQuery ? styles.brandTriggerTextActive : styles.brandTriggerTextPlaceholder}>
              {brandQuery || "Марка"}
            </Text>
            {brandQuery ? (
              <TouchableOpacity
                hitSlop={8}
                onPress={() => onChangeBrandQuery("")}
                accessibilityRole="button"
                accessibilityLabel="Сбросить марку"
              >
                <Text style={styles.brandClearBtn}>✕</Text>
              </TouchableOpacity>
            ) : (
              <ChevronRight />
            )}
          </TouchableOpacity>
          <AppInput
            placeholder="Модель"
            value={modelQuery}
            onChangeText={onChangeModelQuery}
          />
        </View>

        {/* Способ оплаты */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Способ оплаты</Text>
          <EntitiesToggle
            leftLabel="Наличные"
            rightLabel="В кредит"
            value={paymentType}
            onChange={onChangePaymentType}
          />
        </View>

        {/* Цена */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Цена, ₽</Text>
          <View style={styles.inputsRow}>
            <AppInput
              placeholder="От"
              keyboardType="numeric"
              value={priceFromText}
              onChangeText={onChangePriceFromText}
              containerStyle={styles.inputHalf}
            />
            <AppInput
              placeholder="До"
              keyboardType="numeric"
              value={priceToText}
              onChangeText={onChangePriceToText}
              containerStyle={styles.inputHalf}
            />
          </View>
        </View>

        {/* Доп. чекбоксы */}
        <View style={[styles.filterBlock, styles.marksRow]}>
          <MarkButton label="Со скидками" selected={hasDiscount} onToggle={onToggleHasDiscount} />
          <MarkButton label="Возврат НДС" selected={vatReturn} onToggle={onToggleVatReturn} />
          <MarkButton label="Предложение недели" selected={weeklyOffer} onToggle={onToggleWeeklyOffer} />
        </View>

        {/* Год выпуска */}
        <View style={styles.filterBlock}>
          <SectionHeader
            label="Год выпуска"
            showReset={hasYearFilter}
            onReset={() => { onChangeYearFromText(""); onChangeYearToText(""); }}
          />
          <View style={styles.inputsRow}>
            <AppInput
              placeholder="От"
              keyboardType="numeric"
              value={yearFromText}
              onChangeText={(t) => onChangeYearFromText(onlyDigits(t).slice(0, 4))}
              containerStyle={styles.inputHalf}
            />
            <AppInput
              placeholder="До"
              keyboardType="numeric"
              value={yearToText}
              onChangeText={(t) => onChangeYearToText(onlyDigits(t).slice(0, 4))}
              containerStyle={styles.inputHalf}
            />
          </View>
        </View>

        {/* Пробег */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Пробег, км</Text>
          <TouchableOpacity
            style={styles.mileageRow}
            onPress={() => setMileageSheetVisible(true)}
            accessibilityLabel={`Пробег: ${mileageLabel}. Нажмите для выбора.`}
            accessibilityRole="button"
          >
            <Text style={[styles.mileageRowText, hasMileageFilter && styles.mileageRowTextActive]}>
              {mileageLabel}
            </Text>
            <ChevronRight />
          </TouchableOpacity>
        </View>

        {/* Кузов — dropdown */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Кузов</Text>
          <FilterSelectDropdown
            placeholder="Кузов"
            options={BODY_TYPE_OPTIONS}
            value={bodyType}
            onChange={onChangeBodyType}
          />
        </View>

        {/* Двигатель — dropdown */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Двигатель</Text>
          <FilterSelectDropdown
            placeholder="Двигатель"
            options={ENGINE_OPTIONS}
            value={engineType}
            onChange={onChangeEngineType}
          />
        </View>

        {/* Коробка — dropdown */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Коробка</Text>
          <FilterSelectDropdown
            placeholder="Коробка"
            options={TRANSMISSION_OPTIONS}
            value={transmissionType}
            onChange={onChangeTransmissionType}
          />
        </View>

        {/* Привод — dropdown */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Привод</Text>
          <FilterSelectDropdown
            placeholder="Привод"
            options={DRIVE_OPTIONS}
            value={driveTypeFilter}
            onChange={onChangeDriveTypeFilter}
          />
        </View>

        {/* Мощность */}
        <View style={styles.filterBlock}>
          <SectionHeader
            label="Мощность, л.с."
            showReset={hasPowerFilter}
            onReset={() => { onChangePowerFromText(""); onChangePowerToText(""); }}
          />
          <View style={styles.inputsRow}>
            <AppInput
              placeholder="49 л.с."
              keyboardType="numeric"
              value={powerFromText}
              onChangeText={onChangePowerFromText}
              containerStyle={styles.inputHalf}
            />
            <AppInput
              placeholder="898 л.с."
              keyboardType="numeric"
              value={powerToText}
              onChangeText={onChangePowerToText}
              containerStyle={styles.inputHalf}
            />
          </View>
        </View>

        {/* Особенности */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Особенности</Text>
          <View style={styles.marksRow}>
            {["Без ДТП", "Отличное состояние", "Маленький пробег", "На гарантии"].map((m) => (
              <MarkButton
                key={m}
                label={m}
                selected={features.includes(m)}
                onToggle={() => onToggleFeature(m)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <CarSearchFiltersBottomPanel
        filteredCount={filteredCount}
        error={error}
        onReset={onReset}
        onApply={onApply}
        onClose={onClose}
      />

      <MileageBottomSheet
        visible={mileageSheetVisible}
        mileageFromText={mileageFromText}
        mileageToText={mileageToText}
        filteredCount={filteredCount}
        onApply={(from, to) => {
          onChangeMileageFromText(from);
          onChangeMileageToText(to);
        }}
        onReset={() => {
          onChangeMileageFromText("");
          onChangeMileageToText("");
        }}
        onClose={() => setMileageSheetVisible(false)}
      />

      <FilterBrandPickerModal
        visible={brandPickerVisible}
        value={brandQuery}
        onChange={onChangeBrandQuery}
        onClose={() => setBrandPickerVisible(false)}
        filteredCount={filteredCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface.primary,
  },
  scroll: { flex: 1 },
  content: {
    padding: SPACING_MD,
    paddingBottom: SPACING_MD,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  backBtnText: {
    ...typography.textRegular,
    color: colors.brand.primary,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: spacing.sm,
  },
  filtersTitle: {
    ...typography.title,
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  filterBlock: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  filterLabel: {
    ...typography.textRegular,
    fontSize: 12,
    fontWeight: "500",
    color: colors.text.tertiary,
  },
  resetLink: {
    ...typography.textRegular,
    fontSize: 12,
    fontWeight: "500",
    color: colors.brand.primary,
  },
  inputWrap: {
    marginBottom: spacing.sm,
  },
  inputsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  inputHalf: {
    flex: 1,
  },
  marksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  brandTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.sm,
    backgroundColor: colors.surface.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: INPUT_MIN_HEIGHT,
  },
  brandTriggerTextPlaceholder: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.text.subtle,
    flex: 1,
  },
  brandTriggerTextActive: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  brandClearBtn: {
    fontSize: 14,
    color: colors.text.subtle,
    paddingLeft: spacing.sm,
  },
  mileageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.sm,
    backgroundColor: colors.surface.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: INPUT_MIN_HEIGHT,
  },
  mileageRowText: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.text.subtle,
  },
  mileageRowTextActive: {
    color: colors.text.primary,
  },
});
