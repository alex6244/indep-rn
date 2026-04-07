/** @deprecated Legacy screen. Do not use for new routes. */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Header } from '../widgets/header/Header';
import { CarouselSlider } from '../entites/Car/ui/CarouselSlider';

const mockCars = [
  { id: 1, brand: 'BMW', model: 'X5', image: 'https://via.placeholder.com/300' },
  { id: 2, brand: 'Audi', model: 'Q7', image: 'https://via.placeholder.com/300' },
];

const Home = () => {
  return (
    <View style={styles.root}>
      <Header title="Каталог" rightAction="none" />

      <ScrollView contentContainerStyle={styles.content}>
        <CarouselSlider cars={mockCars} />
      </ScrollView>
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
