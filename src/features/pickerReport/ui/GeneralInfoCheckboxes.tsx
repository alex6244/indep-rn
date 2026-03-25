import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CheckIcon from "../../../assets/icons/badges/check.svg";

type Props = {
  value: Record<string, boolean>;
  onChange: (next: Record<string, boolean>) => void;
};

const ITEMS = [
  "ПТС оригинал",
  "Заводская оптика",
  "Юридически чиста",
  "Коробка, двигатель - без нареканий",
  "Тест-драйв - без нареканий",
  "Сухое подкапотное пространство",
  "Подвеска - без серьезных нареканий",
  "2 комплекта резины",
];

export function GeneralInfoCheckboxes({ value, onChange }: Props) {
  const toggle = (key: string) => {
    onChange({ ...value, [key]: !value[key] });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Заполните общую информацию</Text>

      {ITEMS.map((label) => {
        const checked = !!value[label];
        return (
          <TouchableOpacity
            key={label}
            activeOpacity={0.9}
            style={styles.row}
            onPress={() => toggle(label)}
          >
            <View
              style={[
                styles.box,
                checked && { backgroundColor: "#43C356", borderColor: "#43C356" },
              ]}
            >
              {checked ? <CheckIcon width={12} height={12} /> : null}
            </View>
            <Text style={styles.label}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
  },
  box: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  label: {
    fontSize: 14,
    color: "#1E1E1E",
    flex: 1,
  },
});

