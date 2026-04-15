import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import type { Car } from "../../../../types/car";
import {
  type CatalogFiltersController,
  useCatalogFiltersController,
} from "../useCatalogFiltersController";

type ControllerSnapshot = CatalogFiltersController;

function createCatalogHookProbe(
  cars: Car[],
  onSnapshot: (snapshot: ControllerSnapshot) => void,
) {
  return function CatalogHookProbe() {
    const controller = useCatalogFiltersController(cars);
    React.useEffect(() => {
      onSnapshot(controller);
    }, [controller]);
    return null;
  };
}

async function flushAsync(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

const sampleCars: Car[] = [
  {
    id: "car_1",
    title: "BMW X5",
    brand: "BMW",
    price: 1000000,
    mileage: 90000,
    year: 2021,
    engine: "2.0",
    power: 245,
    driveType: "4WD",
    address: "Москва",
    images: ["https://example.com/1.jpg"],
  },
  {
    id: "car_2",
    title: "Audi Q7",
    brand: "Audi",
    price: 2500000,
    mileage: 120000,
    year: 2020,
    engine: "3.0",
    power: 340,
    driveType: "4WD",
    address: "Сочи",
    images: ["https://example.com/2.jpg"],
  },
];

describe("useCatalogFiltersController", () => {
  it("rejects invalid price range and keeps previous filtered list", async () => {
    let latestSnapshot: ControllerSnapshot | null = null;
    const Probe = createCatalogHookProbe(sampleCars, (snapshot) => {
      latestSnapshot = snapshot;
    });

    await act(async () => {
      TestRenderer.create(<Probe />);
    });
    await flushAsync();

    const getSnapshot = (): ControllerSnapshot => {
      if (!latestSnapshot) throw new Error("Controller snapshot is not ready");
      return latestSnapshot;
    };

    expect(getSnapshot().filteredCars).toEqual(sampleCars);

    await act(async () => {
      getSnapshot().setPriceFromText("1000000");
      getSnapshot().setPriceToText("100000");
    });
    await flushAsync();

    let applied = true;
    await act(async () => {
      applied = getSnapshot().applyFilters();
    });
    await flushAsync();

    expect(applied).toBe(false);
    expect(getSnapshot().error).toBe("Цена (От) не должна быть больше цены (До).");
    expect(getSnapshot().filteredCars).toEqual(sampleCars);
  });
});

