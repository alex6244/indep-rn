import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const FiltersModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const openFilters = () => {
    setOpen(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeFilters = () => {
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  };

  const bgColor = open ? '#F3E4E2' : '#DB4431';
  const textColor = open ? '#DB4431' : '#FFFFFF';

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: bgColor }]}
        onPress={open ? closeFilters : openFilters}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>Фильтры</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.overlay} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={closeFilters}
          />
          <Animated.View
            style={[styles.panel, { transform: [{ translateX }] }]}
          >
            {typeof children === 'function' ? children(closeFilters) : children}
          </Animated.View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  panel: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 16,
  },
});

