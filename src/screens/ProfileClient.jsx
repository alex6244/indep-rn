import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../widgets/header/Header";
const ProfileScreen = () => {
  const navigateTo = (screen) => {
    console.log(`Navigate to ${screen}`);
    // navigation.navigate(screen);
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
            source={{ uri: "https://via.placeholder.com/60x60" }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Аркадий Паровозов</Text>
            <Text style={styles.profilePhone}>+7 995 185 88 90</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Image
              source={{ uri: "https://via.placeholder.com/24x24" }}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.grid}>
          {/* Favourites */}
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigateTo("favourites")}
          >
            <Text style={styles.gridLabel}>Избранное</Text>
            <Image
              source={{ uri: "https://via.placeholder.com/48x48" }}
              style={styles.gridIcon}
            />
          </TouchableOpacity>

          {/* Best Offers */}
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigateTo("hit")}
          >
            <Text style={styles.gridLabel}>Лучшие предложения</Text>
            <Image
              source={{ uri: "https://via.placeholder.com/56x56" }}
              style={[styles.gridIcon, styles.gridIconLarge]}
            />
          </TouchableOpacity>
        </View>

        {/* Empty Reports Section */}
        <View style={styles.emptySection}>
          <Text style={styles.emptyTitle}>
            У вас еще нет ни одного купленного отчёта
          </Text>
          <Text style={styles.emptySubtitle}>
            Выберите автомобиль и получите первый отчёт
          </Text>
          <Image
            source={{ uri: "https://via.placeholder.com/300x400" }}
            style={styles.emptyImage}
          />
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigateTo("catalog")}
          >
            <Text style={styles.ctaButtonText}>Перейти в каталог авто</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    paddingBottom: 120,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
  },
  profilePhone: {
    fontSize: 16,
    color: "#B3B3B3",
  },
  editButton: {
    padding: 8,
  },
  editIcon: {
    width: 24,
    height: 24,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  gridItem: {
    flex: 1,
    minHeight: 96,
    padding: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    justifyContent: "space-between",
  },
  gridLabel: {
    fontSize: 15,
    color: "#989898",
  },
  gridIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 48,
    height: 48,
  },
  gridIconLarge: {
    width: 56,
    height: 56,
    right: -8,
    bottom: -8,
  },
  emptySection: {
    alignItems: "center",
    gap: 12,
    paddingBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "500",
    textAlign: "center",
    marginHorizontal: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#808080",
  },
  emptyImage: {
    width: "100%",
    height: 400,
    borderRadius: 16,
  },
  ctaButton: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#DB4431",
    alignItems: "center",
    width: "100%",
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ProfileScreen;
