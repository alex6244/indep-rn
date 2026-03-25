import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import SchemeSvg from "../../../assets/auto/scheme.svg";
import OrangePlusIcon from "../../../assets/icons/orange-plus.svg";

export type DefectsMode = "scheme" | "photos";

export type DamageDraft = {
  id: string;
  description: string;
};

export type DefectsState = {
  mode: DefectsMode;
  damages: DamageDraft[];
  activeDamageId: string;
};

type Props = {
  value: DefectsState;
  onChange: (next: DefectsState) => void;
};

function TabButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.tabBtn, active ? styles.tabBtnActive : styles.tabBtnInactive]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, active ? styles.tabTextActive : styles.tabTextInactive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function DefectsForm({ value, onChange }: Props) {
  const active = value.damages.find((d) => d.id === value.activeDamageId) ?? value.damages[0];

  const updateActive = (description: string) => {
    const nextDamages = value.damages.map((d) =>
      d.id === active.id ? { ...d, description } : d,
    );
    onChange({ ...value, damages: nextDamages });
  };

  const addDamage = () => {
    const newDamage: DamageDraft = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      description: "",
    };
    const nextDamages = [...value.damages, newDamage];
    onChange({
      ...value,
      damages: nextDamages,
      activeDamageId: newDamage.id,
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Дефекты</Text>

      <View style={styles.schemeWrap}>
        {value.mode === "scheme" ? (
          <View style={styles.schemeInner}>
            {/* Decorative illustration */}
            <SchemeSvg width="100%" height={140} />
          </View>
        ) : (
          <View style={styles.photosPlaceholder}>
            <Text style={styles.photosPlaceholderText}>
              Фото повреждений (заглушка)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.descriptionBox}>
        <TextInput
          style={styles.descriptionInput}
          value={active?.description ?? ""}
          onChangeText={updateActive}
          placeholder="Опишите повреждение"
          placeholderTextColor="#00000040"
          multiline
        />
      </View>

      <TouchableOpacity activeOpacity={0.9} style={styles.addDamageBtn} onPress={addDamage}>
        <OrangePlusIcon width={14} height={14} />
        <Text style={styles.addDamageText}>Добавить ещё повреждение</Text>
      </TouchableOpacity>

      <View style={styles.tabsRow}>
        <TabButton
          active={value.mode === "scheme"}
          label="Схема повреждений"
          onPress={() => onChange({ ...value, mode: "scheme" })}
        />
        <TabButton
          active={value.mode === "photos"}
          label="Фото повреждений"
          onPress={() => onChange({ ...value, mode: "photos" })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E1E1E",
    marginBottom: 12,
  },
  schemeWrap: {
    borderRadius: 14,
    overflow: "hidden",
  },
  schemeInner: {
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  photosPlaceholder: {
    height: 90,
    borderRadius: 14,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
  },
  photosPlaceholderText: {
    fontSize: 12,
    color: "#6B757C",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#DEDEDE",
    marginVertical: 12,
  },
  descriptionBox: {
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    padding: 12,
    minHeight: 72,
  },
  descriptionInput: {
    minHeight: 42,
    fontSize: 14,
    color: "#1E1E1E",
  },
  addDamageBtn: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: "#F3E4E2",
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addDamageText: {
    fontSize: 14,
    color: "#DB4431",
    fontWeight: "800",
  },
  tabsRow: {
    flexDirection: "row",
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: "#DB4431",
  },
  tabBtnInactive: {
    backgroundColor: "#F7F7F7",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabTextInactive: {
    color: "#6B757C",
  },
});

