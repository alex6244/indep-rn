import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageCarousel from '../../components/image-carousel';
import { Header } from "../widgets/header/Header";
import MicroBanner from "../assets/profile/microbanner.svg";

const Profile = () => {
  const stats = [
    { label: "Опубликовано объявлений", value: "120", icon: "reports.svg" },
    { label: "Ваш баланс", value: "2 000 ₽", icon: "wallet.svg" },
  ];

  const cars = [
    {
      price: "67 000 000 ₽",
      mileage: "200 000 км",
      title: "Mercedes-Benz GLC AMG 43 AMG II (X254)",
      subtitle: "Active - 1,2 л (115 л.с.) 6MT 2WD - 2025 г.",
      address: "г. Москва, ул. Волкова",
      images: ["cars1.jpg", "cars2.jpg", "cars1.jpg", "cars2.jpg"],
    },
    {
      price: "67 000 000 ₽",
      mileage: "200 000 км",
      title: "Mercedes-Benz GLC AMG 43 AMG II (X254)",
      subtitle: "Active - 1,2 л (115 л.с.) 6MT 2WD - 2025 г.",
      address: "г. Москва, ул. Волкова",
      images: ["cars1.jpg", "cars2.jpg", "cars1.jpg", "cars2.jpg"],
    },
    {
      price: "67 000 000 ₽",
      mileage: "200 000 км",
      title: "Mercedes-Benz GLC AMG 43 AMG II (X254)",
      subtitle: "Active - 1,2 л (115 л.с.) 6MT 2WD - 2025 г.",
      address: "г. Москва, ул. Волкова",
      images: ["cars1.jpg", "cars2.jpg", "cars1.jpg", "cars2.jpg"],
    },
  ];

  const navigateTo = (screen) => {
    console.log(`Navigate to ${screen}`);
  };

  return (
    <View style={styles.root}>
      <Header title="Профиль" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: "https://via.placeholder.com/80x80" }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Аркадий Паровозов</Text>
            <Text style={styles.profilePhone}>+7 995 185 88 90</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Image
              source={{ uri: "https://via.placeholder.com/32x32" }}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.statCard}
              onPress={() => navigateTo("stats")}
            >
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Image
                source={{ uri: `https://via.placeholder.com/64x64` }}
                style={[styles.statIcon, { zIndex: 1 }]}
              />
            </TouchableOpacity>
          ))}

          {/* Micro Banner */}
          {/* <TouchableOpacity
            style={styles.microBanner}
            onPress={() => navigateTo("reports")}
          >
            <Text style={styles.microText1}>
              Вы использовали 6 из 10 отчётов
            </Text>
            <Text style={styles.microText2}>Доступно: 4 отчёта</Text>
            <Text style={styles.microText3}>Пакет истекает 08.09.2027</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.microBanner} onPress={() => navigateTo("reports")}>
            <MicroBanner style={StyleSheet.absoluteFillObject} width="100%" height="100%" />
            <View style={styles.microContent}>
              <Text style={styles.microText1}>...</Text>
              <Text style={styles.microText2}>...</Text>
              <Text style={styles.microText3}>...</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Reports Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Купленные отчёты</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigateTo("newCar")}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/20x20" }}
                style={styles.plusIcon}
              />
              <Text style={styles.createButtonText}>Создать отчёт</Text>
            </TouchableOpacity>
          </View>

          {/* Cars List */}
          <View style={styles.carsGrid}>
            {cars.map((car, index) => (
              <TouchableOpacity
                key={index}
                style={styles.carCard}
                onPress={() => navigateTo("auto")}
              >
                <ImageCarousel images={car.images} style={styles.carousel} />

                <View style={styles.carInfo}>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{car.price}</Text>
                    <View style={styles.mileageBadge}>
                      <Text style={styles.mileage}>{car.mileage}</Text>
                    </View>
                  </View>

                  <Text style={styles.carTitle}>{car.title}</Text>
                  <Text style={styles.carSubtitle}>{car.subtitle}</Text>

                  <View style={styles.carButtons}>
                    <TouchableOpacity style={styles.buyButton}>
                      <Text style={styles.buyButtonText}>Купить отчет</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favButton}>
                      {/* Heart SVG будет здесь */}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.addressRow}>
                    <Image
                      source={{ uri: "https://via.placeholder.com/16x16" }}
                      style={styles.mapIcon}
                    />
                    <Text style={styles.address}>{car.address}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigateTo("catalog")}
          >
            <Text style={styles.viewAllText}>Смотреть все</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Custom Mobile Menu */}
      <View style={styles.customMobileMenu}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => navigateTo("newCar")}
        >
          <Image
            source={{ uri: "https://via.placeholder.com/20x20" }}
            style={styles.fabIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    paddingBottom: 140,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    padding: 20,
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    gap: 8,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
  },
  profilePhone: {
    fontSize: 20,
    color: "#B3B3B3",
  },
  editButton: {
    padding: 12,
  },
  editIcon: {
    width: 32,
    height: 32,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    minHeight: 120,
    padding: 20,
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    justifyContent: "space-between",
    position: "relative",
  },
  statLabel: {
    fontSize: 15,
    color: "#989898",
  },
  statValue: {
    fontSize: 40,
    fontWeight: "500",
  },
  statIcon: {
    position: "absolute",
    right: 8,
    bottom: 12,
    width: 64,
    height: 64,
  },
  microBanner: {
    flex: 2,
    backgroundColor: "#DB4431",
    borderRadius: 16,
    padding: 20,
    justifyContent: "center",
  },
  microText1: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  microText2: {
    fontSize: 28,
    marginBottom: 16,
    fontWeight: "600",
  },
  microText3: {
    fontSize: 14,
    opacity: 0.5,
  },
  section: {
    gap: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "600",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#080717",
    borderRadius: 16,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  plusIcon: {
    width: 20,
    height: 20,
  },
  carsGrid: {
    gap: 16,
  },
  carCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  carousel: {
    height: 180,
  },
  carInfo: {
    gap: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
  },
  mileageBadge: {
    backgroundColor: "#DB4431",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mileage: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  carTitle: {
    opacity: 0.8,
    fontSize: 16,
    fontWeight: "600",
  },
  carSubtitle: {
    opacity: 0.4,
    fontSize: 14,
  },
  carButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#DB4431",
    alignItems: "center",
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  favButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mapIcon: {
    width: 16,
    height: 16,
  },
  address: {
    fontSize: 12,
  },
  viewAllButton: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#DB4431",
    alignItems: "center",
  },
  viewAllText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  customMobileMenu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  fabButton: {
    position: "absolute",
    right: 20,
    top: -25,
    backgroundColor: "#DB4431",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  fabIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
});

export default Profile;
