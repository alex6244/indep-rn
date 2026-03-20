import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const EntitiesToggle = ({
  leftLabel = 'Хочу продать авто',
  rightLabel = 'Хочу купить авто',
  activeColor = '#080717',
  value,
  onChange,
}) => {
  const [tab, setTab] = useState('right');

  const isControlled = value !== undefined;
  const activeTab = isControlled
    ? value === 'cash'
      ? 'left'
      : value === 'credit'
        ? 'right'
        : null
    : tab;

  const activeBg = activeColor;
  const activeText = '#FFFFFF';
  const inactiveText = '#080717';

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            activeTab === 'left' && { backgroundColor: activeBg },
          ]}
          onPress={() => {
            if (isControlled) {
              onChange?.('cash');
              return;
            }
            setTab('left');
          }}
        >
          <Text
            style={[
              styles.text,
              {
                color: activeTab === 'left' ? activeText : inactiveText,
              },
            ]}
          >
            {leftLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            activeTab === 'right' && { backgroundColor: activeBg },
          ]}
          onPress={() => {
            if (isControlled) {
              onChange?.('credit');
              return;
            }
            setTab('right');
          }}
        >
          <Text
            style={[
              styles.text,
              {
                color: activeTab === 'right' ? activeText : inactiveText,
              },
            ]}
          >
            {rightLabel}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'left' && (
        <View style={styles.content}>
          <Text>{leftLabel}</Text>
        </View>
      )}

      {activeTab === 'right' && (
        <View style={styles.content}>
          <Text>{rightLabel}</Text>
        </View>
      )}
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
  content: {
    marginTop: 12,
  },
});

