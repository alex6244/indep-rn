import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { EntitiesToggle } from "../../../widgets/entitiesToggle/EntitiesToggle";
import { MarkButton } from "./MarkButton";
import { CarSearchFiltersBottomPanel } from "./CarSearchFiltersBottomPanel";
import { MileageRangePicker } from "./MileageRangePicker";
import type { PaymentType } from "../../catalog/hooks/useCatalogFiltersController";

function BackCaretBlack({ width = 18, height = 18 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18">
      <Path
        fill="#000000"
        d="M11.847 14.0281C12.0055 14.1866 12.0945 14.4016 12.0945 14.6257C12.0945 14.8499 12.0055 15.0649 11.847 15.2234C11.6885 15.3819 11.4735 15.4709 11.2493 15.4709C11.0252 15.4709 10.8102 15.3819 10.6517 15.2234L5.02667 9.59839C4.94801 9.52 4.8856 9.42686 4.84301 9.3243C4.80042 9.22174 4.7785 9.11178 4.7785 9.00073C4.7785 8.88968 4.80042 8.77972 4.84301 8.67717C4.8856 8.57461 4.94801 8.48146 5.02667 8.40307L10.6517 2.77807C10.8102 2.61957 11.0252 2.53052 11.2493 2.53052C11.4735 2.53052 11.6885 2.61957 11.847 2.77808C12.0055 2.93658 12.0945 3.15157 12.0945 3.37573C12.0945 3.5999 12.0055 3.81488 11.847 3.97339L6.82034 9.00003L11.847 14.0281Z"
      />
    </Svg>
  );
}

function onlyDigits(s: string): string {
  return String(s ?? "").replace(/\D/g, "");
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
  bodyTypes: string[];
  onToggleBodyType: (label: string) => void;
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
  bodyTypes,
  onToggleBodyType,
  features,
  onToggleFeature,
  filteredCount,
  error,
  onReset,
  onApply,
  onClose,
}: CatalogFiltersOverlayProps) {
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

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Автомобиль</Text>
          <TextInput
            placeholder="Марка"
            value={brandQuery}
            onChangeText={onChangeBrandQuery}
            style={styles.input}
            placeholderTextColor="#979797"
          />
          <TextInput
            placeholder="Модель"
            value={modelQuery}
            onChangeText={onChangeModelQuery}
            style={styles.input}
            placeholderTextColor="#979797"
          />
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Способ оплаты</Text>
          <EntitiesToggle
            leftLabel="Наличные"
            rightLabel="В кредит"
            value={paymentType}
            onChange={onChangePaymentType}
          />
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Цена, ₽</Text>
          <View style={styles.inputsRow}>
            <TextInput
              placeholder="От"
              keyboardType="numeric"
              value={priceFromText}
              onChangeText={onChangePriceFromText}
              style={[styles.input, styles.inputHalf]}
              placeholderTextColor="#979797"
            />
            <TextInput
              placeholder="До"
              keyboardType="numeric"
              value={priceToText}
              onChangeText={onChangePriceToText}
              style={[styles.input, styles.inputHalf]}
              placeholderTextColor="#979797"
            />
          </View>
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Год выпуска</Text>
          <View style={styles.inputsRow}>
            <TextInput
              placeholder="От 2000"
              keyboardType="numeric"
              value={yearFromText}
              onChangeText={(t) => onChangeYearFromText(onlyDigits(t).slice(0, 4))}
              style={[styles.input, styles.inputHalf]}
              placeholderTextColor="#979797"
            />
            <TextInput
              placeholder="До 2026"
              keyboardType="numeric"
              value={yearToText}
              onChangeText={(t) => onChangeYearToText(onlyDigits(t).slice(0, 4))}
              style={[styles.input, styles.inputHalf]}
              placeholderTextColor="#979797"
            />
          </View>
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Пробег, км</Text>
          <MileageRangePicker
            fromText={mileageFromText}
            toText={mileageToText}
            onChangeFromText={onChangeMileageFromText}
            onChangeToText={onChangeMileageToText}
          />
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}></Text>
          <View style={styles.marksRow}>
            <MarkButton label="Со скидками" selected={hasDiscount} onToggle={onToggleHasDiscount} />
            <MarkButton label="Возврат НДС" selected={vatReturn} onToggle={onToggleVatReturn} />
            <MarkButton label="Предложение недели" selected={weeklyOffer} onToggle={onToggleWeeklyOffer} />
          </View>
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Кузов</Text>
          <View style={styles.marksRow}>
            {["Седан", "Кроссовер", "Хэтчбек"].map((m) => (
              <MarkButton
                key={m}
                label={m}
                selected={bodyTypes.includes(m)}
                onToggle={() => onToggleBodyType(m)}
              />
            ))}
          </View>
        </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: { flex: 1 },
  content: {
    padding: 16,
    paddingBottom: 16,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 12,
  },
  backBtnText: {
    color: "#DB4431",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  filtersTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  filterBlock: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  inputsRow: {
    flexDirection: "row",
    gap: 8,
  },
  inputHalf: {
    flex: 1,
  },
  marksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
