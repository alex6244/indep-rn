import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { FiltersModal } from '../../features/filters/ui/FiltersModal';
import { FavoriteButton } from '../../features/favorites/ui/FavoriteButton';
import { MarkButton } from '../../features/filters/ui/MarkButton';
import { RangeSlider } from '../../shared/ui/RangeSlider';
import { EntitiesToggle } from '../entitiesToggle/EntitiesToggle';

export const Header = ({ title = 'Каталог' }) => {
  const [burgerOpen, setBurgerOpen] = useState(false);

  const closeBurger = () => setBurgerOpen(false);

  return (
    <>
      <SafeAreaView>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => setBurgerOpen(true)}>
            <Text style={styles.burger}>≡</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>

          <View style={styles.right}>
            <FiltersModal>
              {(close) => (
                <>
                  <View style={styles.marksRow}>
                    {['BMW', 'Audi', 'Mercedes'].map((m) => (
                      <MarkButton key={m} label={m} />
                    ))}
                  </View>

                  <RangeSlider
                    label="Цена"
                    min={0}
                    max={50000}
                    initial={20000}
                  />

                  <EntitiesToggle />
                </>
              )}
            </FiltersModal>

            <FavoriteButton />
          </View>
        </View>
      </SafeAreaView>

      <Modal
        transparent
        visible={burgerOpen}
        animationType="fade"
        onRequestClose={closeBurger}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeBurger}
        >
          <View
            style={styles.menu}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.menuItem} onPress={closeBurger}>
              Обратная связь
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  burger: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-start',
  },
  menu: {
    backgroundColor: '#fff',
    padding: 16,
    width: '80%',
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 8,
  },
  marksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginTop: 12,
  },
});

