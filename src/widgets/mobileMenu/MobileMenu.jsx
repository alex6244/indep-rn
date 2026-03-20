import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CallIcon from "../../assets/icons/mobilemenu/callpin.svg";
import CatalogIcon from "../../assets/icons/mobilemenu/catalogpin.svg";
import HomeIcon from "../../assets/icons/mobilemenu/homepin.svg";
import ProfileIcon from "../../assets/icons/mobilemenu/profilepin.svg";

const iconsMap = {
  home: HomeIcon,
  catalog: CatalogIcon,
  call: CallIcon,
  profile: ProfileIcon,
};

const items = [
  { label: 'Главная', key: 'home' },
  { label: 'Каталог', key: 'catalog' },
  { label: 'Позвонить', key: 'call' },
  { label: 'Профиль', key: 'profile' },
];

export const MobileMenu = ({ active = 'home', onPress }) => {
  // Отключаем legacy нижнюю панель (MobileMenu).
  // Навигацию оставляем через Expo Router Tabs из `src/app/(tabs)/_layout.tsx`.
  return null;
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
  iconWrapper: {
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
  },
});

