declare module "react-native-snap-carousel" {
  import { Component } from "react";
  import { StyleProp, ViewStyle } from "react-native";

  export interface CarouselProps<T> {
    data: T[];
    renderItem: (info: { item: T; index: number }) => React.ReactNode;
    sliderWidth: number;
    itemWidth: number;
    loop?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    firstItem?: number;
    inactiveSlideScale?: number;
    inactiveSlideOpacity?: number;
    containerCustomStyle?: StyleProp<ViewStyle>;
    contentContainerCustomStyle?: StyleProp<ViewStyle>;
    onSnapToItem?: (index: number) => void;
    ref?: React.Ref<Carousel<T>>;
  }

  export default class Carousel<T> extends Component<CarouselProps<T>> {
    snapToItem(index: number, animated?: boolean): void;
    snapToNext(animated?: boolean): void;
    snapToPrev(animated?: boolean): void;
    currentIndex: number;
  }
}
