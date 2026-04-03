import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../widgets/header/Header";
const RadioChip = ({ label }) => (
  <View style={styles.radioChip}>
    <View style={styles.radioCircle} />
    <Text style={styles.radioChipText}>{label}</Text>
  </View>
);

const NewCar = () => {
  return (
    <View style={styles.root}>
      <Header title="Создать объявление" rightAction="none" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.breadcrumbs}>Профиль {">"} Создать объявление</Text>

        {/* Блок: фото и видео */}
        <View style={styles.assetsCard}>
          <Text style={styles.assetsTitle}>Добавьте фото авто</Text>

          {[
            { label: "Фото салона", color: "#DB4431" },
            { label: "Фото кузова", color: "#43C356" },
            { label: "Видео салона", color: "#DB4431" },
            { label: "Видео кузова", color: "#DB4431" },
          ].map((item) => (
            <View key={item.label} style={styles.mediaRow}>
              <Text style={styles.mediaLabel}>{item.label}</Text>
              <TouchableOpacity
                style={[styles.mediaButton, { backgroundColor: item.color }]}
              >
                <Text style={styles.mediaButtonText}>Добавить</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Общая информация (чекбоксы) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Общая информация</Text>
          {[
            "ПТС оригинал",
            "Заводская оптика",
            "Юридически чиста",
            "Коробка, двигатель - без нареканий",
            "Тест-драйв - без нареканий",
            "Сухое подкапотное пространство",
            "Подвеска - без серьезных нареканий",
            "2 комплекта резины",
          ].map((t) => (
            <View key={t} style={styles.checkboxRow}>
              <View style={styles.checkboxFake} />
              <Text style={styles.checkboxText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Данные по авто / ПТС */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Общая информация</Text>

          {[
            { label: "VIN", placeholder: "Введите VIN" },
            { label: "Марка", placeholder: "Укажите марку" },
            { label: "Модель", placeholder: "Укажите модель" },
          ].map((f) => (
            <View key={f.label} style={styles.field}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={f.placeholder}
                placeholderTextColor="#00000080"
              />
            </View>
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>Год выпуска</Text>
            <TextInput
              style={styles.input}
              placeholder="Укажите год выпуска"
              placeholderTextColor="#979797"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Цвет</Text>
            <TextInput
              style={styles.input}
              placeholder="Укажите цвет"
              placeholderTextColor="#979797"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Объём двигателя</Text>
            <TextInput
              style={styles.input}
              placeholder="Укажите объём двигателя"
              placeholderTextColor="#979797"
            />
          </View>

          <View style={styles.radioGroup}>
            <Text style={styles.label}>ПТС</Text>
            <View style={styles.radioRow}>
              <RadioChip label="Оригинал" />
              <RadioChip label="Неоригинал" />
            </View>
          </View>

          <View style={styles.radioGroup}>
            <Text style={styles.label}>Электронный ПТС</Text>
            <View style={styles.radioRow}>
              <RadioChip label="Есть" />
              <RadioChip label="Нет" />
            </View>
          </View>
        </View>

        {/* Пробег */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Заполните пробег</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Пробег авто, км</Text>
            <TextInput
              style={styles.input}
              placeholder="300 000"
              placeholderTextColor="#00000080"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Владельцы */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Заполните сведения о владельцах по ПТС
          </Text>

          <View style={styles.radioGroup}>
            <Text style={styles.label}>Тип владельца</Text>
            <View style={styles.radioRow}>
              <RadioChip label="Юридическое лицо" />
              <RadioChip label="Физическое лицо" />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Дата начала владения</Text>
            <TextInput
              style={styles.input}
              placeholder="дд.мм.гггг"
              placeholderTextColor="#00000080"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Дата окончания владения</Text>
            <TextInput
              style={styles.input}
              placeholder="дд.мм.гггг"
              placeholderTextColor="#00000080"
            />
          </View>

          <TouchableOpacity style={styles.btnOutline}>
            <Text style={styles.btnOutlineText}>Создать отчёт</Text>
          </TouchableOpacity>
        </View>

        {/* Юридическая чистота */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Юридическая чистота автомобиля</Text>

          {[
            "Сведения о нахождении в залоге",
            "Ограничения на регистрационные действия",
            "Сведения о нахождении в розыске",
          ].map((title) => (
            <View key={title} style={styles.radioGroup}>
              <Text style={styles.label}>{title}</Text>
              <View style={styles.radioRow}>
                <RadioChip label="Есть" />
                <RadioChip label="Нет" />
              </View>
            </View>
          ))}
        </View>

        {/* Коммерческое использование */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Коммерческое использование</Text>

          {[
            "Разрешение на работу в такси",
            "Регистрировался для работы в каршеринге",
            "Обнаружен в договорах лизинга",
          ].map((title) => (
            <View key={title} style={styles.radioGroup}>
              <Text style={styles.label}>{title}</Text>
              <View style={styles.radioRow}>
                <RadioChip label="Есть" />
                <RadioChip label="Нет" />
              </View>
            </View>
          ))}
        </View>

        {/* Повреждения */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Повреждения</Text>

          <View style={styles.schemeBlock}>
            <View style={styles.schemePlaceholder}>
              <Text style={styles.schemePlaceholderText}>
                Схема повреждений
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Внесите дефекты</Text>
              <TextInput
                style={styles.input}
                placeholder="Косметические царапины на переднем бампере, без влияния на безопасность."
                placeholderTextColor="#00000080"
              />
            </View>
          </View>
        </View>

        {/* Кнопка "Продолжить" */}
        <TouchableOpacity style={[styles.btnPrimaryFull, { marginBottom: 24 }]}>
          <Text style={styles.btnPrimaryFullText}>Продолжить</Text>
        </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 40,
  },
  breadcrumbs: {
    fontSize: 12,
    color: "#979797",
    marginBottom: 8,
  },
  assetsCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  assetsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  mediaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  mediaLabel: {
    fontSize: 12,
  },
  mediaButton: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mediaButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
  },
  card: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  checkboxFake: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000000",
  },
  checkboxText: {
    fontSize: 12,
  },
  radioGroup: {
    marginTop: 8,
  },
  radioRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  radioChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#DB44310A",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#DB4431",
  },
  radioChipText: {
    fontSize: 12,
  },
  btnOutline: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DB4431",
    alignItems: "center",
  },
  btnOutlineText: {
    color: "#DB4431",
    fontSize: 14,
    fontWeight: "500",
  },
  schemeBlock: {
    marginTop: 4,
  },
  schemePlaceholder: {
    height: 180,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  schemePlaceholderText: {
    fontSize: 12,
    color: "#555555",
  },
  btnPrimaryFull: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#DB4431",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryFullText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default NewCar;
