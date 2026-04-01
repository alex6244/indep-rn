import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { type Href, useRouter } from "expo-router";
import { Image } from "expo-image";
import Logo from "../assets/logo.svg";
import ParameterIcon from "../assets/mainpage/carousel/parameter.svg";
import TimeIcon from "../assets/mainpage/carousel/time.svg";
import ReportIcon from "../assets/mainpage/carousel/report.svg";
import SellerStep1 from "../assets/mainpage/manual/seller/1.svg";
import { useProtected } from "../hooks/useProtected";
import { FONT_FAMILY } from "../shared/theme/fonts";

/** Legacy full-page marketing layout (formerly root `/`). Open via `/landing`. */
export default function LandingPage() {
  const router = useRouter();
  const { user, checkAuth } = useProtected();

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Logo width={120} height={32} />
          <View style={styles.searchContainer}>
            <Text style={styles.searchPlaceholder}>Поиск по объявлениям</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/(tabs)/catalog" as Href)}
          >
            <Text style={styles.headerLink}>Каталог</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/selection" as Href)}
          >
            <Text style={styles.headerLink}>Подбор авто</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              if (!user) {
                router.push("/(auth)" as Href);
                return;
              }
              router.push("/(tabs)/profile" as Href);
            }}
          >
            <Text style={styles.headerLink}>
              {user ? "Профиль" : "Войти"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HERO / MAIN BANNER */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require("../assets/chat/bg.jpg")}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
          >
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>
                <Text style={styles.heroTitleAccent}>Честный </Text>
                подбор — спокойная покупка
              </Text>
              <Text style={styles.heroSubtitle}>
                Подберём автомобиль без скрытых проблем и переплат.
                Проверяем технику, историю и документы. Вы получаете честный
                результат и спокойствие при покупке.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push("/(tabs)/catalog" as Href)}
              >
                <Text style={styles.primaryButtonText}>
                  Перейти в каталог авто
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* 3 ПРЕИМУЩЕСТВА (КАРУСЕЛЬ В HTML, СТАТИЧНЫЕ КАРТЫ ЗДЕСЬ) */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCards}
          >
            <View style={styles.benefitCard}>
              <ParameterIcon width={32} height={32} />
              <Text style={styles.benefitTitle}>
                Проверка по 100+ параметрам
              </Text>
              <Text style={styles.benefitText}>
                Тщательно проверяем состояние, документы и прошлую эксплуатацию.
              </Text>
            </View>

            <View style={styles.benefitCard}>
              <TimeIcon width={32} height={32} />
              <Text style={styles.benefitTitle}>
                Экономия времени и денег
              </Text>
              <Text style={styles.benefitText}>
                Берём на себя поиск, переговоры и торг, снижая цену авто.
              </Text>
            </View>

            <View style={styles.benefitCard}>
              <ReportIcon width={32} height={32} />
              <Text style={styles.benefitTitle}>Прозрачные отчёты</Text>
              <Text style={styles.benefitText}>
                Подробный фото‑ и видеоотчёт по каждому варианту.
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* ПЕРЕКЛЮЧАТЕЛЬ "ПРОДАТЬ / КУПИТЬ" (СТАТИЧЕСКИЙ ВАРИАНТ) */}
        <View style={styles.section}>
          <View style={styles.toggleContainer}>
            <View style={[styles.toggleButton, styles.toggleButtonActive]}>
              <Text style={[styles.toggleButtonText, styles.toggleButtonTextActive]}>Хочу продать авто</Text>
            </View>
            <View style={styles.toggleButton}>
              <Text style={styles.toggleButtonText}>Хочу купить авто</Text>
            </View>
          </View>

          {/* Список шагов (продать авто) — можно сделать двумя массивами и переключать по стейту */}
          <View style={styles.stepsGrid}>
            <View style={styles.stepCard}>
              <View style={styles.stepImage}>
                <SellerStep1 width="100%" height="100%" />
              </View>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepTitle}>
                Оставьте заявку на оценку автомобиля
              </Text>
              <Text style={styles.stepText}>
                Специалист свяжется с вами, чтобы согласовать время и формат
                оценки.
              </Text>
            </View>

            {/* Добавь остальные шаги по аналогии */}
          </View>
        </View>

        {/* БЛОК "ЛУЧШИЕ ПРЕДЛОЖЕНИЯ" */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Лучшие предложения</Text>

          <View style={styles.carsGrid}>
            <TouchableOpacity
              style={styles.carCard}
              onPress={() =>
                router.push("/auto/1" as Href)
              }
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carImagesRow}
              >
                <Image
                  source={require("../assets/cars1.jpg")}
                  style={styles.carImage}
                  contentFit="cover"
                />
                <Image
                  source={require("../assets/cars2.jpg")}
                  style={styles.carImage}
                  contentFit="cover"
                />
              </ScrollView>

              <View style={styles.carInfo}>
                <View style={styles.carPriceRow}>
                  <Text style={styles.carPrice}>6 700 000 ₽</Text>
                  <Text style={styles.carMileage}>200 000 км</Text>
                </View>
                <Text style={styles.carName}>
                  Mercedes‑Benz GLC AMG 43 AMG II (X254)
                </Text>
                <Text style={styles.carDetails}>
                  Active · 1,2 л (115 л.с.) · 6MT · 2WD · 2025 г.
                </Text>
              </View>

              <View style={styles.carButtonsRow}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => {
                    if (
                      !checkAuth({
                        message: "Авторизуйтесь, чтобы купить отчёт по авто",
                      })
                    ) {
                      return;
                    }
                    // TODO: сюда добавить реальную логику покупки
                  }}
                >
                  <Text style={styles.primaryButtonText}>Купить отчёт</Text>
                </TouchableOpacity>
                <View style={styles.favButton}>
                  <Text>★</Text>
                </View>
              </View>

              <View style={styles.carAddressRow}>
                <Text style={styles.carAddress}>
                  г. Москва, ул. Волкова
                </Text>
              </View>
            </TouchableOpacity>

            {/* Остальные карточки авто по аналогии */}
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 16 }]}
            onPress={() => router.push("/(tabs)/catalog" as Href)}
          >
            <Text style={styles.primaryButtonText}>Смотреть все</Text>
          </TouchableOpacity>
        </View>

        {/* Дальше можно адаптировать блоки "Что проверяют подборщики",
            "Как выглядит результат подбора", "Стоимость услуг" и т.д.
            — по тому же принципу: View + Text + Image + ScrollView */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DEDEDE",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    height: 32,
    width: 120,
  },
  searchContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchPlaceholder: {
    fontSize: 12,
    color: "#979797",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerLink: {
    fontSize: 14,
    color: "#080717",
    fontFamily: FONT_FAMILY.button,
  },
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  heroContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  heroBackground: {
    height: 320,
    borderRadius: 16,
    overflow: "hidden",
  },
  heroBackgroundImage: {
    borderRadius: 16,
  },
  heroOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  heroTitle: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 12,
  },
  heroTitleAccent: {
    color: "#DB4431",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#F5F5F5",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#DB4431",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
    fontFamily: FONT_FAMILY.button,
  },

  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1E1E1E",
  },

  horizontalCards: {
    gap: 12,
  },
  benefitCard: {
    width: 220,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    padding: 12,
  },
  benefitIcon: {
    height: 32,
    width: 32,
    marginBottom: 8,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 11,
    color: "#555",
  },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    padding: 4,
    borderRadius: 18,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#080717",
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#080717",
    fontFamily: FONT_FAMILY.button,
  },
  toggleButtonTextActive: {
    color: "#FFFFFF",
  },

  stepsGrid: {
    marginTop: 16,
    gap: 12,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  stepImage: {
    height: 120,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: "#F7F7F7",
  },
  stepNumber: {
    backgroundColor: "#F3E4E2",
    color: "#DB4431",
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  stepText: {
    fontSize: 11,
    color: "#555",
  },

  carsGrid: {
    marginTop: 12,
    gap: 16,
  },
  carCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    padding: 12,
  },
  carImagesRow: {
    gap: 8,
  },
  carImage: {
    height: 140,
    width: 200,
    borderRadius: 12,
  },
  carInfo: {
    marginTop: 8,
    gap: 4,
  },
  carPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carPrice: {
    fontSize: 20,
    fontWeight: "600",
  },
  carMileage: {
    fontSize: 11,
    color: "#FFFFFF",
    backgroundColor: "#DB4431",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  carName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1E1E1E",
  },
  carDetails: {
    fontSize: 11,
    color: "#777",
  },
  carButtonsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 8,
  },
  favButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
  },
  carAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  carAddress: {
    fontSize: 10,
    color: "#555",
  },
});
