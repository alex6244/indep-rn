import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import { typography } from "../../../shared/theme/typography";

type Props = {
  placeholder: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
  containerStyle?: StyleProp<ViewStyle>;
};

function ChevronDown() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Path
        fill={colors.text.subtle}
        d="M3.47 6.153a.75.75 0 0 1 1.06 0L8 9.623l3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06Z"
      />
    </Svg>
  );
}

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.radio, selected && styles.radioActive]}>
      {selected && <View style={styles.radioDot} />}
    </View>
  );
}

export function FilterSelectDropdown({
  placeholder,
  options,
  value,
  onChange,
  containerStyle,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt: string) => {
    onChange(opt === value ? null : opt);
    setOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.trigger, containerStyle]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={value ?? placeholder}
      >
        <Text style={value ? styles.triggerTextActive : styles.triggerTextPlaceholder}>
          {value ?? placeholder}
        </Text>
        <ChevronDown />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetTitle}>{placeholder}</Text>

          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ selected: item === value }}
              >
                <Text style={[styles.optionText, item === value && styles.optionTextActive]}>
                  {item}
                </Text>
                <RadioCircle selected={item === value} />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          {value && (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => { onChange(null); setOpen(false); }}
            >
              <Text style={styles.resetText}>Сбросить</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.control.inputBg,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    paddingVertical: spacing.sm,
  },
  triggerTextPlaceholder: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.control.inputPlaceholder,
    flex: 1,
  },
  triggerTextActive: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.backdrop,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.muted,
    alignSelf: "center",
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  sheetTitle: {
    ...typography.title,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  optionText: {
    ...typography.textRegular,
    fontSize: 15,
    color: colors.text.primary,
    flex: 1,
  },
  optionTextActive: {
    color: colors.brand.primary,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.subtle,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border.input,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: colors.brand.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand.primary,
  },
  resetBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  resetText: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.brand.primary,
    fontWeight: "600",
  },
});
