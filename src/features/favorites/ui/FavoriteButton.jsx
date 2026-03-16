import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const FavoriteButton = ({ initialActive = false, onChange }) => {
  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    setActive(initialActive);
  }, [initialActive]);

  const toggle = () => {
    const next = !active;
    setActive(next);
    onChange?.(next);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={toggle} hitSlop={8}>
      <Text style={[styles.icon, active && styles.iconActive]}>
        {active ? '<3' : '</3'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  icon: {
    fontSize: 18,
    color: '#BFBFBF',
  },
  iconActive: {
    color: '#DB4431',
  },
});

