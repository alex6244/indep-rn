import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Header } from '../widgets/header/Header';
import { CarouselSlider } from '../entites/Car/ui/CarouselSlider';
import { MobileMenu } from '../widgets/mobileMenu/MobileMenu';

const mockCars = [
  { id: 1, brand: 'BMW', model: 'X5', image: 'https://via.placeholder.com/300' },
  { id: 2, brand: 'Audi', model: 'Q7', image: 'https://via.placeholder.com/300' },
];

const Home = ({ navigation }) => {
  const [activeMenu, setActiveMenu] = useState('home');

  const handleMenuPress = (key) => {
    setActiveMenu(key);
    // navigation?.navigate(key); // сюда потом привяжешь реальные роуты
  };

  return (
    <View style={styles.root}>
      <Header title="Каталог" />

      <ScrollView contentContainerStyle={styles.content}>
        <CarouselSlider cars={mockCars} />
      </ScrollView>

      <MobileMenu active={activeMenu} onPress={handleMenuPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});

export default Home;

