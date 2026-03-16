import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { useFavorites } from "../contexts/FavoritesContext";
import { useProtected } from "../hooks/useProtected";

const mockReports = [
  {
    id: "1",
    price: "67 000 000 ₽",
    mileage: "200 000 км",
    title: "Mercedes-Benz GLC AMG 43 AMG II (X254)",
    info: "Active - 1,2 л (115 л.с.) 6MT 2WD - 2025 г.",
    address: "г. Москва, ул. Волкова",
    images: [
      require("../assets/cars1.jpg"),
      require("../assets/cars2.jpg"),
      require("../assets/cars1.jpg"),
      require("../assets/cars2.jpg"),
    ],
  },
  {
    id: "2",
    price: "6 700 000 ₽",
    mileage: "80 000 км",
    title: "BMW X5",
    info: "xDrive30d - 3.0 AT 4WD - 2022 г.",
    address: "г. Москва, ул. Волкова",
    images: [
      require("../assets/cars1.jpg"),
      require("../assets/cars2.jpg"),
      require("../assets/cars1.jpg"),
      require("../assets/cars2.jpg"),
    ],
  },
];

export default function ReportsScreen() {
  const router = useRouter();
  const { isFavorite, setFavorite } = useFavorites();
  const { checkAuth } = useProtected();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.breadcrumbs}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile" as Href)}
          >
            <Text style={styles.breadcrumbLink}>Профиль</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}>{">"}</Text>
          <Text style={styles.breadcrumbActive}>Купленные отчёты</Text>
        </View>

        <Text style={styles.title}>Купленные отчёты</Text>

        <View style={styles.cardsGrid}>
          {mockReports.map((car) => (
            <TouchableOpacity
              key={car.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/auto/[id]",
                  params: { id: car.id },
                } as any)
              }
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imagesRow}
              >
                {car.images.map((src, idx) => (
                  <Image key={idx} source={src} style={styles.image} />
                ))}
              </ScrollView>

              <View style={styles.infoBlock}>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>{car.price}</Text>
                  <Text style={styles.mileage}>{car.mileage}</Text>
                </View>
                <Text style={styles.carTitle}>{car.title}</Text>
                <Text style={styles.carSub}>{car.info}</Text>
              </View>

              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary, { flex: 1 }]}
                  onPress={() => {
                    if (
                      !checkAuth({
                        message: "Авторизуйтесь, чтобы купить отчёт по авто",
                      })
                    ) {
                      return;
                    }
                    // сюда добавится логика покупки/открытия отчёта
                  }}
                >
                  <Text style={styles.buttonPrimaryText}>Купить отчёт</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.favButton}
                  onPress={() =>
                    setFavorite(car.id, !isFavorite(String(car.id)))
                  }
                >
                  <Text
                    style={[
                      styles.favIcon,
                      isFavorite(String(car.id)) && styles.favIconActive,
                    ]}
                  >
                    ♥
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.addressRow}>
                <Text style={styles.address}>{car.address}</Text>
              </View>

              <TouchableOpacity
                style={styles.reportLinkRow}
                onPress={() => {
                  if (
                    !checkAuth({
                      message: "Авторизуйтесь, чтобы скачать отчёт",
                    })
                  ) {
                    return;
                  }
                  // здесь будет логика скачивания PDF
                }}
              >
                <Text style={styles.reportLinkText}>Скачать отчёт PDF</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  breadcrumbs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  breadcrumbLink: {
    fontSize: 12,
    color: "#979797",
  },
  breadcrumbSeparator: {
    fontSize: 12,
    color: "#979797",
  },
  breadcrumbActive: {
    fontSize: 12,
    color: "#DB4431",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1E1E1E",
  },
  cardsGrid: {
    gap: 12,
  },
  card: {
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    padding: 12,
  },
  imagesRow: {
    gap: 8,
    paddingBottom: 4,
  },
  image: {
    height: 160,
    width: 220,
    borderRadius: 16,
  },
  infoBlock: {
    marginTop: 8,
    gap: 6,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E1E1E",
  },
  mileage: {
    fontSize: 12,
    color: "#FFFFFF",
    backgroundColor: "#DB4431",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  carTitle: {
    fontSize: 14,
    color: "#1E1E1E",
  },
  carSub: {
    fontSize: 12,
    color: "#777777",
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#DB4431",
  },
  buttonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  favButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
  },
  favIcon: {
    fontSize: 18,
    color: "#BFBFBF",
  },
  favIconActive: {
    color: "#DB4431",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  address: {
    fontSize: 11,
    color: "#555555",
  },
  reportLinkRow: {
    marginTop: 8,
  },
  reportLinkText: {
    fontSize: 12,
    color: "#2ABD6C",
    textDecorationLine: "underline",
  },
});

