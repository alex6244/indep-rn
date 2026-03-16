import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const items = [
  { label: 'Главная', key: 'home' },
  { label: 'Чат', key: 'chat' },
  { label: 'Звонки', key: 'call' },
  { label: 'Профиль', key: 'profile' },
];

export const MobileMenu = ({ active = 'home', onPress }) => {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = item.key === active;
        const color = isActive ? '#DB4431' : '#A0A0A0';

        return (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            onPress={() => onPress?.(item.key)}
          >
            <Text style={[styles.icon, { color }]}>●</Text>
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
  },
});

