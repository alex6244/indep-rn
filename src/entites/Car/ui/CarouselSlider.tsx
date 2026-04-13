import React, { useRef } from 'react';
import { View, Image, Text, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { styles } from './CarouselSlider.styles';

type CarItem = {
  image: string;
  brand: string;
  model: string;
};

type CarouselSliderProps = {
  cars: CarItem[];
};

export const CarouselSlider = ({ cars }: CarouselSliderProps) => {
  const carouselRef = useRef<Carousel<CarItem>>(null);
  const { width: screenWidth } = Dimensions.get('window');

  const renderCar = ({ item }: { item: CarItem }) => (
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
