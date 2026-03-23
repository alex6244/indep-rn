import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Header } from "../widgets/header/Header";
import { FavoriteButton } from "../features/favorites/ui/FavoriteButton";
import { RangeSlider } from "../shared/ui/RangeSlider";
import { EntitiesToggle } from "../widgets/entitiesToggle/EntitiesToggle";

const MAIN_IMG = "https://via.placeholder.com/600x300";
const THUMBS = [
  "https://via.placeholder.com/200x120",
  "https://via.placeholder.com/200x120?2",
  "https://via.placeholder.com/200x120?3",
];

const Auto = () => {

  return (
    <View style={styles.root}>
      <Header title="NISSAN Qashqai" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.breadcrumbs}>
          <Text style={styles.breadcrumbText}>
            Каталог {">"} NISSAN {">"} Qashqai {">"} Кроссовер {">"} 1,2 л (115
            л.с.) 6MT 2WD
          </Text>
        </View>

        <View style={styles.topBlock}>
          <View style={styles.imagesCol}>
            <Image source={{ uri: MAIN_IMG }} style={styles.mainImage} />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbScroll}
            >
              {THUMBS.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={styles.thumb} />
              ))}

              <View style={styles.moreThumb}>
                <Text style={styles.moreThumbBig}>67+</Text>
                <Text style={styles.moreThumbSmall}>фото</Text>
              </View>
            </ScrollView>
          </View>

          <View style={styles.infoCol}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>NISSAN Qashqai</Text>
            </View>
            <Text style={styles.subTitle}>
              200 000 км - Active - 1,2 л (115 л.с.) 6MT 2WD - 2025 г.
            </Text>
            <Text style={styles.bodyType}>Кроссовер</Text>

            <View style={styles.badges}>
              <Badge
                text="Проверено 128 параметров"
                color="#6B757C"
                bg="#F6F8FE"
              />
              <Badge
                text="Повреждений не обнаружено"
                color="#4DB95C"
                bg="#E6F6EA"
              />
              <Badge
                text="4 элемента требуют замены"
                color="#F63F26"
                bg="#FFF1F3"
              />
              <Badge
                text="Имеются юридические проблемы"
                color="#E98800"
                bg="#FFF1C7"
              />
            </View>

            <View style={styles.priceBlock}>
              <Text style={styles.price}>5 000 000 ₽</Text>
              <Text style={styles.credit}>Кредит от 8 577 ₽/мес.</Text>
            </View>

            <View style={styles.mainButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]}>
                <Text style={styles.btnTextPrimary}>Купить отчет</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnDark]}>
                <Text style={styles.btnTextPrimary}>Купить авто в кредит</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Card title="Общая информация">
          {[
            "ПТС оригинал",
            "Юридически чиста",
            "Заводская оптика",
            "Коробка, двигатель - без нареканий",
            "Тест-драйв - без нареканий",
            "Сухое подкапотное пространство",
            "Подвеска - без серьезных нареканий",
            "2 комплекта резины",
          ].map((t) => (
            <Text key={t} style={styles.listItem}>
              • {t}
            </Text>
          ))}
        </Card>

        <Card title="Повреждения">
          <EntitiesToggle leftLabel="Схема" rightLabel="Фото" />
          <View style={styles.damageSlider}>
            <Image
              source={{ uri: "https://via.placeholder.com/400x200" }}
              style={styles.damageImage}
            />
            <Text style={styles.damageText}>
              Косметические царапины на переднем бампере, без влияния на
              безопасность.
            </Text>
          </View>
        </Card>

        <Card title="Данные из ПТС">
          {[
            ["VIN", "KNA 204**********"],
            ["Марка", "Kia"],
            ["Модель", "Carnival"],
            ["Год выпуска", "2019"],
            ["Цвет", "Белый"],
            ["Объём двигателя", "2,2 л."],
            ["ПТС", "Оригинал"],
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowValue}>{value}</Text>
            </View>
          ))}
        </Card>

        <Card title="Кредит на авто на специальных условиях">
          <Text style={styles.creditDescr}>
            Заполните одну заявку — сравните предложения банков и узнайте
            решение онлайн.
          </Text>

          <Text style={styles.sectionLabel}>Первоначальный взнос</Text>
          <RangeSlider min={10} max={70} initial={70} />
          <Text style={styles.sectionValue}>5 000 000 ₽ (70%)</Text>

          <Text style={styles.sectionLabel}>Срок кредита</Text>
          <RangeSlider min={1} max={7} initial={7} />
          <Text style={styles.sectionValue}>7 лет</Text>

          <View style={styles.row}>
            <View>
              <Text style={styles.sectionLabel}>Сумма кредита</Text>
              <Text style={styles.sectionValue}>5 000 000 ₽</Text>
            </View>
            <View>
              <Text style={styles.sectionLabel}>Ежемесячный платёж</Text>
              <Text style={styles.sectionValue}>11 600 ₽ / мес.</Text>
            </View>
          </View>
        </Card>

        <Card title="Лучшие предложения">
          <View style={styles.bestOffer}>
            <Image
              source={{ uri: "https://via.placeholder.com/400x180" }}
              style={styles.bestImage}
            />
            <View style={styles.bestInfo}>
              <View style={styles.bestPriceRow}>
                <Text style={styles.bestPrice}>67 000 000 ₽</Text>
                <Text style={styles.bestBadge}>200 000 км</Text>
              </View>
              <Text style={styles.bestTitle}>
                Mercedes-Benz GLC AMG 43 AMG II (X254)
              </Text>
              <Text style={styles.bestSub}>
                Active - 1,2 л (115 л.с.) 6MT 2WD - 2025 г.
              </Text>
            </View>
            <View style={styles.bestBtnsRow}>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
              >
                <Text style={styles.btnTextPrimary}>Купить отчет</Text>
              </TouchableOpacity>
              <FavoriteButton />
            </View>
            <Text style={styles.bestAddress}>г. Москва, ул. Волкова</Text>
          </View>
        </Card>
      </ScrollView>

    </View>
  );
};

const Badge = ({ text, color, bg }) => (
  <View style={[styles.badge, { backgroundColor: bg }]}>
    <Text style={{ fontSize: 12, color }}>{text}</Text>
  </View>
);

const Card = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.cardBody}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  breadcrumbs: {
    marginBottom: 12,
  },
  breadcrumbText: {
    fontSize: 12,
    color: "#979797",
  },
  topBlock: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  imagesCol: {
    flex: 2,
  },
  infoCol: {
    flex: 3,
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  thumbScroll: {
    flexGrow: 0,
  },
  thumb: {
    width: 110,
    height: 70,
    borderRadius: 6,
    marginRight: 8,
  },
  moreThumb: {
    width: 110,
    height: 70,
    borderRadius: 6,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  moreThumbBig: {
    color: "#FFF",
    fontSize: 18,
  },
  moreThumbSmall: {
    color: "#FFF",
    fontSize: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  subTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  bodyType: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceBlock: {
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
  },
  credit: {
    fontSize: 12,
    fontWeight: "500",
  },
  mainButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    backgroundColor: "#DB4431",
  },
  btnDark: {
    backgroundColor: "#1E1E1E",
  },
  btnTextPrimary: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardBody: {
    gap: 4,
  },
  listItem: {
    fontSize: 12,
  },
  damageSlider: {
    marginTop: 8,
  },
  damageImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  damageText: {
    fontSize: 12,
    color: "#FFF",
    backgroundColor: "#00000088",
    padding: 8,
    borderRadius: 6,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  rowLabel: {
    fontSize: 12,
    color: "#666",
  },
  rowValue: {
    fontSize: 12,
    textAlign: "right",
  },
  creditDescr: {
    fontSize: 12,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  sectionValue: {
    fontSize: 18,
    marginTop: 4,
  },
  bestOffer: {
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    padding: 10,
  },
  bestImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 8,
  },
  bestInfo: {
    marginBottom: 8,
  },
  bestPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  bestPrice: {
    fontSize: 20,
    fontWeight: "600",
  },
  bestBadge: {
    backgroundColor: "#DB4431",
    color: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    fontSize: 10,
  },
  bestTitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  bestSub: {
    fontSize: 12,
    color: "#999",
  },
  bestBtnsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  bestAddress: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default Auto;
