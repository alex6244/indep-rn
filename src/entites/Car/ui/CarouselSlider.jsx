import React, { useRef } from 'react';
import { View, Image, Text, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { styles } from './CarouselSlider.styles';

export const CarouselSlider = ({ cars }) => {
  const carouselRef = useRef();
  const { width: screenWidth } = Dimensions.get('window');

  const renderCar = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.brand} {item.model}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={cars}
        renderItem={renderCar}
        sliderWidth={screenWidth}
        itemWidth={screenWidth * 0.9}
        loop={true}
        autoplay={true}
        autoplayInterval={5000}
      />
    </View>
  );
};
