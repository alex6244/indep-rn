import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import type { PaymentType } from '../../features/catalog/hooks/useCatalogFiltersController';
import { colors } from '../../shared/theme/colors';

type EntitiesToggleProps = {
  leftLabel?: string;
  rightLabel?: string;
  activeColor?: string;
  value?: PaymentType;
  onChange?: (value: PaymentType) => void;
};

export const EntitiesToggle = ({
  leftLabel = 'Хочу продать авто',
  rightLabel = 'Хочу купить авто',
  activeColor = colors.surface.inverse,
  value,
  onChange,
}: EntitiesToggleProps) => {
  const [tab, setTab] = useState<'left' | 'right'>('right');

  const isControlled = value !== undefined;
  const activeTab = isControlled
    ? value === 'cash'
      ? 'left'
      : value === 'credit'
        ? 'right'
        : null
    : tab;

  const activeText = colors.text.inverse;
  const inactiveText = colors.surface.inverse;

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            activeTab === 'left' && { backgroundColor: activeColor },
          ]}
          onPress={() => {
            if (isControlled) {
              onChange?.('cash');
              return;
            }
            setTab('left');
          }}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'left' }}
        >
          <Text
            style={[
              styles.text,
              { color: activeTab === 'left' ? activeText : inactiveText },
            ]}
          >
            {leftLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            activeTab === 'right' && { backgroundColor: activeColor },
          ]}
          onPress={() => {
            if (isControlled) {
              onChange?.('credit');
              return;
            }
            setTab('right');
          }}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'right' }}
        >
          <Text
            style={[
              styles.text,
              { color: activeTab === 'right' ? activeText : inactiveText },
            ]}
          >
            {rightLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 14,
  },
});
