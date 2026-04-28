import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import AutoScreen from "../AutoScreen";
import { AppError } from "../../../../shared/errors/appError";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.mock("../../../../hooks/useProtected", () => ({
  useProtected: jest.fn(),
}));

jest.mock("../../../../contexts/FavoritesContext", () => ({
  useFavorites: jest.fn(),
}));

jest.mock("../../../../services/carService", () => ({
  carService: {
    getById: jest.fn(),
  },
}));

jest.mock("../../../../widgets/header/Header", () => ({
  Header: () => null,
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock("../../../favorites/ui/FavoriteButton", () => ({
  FavoriteButton: ({
    initialActive,
    onChange,
  }: {
    initialActive?: boolean;
    onChange?: (active: boolean) => void;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pressable, Text } = require("react-native");
    return React.createElement(
      Pressable,
      {
        testID: "favorite-toggle",
        onPress: () => {
          onChange?.(!initialActive);
        },
      },
      React.createElement(Text, null, "fav"),
    );
  },
}));

const { useRouter, useLocalSearchParams } = jest.requireMock("expo-router") as {
  useRouter: jest.Mock;
  useLocalSearchParams: jest.Mock;
};

const { useProtected } = jest.requireMock("../../../../hooks/useProtected") as {
  useProtected: jest.Mock;
};

const { useFavorites } = jest.requireMock("../../../../contexts/FavoritesContext") as {
  useFavorites: jest.Mock;
};

const { carService } = jest.requireMock("../../../../services/carService") as {
  carService: { getById: jest.Mock };
};

const baseCar = {
  id: "car_1",
  title: "BMW X5",
  brand: "BMW",
  price: 5000000,
  mileage: 120000,
  year: 2021,
  engine: "2.0",
  power: 240,
  driveType: "4WD",
  driveLabel: "Полный",
  transmission: "AT",
  address: "Москва",
  images: ["https://example.com/1.jpg"],
};

describe("AutoScreen", () => {
  const push = jest.fn();
  const checkAuth = jest.fn();
  const setFavorite = jest.fn();
  const isFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    push.mockReset();
    checkAuth.mockReset();
    setFavorite.mockReset();
    isFavorite.mockReset();

    useRouter.mockReturnValue({ push });
    useLocalSearchParams.mockReturnValue({ id: "car_1" });
    useProtected.mockReturnValue({ checkAuth });
    useFavorites.mockReturnValue({ isFavorite, setFavorite });
    isFavorite.mockReturnValue(false);
  });

  it("renders car content after successful load", async () => {
    carService.getById.mockResolvedValue(baseCar);
    const screen = render(<AutoScreen />);

    expect(screen.getByText("Загружаем карточку автомобиля...")).toBeTruthy();
    const title = await screen.findByText("BMW X5", {}, { timeout: 7000 });
    expect(title).toBeTruthy();

    expect(screen.getByText("5 000 000 ₽")).toBeTruthy();
    expect(screen.getByText("Москва")).toBeTruthy();
  });

  it("shows not_found state when car is missing", async () => {
    carService.getById.mockRejectedValue(
      new AppError({ kind: "not_found", message: "Автомобиль не найден." }),
    );
    const screen = render(<AutoScreen />);

    await waitFor(() => expect(screen.getByText("Автомобиль не найден")).toBeTruthy());
    expect(screen.getByText("Перейти в каталог")).toBeTruthy();
  });

  it("shows error state and retries load", async () => {
    carService.getById
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(baseCar);
    const screen = render(<AutoScreen />);

    await waitFor(() => expect(screen.getByText("Не удалось загрузить автомобиль")).toBeTruthy());
    fireEvent.press(screen.getByText("Повторить"));

    await waitFor(() => expect(screen.getByText("BMW X5")).toBeTruthy());
    expect(carService.getById).toHaveBeenCalledTimes(2);
  });

  it("redirects unauthenticated user on buy report action", async () => {
    carService.getById.mockResolvedValue(baseCar);
    checkAuth.mockReturnValue(false);
    const screen = render(<AutoScreen />);

    await waitFor(() => expect(screen.getByText("Купить отчёт")).toBeTruthy());
    fireEvent.press(screen.getByText("Купить отчёт"));

    expect(checkAuth).toHaveBeenCalledWith({ redirectTo: "/(auth)" });
  });

  it("updates favorites via FavoritesContext", async () => {
    carService.getById.mockResolvedValue(baseCar);
    const screen = render(<AutoScreen />);
    await waitFor(() => expect(screen.getByText("BMW X5")).toBeTruthy());

    await act(async () => {
      fireEvent.press(screen.getByTestId("favorite-toggle"));
    });

    expect(setFavorite).toHaveBeenCalledWith("car_1", true);
  });
});
