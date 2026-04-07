import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropdownIcon from "../../../assets/icons/dropdown.svg";
import { shadowStyle } from "../../../shared/theme/shadow";

export type PtsType = "original" | "nonOriginal";

export type PtsFormState = {
  vin: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  engineVolume: string;
  ptsType: PtsType;
  hasElectronicPts: boolean;
};

type Props = {
  value: PtsFormState;
  onChange: (next: PtsFormState) => void;
};

function Radio({
  checked,
  label,
  onPress,
}: {
  checked: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.radioRowItem}>
      <View
        style={[
          styles.radioOuter,
          checked ? { borderColor: "#DB4431" } : { borderColor: "#6B757C" },
        ]}
      >
        {checked ? <View style={styles.radioInner} /> : null}
      </View>
      <Text style={checked ? styles.radioLabelActive : styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function DropdownLikeInput({
  value,
  placeholder,
  onChangeText,
}: {
  value: string;
  placeholder: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View style={styles.dropdownWrap}>
      <TextInput
        style={styles.dropdownInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#00000080"
      />
      <View style={styles.dropdownIconWrap}>
        <DropdownIcon width={14} height={14} />
      </View>
    </View>
  );
}

export function PtsForm({ value, onChange }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Заполните данные из ПТС</Text>

      <View style={styles.field}>
        <Text style={styles.label}>VIN</Text>
        <TextInput
          style={styles.input}
          value={value.vin}
          onChangeText={(t) => onChange({ ...value, vin: t })}
          placeholder="Введите VIN"
          placeholderTextColor="#00000040"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Марка</Text>
        <TextInput
          style={styles.input}
          value={value.brand}
          onChangeText={(t) => onChange({ ...value, brand: t })}
          placeholder="Укажите марку"
          placeholderTextColor="#00000040"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Модель</Text>
        <TextInput
          style={styles.input}
          value={value.model}
          onChangeText={(t) => onChange({ ...value, model: t })}
          placeholder="Укажите модель"
          placeholderTextColor="#00000040"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Год выпуска</Text>
        <DropdownLikeInput
          value={value.year}
          placeholder="Укажите год выпуска"
          onChangeText={(t) => onChange({ ...value, year: t })}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Цвет</Text>
        <DropdownLikeInput
          value={value.color}
          placeholder="Укажите цвет"
          onChangeText={(t) => onChange({ ...value, color: t })}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Объём двигателя</Text>
        <DropdownLikeInput
          value={value.engineVolume}
          placeholder="Укажите объём двигателя"
          onChangeText={(t) =>
            onChange({ ...value, engineVolume: t })
          }
        />
      </View>

      <View style={styles.radioGroup}>
        <Text style={styles.label}>ПТС</Text>
        <View style={styles.radioRow}>
          <Radio
            checked={value.ptsType === "original"}
            label="Оригинал"
            onPress={() => onChange({ ...value, ptsType: "original" })}
          />
          <Radio
            checked={value.ptsType === "nonOriginal"}
            label="Неоригинал"
            onPress={() => onChange({ ...value, ptsType: "nonOriginal" })}
          />
        </View>
      </View>

      <View style={styles.radioGroup}>
        <Text style={styles.label}>Электронный ПТС</Text>
        <View style={styles.radioRow}>
          <Radio
            checked={value.hasElectronicPts === true}
            label="Есть"
            onPress={() => onChange({ ...value, hasElectronicPts: true })}
          />
          <Radio
            checked={value.hasElectronicPts === false}
            label="Нет"
            onPress={() => onChange({ ...value, hasElectronicPts: false })}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    ...(shadowStyle({
      boxShadow: "0px 4px 10px rgba(0,0,0,0.04)",
      shadowColor: "#000000",
      shadowOpacity: 0.04,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    }) as object),
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E1E1E",
    marginBottom: 12,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E1E1E",
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 14,
    color: "#1E1E1E",
    fontSize: 14,
  },
  dropdownWrap: {
    position: "relative",
  },
  dropdownInput: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 14,
    paddingRight: 32,
    color: "#1E1E1E",
    fontSize: 14,
  },
  dropdownIconWrap: {
    position: "absolute",
    right: 12,
    top: 16,
    opacity: 0.7,
  },
  radioGroup: {
    marginTop: 12,
    marginBottom: 4,
  },
  radioRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-start",
  },
  radioRowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#DB4431",
  },
  radioLabel: {
    fontSize: 14,
    color: "#6B757C",
    fontWeight: "600",
  },
  radioLabelActive: {
    fontSize: 14,
    color: "#DB4431",
    fontWeight: "700",
  },
});

