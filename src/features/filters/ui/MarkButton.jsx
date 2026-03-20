import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const MarkButton = ({ label, selected, onToggle }) => {
  const [active, setActive] = useState(false);

  const isControlled = selected !== undefined;
  const isActive = isControlled ? selected : active;

  const bg = isActive ? '#DB4431' : '#F3F3F3';
  const color = isActive ? '#FFFFFF' : '#080717';

  return (
    <TouchableOpacity
      style={[styles.chip, { backgroundColor: bg }]}
      onPress={() => {
        if (!isControlled) setActive((v) => !v);
        onToggle?.();
      }}
    >
      <Text style={{ color }}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
});

