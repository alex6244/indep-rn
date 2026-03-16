import React, { useRef, useState } from 'react';
import { View, Image, Text } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { styles } from './CarouselSlider.styles';
import { Dimensions } from 'react-native';

export const CarouselSlider = ({ cars }) => {
  const carouselRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);
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
        onSnapToItem={(index) => setActiveIndex(index)}
      />
    </View>
  );
};
