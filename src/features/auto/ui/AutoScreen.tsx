import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavorites } from "../../../contexts/FavoritesContext";
import { useProtected } from "../../../hooks/useProtected";
import { AppError } from "../../../shared/errors/appError";
import { colors } from "../../../shared/theme/colors";
import { radius } from "../../../shared/theme/radius";
import { spacing } from "../../../shared/theme/spacing";
import { AppButton } from "../../../shared/ui/AppButton";
import { InlineMessage } from "../../../shared/ui/InlineMessage";
import { ScreenStateEmpty } from "../../../shared/ui/ScreenStateEmpty";
import { ScreenStateError } from "../../../shared/ui/ScreenStateError";
import { ScreenStateLoading } from "../../../shared/ui/ScreenStateLoading";
import { type Car } from "../../../types/car";
import { Header } from "../../../widgets/header/Header";
import { carService } from "../../../services/carService";
import { FavoriteButton } from "../../favorites/ui/FavoriteButton";

const ruPriceFormat = new Intl.NumberFormat("ru-RU");

type RouteParams = {
  id?: string | string[];
};

function buildSpecsLine(car: Car): string {
  const parts = [
    `${car.year} г.`,
    `${ruPriceFormat.format(car.mileage)} км`,
    car.engine ? `${car.engine} л` : "",
    car.transmission ?? "",
    car.driveLabel ?? car.driveType,
  ].filter(Boolean);
  return parts.join(" - ");
}

export default function AutoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { checkAuth } = useProtected();
  const { isFavorite, setFavorite } = useFavorites();
  const params = useLocalSearchParams<RouteParams>();
  const rawId = params.id;
  const carId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [car, setCar] = React.useState<Car | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notFound, setNotFound] = React.useState(false);
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null);
  const requestVersionRef = React.useRef(0);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadCar = React.useCallback(async (): Promise<void> => {
    const requestVersion = ++requestVersionRef.current;
    setLoading(true);
    setError(null);
    setNotFound(false);

    if (!carId) {
      setCar(null);
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      const nextCar = await carService.getById(carId);
      if (!mountedRef.current || requestVersion !== requestVersionRef.current) return;
      setCar(nextCar);
    } catch (e) {
      if (!mountedRef.current || requestVersion !== requestVersionRef.current) return;
      if (e instanceof AppError && e.kind === "not_found") {
        setCar(null);
        setNotFound(true);
      } else {
        const message =
          e instanceof Error ? e.message : "Не удалось загрузить автомобиль. Попробуйте ещё раз.";
        setCar(null);
        setError(message);
      }
    } finally {
      if (!mountedRef.current || requestVersion !== requestVersionRef.current) return;
      setLoading(false);
    }
  }, [carId]);

  React.useEffect(() => {
    void loadCar();
  }, [loadCar]);

  const handleBuyReport = React.useCallback(() => {
    if (!checkAuth({ redirectTo: "/(auth)" as Href })) return;
    setInfoMessage("Покупка отчёта станет доступна после подключения платежного backend-сценария.");
  }, [checkAuth]);

  const handleFavoriteChange = React.useCallback(
    (next: boolean) => {
      if (!car) return;
      setFavorite(String(car.id), next);
    },
    [car, setFavorite],
  );

  return (
    <View style={styles.root}>
      <Header title={car?.title ?? "Автомобиль"} rightAction="none" />

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}>
        {infoMessage ? (
          <View style={styles.noticeWrap}>
            <InlineMessage tone="info" message={infoMessage} />
          </View>
        ) : null}

        {loading ? (
          <ScreenStateLoading message="Загружаем карточку автомобиля..." />
        ) : error ? (
          <ScreenStateError
            title="Не удалось загрузить автомобиль"
            message={error}
            onRetry={() => {
              void loadCar();
            }}
          />
        ) : notFound || !car ? (
          <ScreenStateEmpty
            title="Автомобиль не найден"
            subtitle="Возможно, объявление снято с публикации или ссылка устарела."
            actionLabel="Перейти в каталог"
            onAction={() => router.push("/(tabs)/catalog" as Href)}
          />
        ) : (
          <View style={styles.cardWrap}>
            {Array.isArray(car.images) && car.images.length > 0 ? (
              <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.imagesRow}
              >
                {car.images.map((uri, index) => (
                  <Image
                    key={`${car.id}_${uri}_${index}`}
                    source={{ uri }}
                    style={[
                      styles.image,
                      index === car.images.length - 1 && styles.imageLast,
                    ]}
                    accessibilityLabel={`Фото ${index + 1} из ${car.images.length}`}
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={styles.imageFallback}>
                <Text style={styles.imageFallbackText}>Фотографии автомобиля пока не добавлены</Text>
              </View>
            )}

            <Text style={styles.title}>{car.title}</Text>
            <Text style={styles.subtitle}>{buildSpecsLine(car)}</Text>
            <Text style={styles.price}>{ruPriceFormat.format(car.price)} ₽</Text>
            <Text style={styles.address}>{car.address}</Text>

            <View style={styles.actions}>
              <AppButton label="Купить отчёт" onPress={handleBuyReport} style={styles.buyButton} />
              <View style={styles.favoriteWrap}>
                <FavoriteButton
                  initialActive={isFavorite(String(car.id))}
                  onChange={handleFavoriteChange}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface.primary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
  },
  noticeWrap: {
    marginBottom: spacing.md,
  },
  cardWrap: {
    gap: 10,
  },
  imagesRow: {
    flexGrow: 0,
    marginBottom: spacing.xs,
  },
  image: {
    width: 280,
    height: 180,
    borderRadius: radius.sm + 2,
    marginRight: spacing.sm,
    backgroundColor: colors.surface.card,
  },
  imageLast: {
    marginRight: 0,
  },
  imageFallback: {
    height: 180,
    borderRadius: radius.sm + 2,
    backgroundColor: colors.surface.card,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  imageFallbackText: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.tertiary,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
  },
  address: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buyButton: {
    flex: 1,
  },
  favoriteWrap: {
    marginLeft: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.sm + 2,
  },
});

