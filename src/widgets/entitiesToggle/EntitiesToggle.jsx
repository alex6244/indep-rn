import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const EntitiesToggle = ({
  leftLabel = 'Хочу продать авто',
  rightLabel = 'Хочу купить авто',
  activeColor = '#080717',
}) => {
  const [tab, setTab] = useState('right');

  const activeBg = activeColor;
  const activeText = '#FFFFFF';
  const inactiveText = '#080717';

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            tab === 'left' && { backgroundColor: activeBg },
          ]}
          onPress={() => setTab('left')}
        >
          <Text
            style={[
              styles.text,
              { color: tab === 'left' ? activeText : inactiveText },
            ]}
          >
            {leftLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            tab === 'right' && { backgroundColor: activeBg },
          ]}
          onPress={() => setTab('right')}
        >
          <Text
            style={[
              styles.text,
              { color: tab === 'right' ? activeText : inactiveText },
            ]}
          >
            {rightLabel}
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'left' && (
        <View style={styles.content}>
          <Text>Контент для «Хочу продать авто»</Text>
        </View>
      )}

      {tab === 'right' && (
        <View style={styles.content}>
          <Text>Контент для «Хочу купить авто»</Text>
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

