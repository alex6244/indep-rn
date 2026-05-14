import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";
import { brandService } from "../../../services/brandService";
import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import { typography } from "../../../shared/theme/typography";
import type { Brand } from "../../../types/brand";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NUM_COLUMNS = 4;
const HORIZONTAL_PAD = spacing.lg;
const CARD_GAP = spacing.sm;
const CARD_WIDTH =
  (SCREEN_WIDTH - HORIZONTAL_PAD * 2 - CARD_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

type Props = {
  visible: boolean;
  value: string;
  onChange: (brandName: string) => void;
  onClose: () => void;
  filteredCount?: number;
};

function CloseIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Path
        fill={colors.text.primary}
        d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
      />
    </Svg>
  );
}

function SearchIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Path
        fill={colors.text.subtle}
        d="M6.5 1a5.5 5.5 0 1 0 3.526 9.73l2.873 2.872a.75.75 0 0 0 1.06-1.06L11.087 9.67A5.5 5.5 0 0 0 6.5 1ZM2.5 6.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
      />
    </Svg>
  );
}

function BrandCard({
  brand,
  selected,
  onPress,
}: {
  brand: Brand;
  selected: boolean;
  onPress: () => void;
}) {
  const abbr = brand.name.slice(0, 4).toUpperCase();

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={brand.name}
    >
      <View style={styles.logoWrap}>
        {brand.logoUrl ? (
          <Image
            source={{ uri: brand.logoUrl }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.logoText} numberOfLines={1} adjustsFontSizeToFit>
            {abbr}
          </Text>
        )}
      </View>
      <Text style={[styles.cardName, selected && styles.cardNameSelected]} numberOfLines={1}>
        {brand.name}
      </Text>
    </TouchableOpacity>
  );
}

export function FilterBrandPickerModal({
  visible,
  value,
  onChange,
  onClose,
  filteredCount,
}: Props) {
  const insets = useSafeAreaInsets();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    brandService.getAll().then((data) => {
      setBrands(data);
      setLoading(false);
    });
  }, [visible]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(q));
  }, [brands, search]);

  const handleSelect = useCallback(
    (brand: Brand) => {
      onChange(value === brand.name ? "" : brand.name);
      onClose();
    },
    [value, onChange, onClose],
  );

  const handleClose = useCallback(() => {
    setSearch("");
    onClose();
  }, [onClose]);

  const countLabel =
    filteredCount != null
      ? `Показать ${filteredCount.toLocaleString("ru-RU")} объявлений`
      : "Показать результаты";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Закрыть"
          >
            <CloseIcon />
          </TouchableOpacity>
          <Text style={styles.title}>Марки</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchIcon}>
            <SearchIcon />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск марки"
            placeholderTextColor={colors.text.subtle}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Grid */}
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.brand.primary} />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            numColumns={NUM_COLUMNS}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <BrandCard
                brand={item}
                selected={item.name === value}
                onPress={() => handleSelect(item)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Ничего не найдено</Text>
            }
          />
        )}

        {/* Bottom button */}
        <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + spacing.md }]}>
          <Pressable
            style={({ pressed }) => [styles.showBtn, pressed && styles.showBtnPressed]}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel={countLabel}
          >
            <Text style={styles.showBtnText}>{countLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: HORIZONTAL_PAD,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  title: {
    ...typography.title,
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: colors.text.primary,
  },
  headerRight: {
    width: 20,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface.input,
    borderRadius: radius.sm,
    marginHorizontal: HORIZONTAL_PAD,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.textRegular,
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  grid: {
    paddingHorizontal: HORIZONTAL_PAD,
    paddingBottom: spacing.lg,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface.card,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: "transparent",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  cardSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.surface.primary,
  },
  logoWrap: {
    width: 44,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  logo: {
    width: 44,
    height: 36,
  },
  logoText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text.secondary,
    textAlign: "center",
  },
  cardName: {
    ...typography.textRegular,
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: "center",
  },
  cardNameSelected: {
    color: colors.brand.primary,
    fontWeight: "600",
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    ...typography.textRegular,
    fontSize: 14,
    color: colors.text.subtle,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
  bottomPanel: {
    paddingHorizontal: HORIZONTAL_PAD,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.surface.primary,
  },
  showBtn: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.md,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  showBtnPressed: {
    opacity: 0.85,
  },
  showBtnText: {
    ...typography.textRegular,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.inverse,
  },
});
