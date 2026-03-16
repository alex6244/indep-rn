import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const MarkButton = ({ label }) => {
  const [active, setActive] = useState(false);

  const bg = active ? '#DB4431' : '#F3F3F3';
  const color = active ? '#FFFFFF' : '#080717';

  return (
    <TouchableOpacity
      style={[styles.chip, { backgroundColor: bg }]}
      onPress={() => setActive((v) => !v)}
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

