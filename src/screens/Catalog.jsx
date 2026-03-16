import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';
import { Header } from '../widgets/header/Header';
import { MobileMenu } from '../widgets/mobileMenu/MobileMenu';
import { FavoriteButton } from '../features/favorites/ui/FavoriteButton';
import { RangeSlider } from '../shared/ui/RangeSlider';
import { EntitiesToggle } from '../widgets/entitiesToggle/EntitiesToggle';
import { MarkButton } from '../features/filters/ui/MarkButton';
import { useFavorites } from '../contexts/FavoritesContext';
import { cars as catalogCars } from '../data/cars';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Catalog = ({ navigation }) => {
  const { isFavorite, setFavorite } = useFavorites();
  const [activeMenu, setActiveMenu] = useState('home');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const openFilters = () => {
    setFiltersOpen(true);
    Animated.timing(filtersX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFilters = () => {
    Animated.timing(filtersX, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setFiltersOpen(false));
  };

  const handleBottomMenu = (key) => {
    setActiveMenu(key);
    // navigation?.navigate(key); // сюда подвяжешь реальные роуты
  };

  return (
    <View style={styles.root}>
      <Header title="Каталог" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Хлебные крошки */}
        <View style={styles.breadcrumbs}>
          <Text style={styles.breadcrumbText}>Главная {'>'} Каталог</Text>
        </View>

        {/* Полоса фильтров над списком */}
        <View style={styles.filtersBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {/* сортировка */}
            <View style={styles.sortButton}>
              <Text style={styles.sortIcon}>⇅</Text>
            </View>

            {/* кнопка "Все фильтры" */}
            <TouchableOpacity
              style={styles.allFiltersButton}
              onPress={openFilters}
            >
              <Text style={styles.allFiltersText}>Все фильтры</Text>
            </TouchableOpacity>

            {/* активные фильтры – просто чипы */}
            {['от 2023 до 2025 г.', 'Со скидками', 'Седан'].map((label) => (
              <View key={label} style={styles.filterChip}>
                <Text style={styles.filterChipText}>{label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Заголовок списка */}
        <Text style={styles.sectionTitle}>Лучшие предложения</Text>

        {/* Список машин */}
        <View style={styles.carsGrid}>
          {catalogCars.map((car) => (
            <View key={car.id} style={styles.carCard}>
              {/* Карусель фоток (простая прокрутка) */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.carImagesScroll}
              >
                {car.images.map((uri, idx) => (
                  <Image
                    key={idx}
                    source={{ uri }}
                    style={styles.carImage}
                  />
                ))}
              </ScrollView>

              {/* Инфо по машине */}
              <View style={styles.carInfo}>
                <View style={styles.carPriceRow}>
                  <Text style={styles.carPrice}>
                    {new Intl.NumberFormat("ru-RU").format(car.price)} ₽
                  </Text>
                  <Text style={styles.carMileage}>
                    {new Intl.NumberFormat("ru-RU").format(car.mileage)} км
                  </Text>
                </View>
                <Text style={styles.carTitle}>{car.title}</Text>
                <Text style={styles.carSub}>
                  {car.engine} л ({car.power} л.с.) {car.driveType} - {car.year} г.
                </Text>
              </View>

              {/* Кнопки */}
              <View style={styles.carButtonsRow}>
                <TouchableOpacity style={[styles.btn, styles.btnPrimary, { flex: 1 }]}>
                  <Text style={styles.btnTextPrimary}>Купить отчет</Text>
                </TouchableOpacity>
                <FavoriteButton
                  initialActive={isFavorite(String(car.id))}
                  onChange={(next) => setFavorite(String(car.id), next)}
                />
              </View>

              <Text style={styles.carAddress}>{car.address}</Text>
            </View>
          ))}
        </View>

        {/* CTA "Смотреть все" */}
        <TouchableOpacity style={[styles.btn, styles.btnPrimary, styles.seeAllBtn]}>
          <Text style={styles.btnTextPrimary}>Смотреть все</Text>
        </TouchableOpacity>

        {/* Простой футер */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>INDEP</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Каталог</Text>
            <Text style={styles.footerLink}>Подбор авто</Text>
            <Text style={styles.footerLink}>Сотрудничество</Text>
            <Text style={styles.footerLink}>О нас</Text>
          </View>
          <Text style={styles.footerCopyright}>
            Все права защищены. ООО EXAMPLE.
          </Text>
        </View>
      </ScrollView>

      {/* Панель фильтров поверх всего */}
      {filtersOpen && (
        <View style={styles.filtersOverlay} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.filtersBackdrop}
            activeOpacity={1}
            onPress={closeFilters}
          />
          <Animated.View
            style={[
              styles.filtersPanel,
              { transform: [{ translateX: filtersX }] },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.filtersContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.filtersTitle}>Фильтры</Text>

              {/* Марка / Модель – вместо селектов просто инпуты */}
              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Автомобиль</Text>
                <TextInput
                  placeholder="Марка"
                  style={styles.input}
                  placeholderTextColor="#979797"
                />
                <TextInput
                  placeholder="Модель"
                  style={styles.input}
                  placeholderTextColor="#979797"
                />
              </View>

              {/* Наличные / В кредит */}
              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Способ оплаты</Text>
                <EntitiesToggle
                  leftLabel="Наличные"
                  rightLabel="В кредит"
                />
              </View>

              {/* Цена */}
              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Цена, ₽</Text>
                <View style={styles.inputsRow}>
                  <TextInput
                    placeholder="От"
                    keyboardType="numeric"
                    style={[styles.input, styles.inputHalf]}
                    placeholderTextColor="#979797"
                  />
                  <TextInput
                    placeholder="До"
                    keyboardType="numeric"
                    style={[styles.input, styles.inputHalf]}
                    placeholderTextColor="#979797"
                  />
                </View>
                <RangeSlider min={0} max={40_000_000} initial={10_000_000} />
              </View>

              {/* Год выпуска */}
              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Год выпуска</Text>
                <View style={styles.inputsRow}>
                  <TextInput
                    placeholder="От 2000"
                    keyboardType="numeric"
                    style={[styles.input, styles.inputHalf]}
                    placeholderTextColor="#979797"
                  />
                  <TextInput
                    placeholder="До 2026"
                    keyboardType="numeric"
                    style={[styles.input, styles.inputHalf]}
                    placeholderTextColor="#979797"
                  />
                </View>
              </View>

              {/* Пробег */}
              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Пробег, км</Text>
                <View style={styles.inputsRow}>
                  <TextInput
                    placeholder="От 0"
                    keyboardType="numeric"
                    style={[styles.input, styles.inputHalf]}
                    placeholderTextColor="#979797"
                  />
                  <TextInput
                    placeholder="До 400 000"
                    keyboardType="numeric"
                    style={[styles.input, styles.inputHalf]}
                    placeholderTextColor="#979797"
                  />
                </View>
              </View>

              {/* Тип кузова – марки как переключалки */}
              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Кузов</Text>
                <View style={styles.marksRow}>
                  {['Седан', 'Кроссовер', 'Хэтчбек'].map((m) => (
                    <MarkButton key={m} label={m} />
                  ))}
                </View>
              </View>

              {/* Особенности – просто список чекбоксов через MarkButton */}
              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Особенности</Text>
                <View style={styles.marksRow}>
                  {['Без ДТП', 'Отличное состояние', 'Маленький пробег', 'На гарантии'].map(
                    (m) => (
                      <MarkButton key={m} label={m} />
                    ),
                  )}
                </View>
              </View>
            </ScrollView>

            {/* Нижние кнопки панели фильтров */}
            <View style={styles.filtersBottom}>
              <Text style={styles.filtersFound}>Найдено 6158 объявлений</Text>
              <View style={styles.filtersButtonsRow}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnDark, styles.filtersBtnHalf]}
                  onPress={closeFilters}
                >
                  <Text style={styles.btnTextPrimary}>Сбросить все</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnPrimary, styles.filtersBtnHalf]}
                  onPress={closeFilters}
                >
                  <Text style={styles.btnTextPrimary}>Показать</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 140,
  },
  breadcrumbs: {
    marginBottom: 12,
  },
  breadcrumbText: {
    fontSize: 12,
    color: '#979797',
  },
  filtersBar: {
    marginBottom: 16,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sortIcon: {
    fontSize: 18,
    color: '#080717',
  },
  allFiltersButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#DB4431',
    marginRight: 8,
  },
  allFiltersText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    color: '#807E7E',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  carsGrid: {
    gap: 12,
  },
  carCard: {
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    padding: 12,
  },
  carImagesScroll: {
    marginBottom: 10,
  },
  carImage: {
    width: 220,
    height: 140,
    borderRadius: 16,
    marginRight: 8,
  },
  carInfo: {
    marginBottom: 8,
  },
  carPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 20,
    fontWeight: '600',
  },
  carMileage: {
    fontSize: 10,
    color: '#FFFFFF',
    backgroundColor: '#DB4431',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  carTitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  carSub: {
    fontSize: 12,
    color: '#808080',
  },
  carButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  carAddress: {
    fontSize: 10,
    marginTop: 6,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: '#DB4431',
  },
  btnDark: {
    backgroundColor: '#080717',
  },
  btnTextPrimary: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  seeAllBtn: {
    marginTop: 16,
  },
  footer: {
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#DEDEDE',
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  footerCopyright: {
    fontSize: 10,
    color: '#888',
  },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F7F7F7',
  },
  bottomCtaWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  filtersOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
  },
  filtersBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  filtersPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  filtersContent: {
    padding: 16,
    paddingBottom: 120,
  },
  filtersTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  filterBlock: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputHalf: {
    flex: 1,
  },
  marksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filtersBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  filtersFound: {
    fontSize: 12,
    color: '#979797',
    textAlign: 'center',
    marginBottom: 8,
  },
  filtersButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filtersBtnHalf: {
    flex: 1,
  },
});

export default Catalog;

