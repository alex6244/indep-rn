// components/ImageCarousel.jsx
import React from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const ImageCarousel = ({
  images,
  style,
}: {
  images: string[];
  style?: any;
}) => {
  const renderImage = ({ item }: { item: string }) => (
    <View style={styles.slide}>
      <Image
        source={{ uri: item.startsWith("http") ? item : `assets/img/${item}` }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  const keyExtractor = (item: string, index: number) => `image-${index}`;

  return (
    <FlatList
      data={images}
      renderItem={renderImage}
      keyExtractor={keyExtractor}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      bounces={false}
      style={[styles.carousel, style]}
      contentContainerStyle={styles.carouselContent}
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    borderRadius: 24,
    overflow: "hidden",
  },
  carouselContent: {
    paddingBottom: 8,
  },
  slide: {
    width: screenWidth - 80,
    height: 180,
    marginHorizontal: 8,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
});

export default ImageCarousel;
