import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import type { Car } from "../../../../types/car";
import { AppError } from "../../../../shared/errors/appError";
import { useCatalogCars, type UseCatalogCarsResult } from "../useCatalogCars";

jest.mock("../../../../services/carService", () => ({
  carService: {
    getAll: jest.fn(),
  },
}));

const { carService } = jest.requireMock("../../../../services/carService") as {
  carService: { getAll: jest.Mock };
};

const sampleCar: Car = {
  id: "car_1",
  title: "BMW X5",
  brand: "BMW",
  price: 1_000_000,
  mileage: 90_000,
  year: 2021,
  engine: "2.0",
  power: 245,
  driveType: "4WD",
  address: "Москва",
  images: ["https://example.com/1.jpg"],
};

function CatalogCarsProbe({ onSnapshot }: { onSnapshot: (value: UseCatalogCarsResult) => void }) {
  const value = useCatalogCars();
  React.useEffect(() => {
    onSnapshot(value);
  }, [value, onSnapshot]);
  return null;
}

async function flushAsync(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("useCatalogCars", () => {
  beforeEach(() => {
    carService.getAll.mockReset();
  });

  it("loads cars on mount", async () => {
    carService.getAll.mockResolvedValue([sampleCar]);
    const snapshots: UseCatalogCarsResult[] = [];

    await act(() => {
      TestRenderer.create(
        <CatalogCarsProbe
          onSnapshot={(value) => {
            snapshots.push(value);
          }}
        />,
      );
    });
    await flushAsync();

    const snapshot = snapshots[snapshots.length - 1];
    expect(carService.getAll).toHaveBeenCalled();
    expect(snapshot.loading).toBe(false);
    expect(snapshot.error).toBeNull();
    expect(snapshot.cars).toEqual([sampleCar]);
  });

  it("sets error when load fails", async () => {
    carService.getAll.mockRejectedValue(
      new AppError({ kind: "network", message: "Сеть недоступна." }),
    );
    const snapshots: UseCatalogCarsResult[] = [];

    await act(() => {
      TestRenderer.create(
        <CatalogCarsProbe
          onSnapshot={(value) => {
            snapshots.push(value);
          }}
        />,
      );
    });
    await flushAsync();

    const snapshot = snapshots[snapshots.length - 1];
    expect(snapshot.loading).toBe(false);
    expect(snapshot.error).toBe("Сеть недоступна.");
    expect(snapshot.cars).toEqual([]);
  });
});
