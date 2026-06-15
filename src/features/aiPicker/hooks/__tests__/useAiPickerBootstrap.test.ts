import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { AiCatalogItem } from "../../types";
import { useAiPickerBootstrap } from "../useAiPickerBootstrap";

const mockDispatch = jest.fn();

jest.mock("../../../../store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock("../../api/aiPickerApi", () => ({
  aiPickerApi: {
    endpoints: {
      getAiMeta: { initiate: jest.fn() },
      getAiCatalog: { initiate: jest.fn() },
    },
  },
}));

jest.mock("../../api/aiPickerEnv", () => ({
  isAiPickerApiEnabled: jest.fn(),
  isAiPickerLocalFallbackEnabled: jest.fn(),
}));

jest.mock("../../catalog/aiCatalogService", () => ({
  getAiSiteProfile: jest.fn(() => ({
    siteId: "indep",
    displayName: "Indep",
    mode: "multibrand",
    allowOrder: true,
    catalogBannersUrl: "https://example.com/banners",
    locale: "ru",
    disclaimer: "Static disclaimer from JSON",
  })),
  loadAiCatalogWithMeta: jest.fn(),
  loadAiCatalogSeedOnly: jest.fn(),
}));

const { aiPickerApi } = jest.requireMock("../../api/aiPickerApi") as {
  aiPickerApi: {
    endpoints: {
      getAiMeta: { initiate: jest.Mock };
      getAiCatalog: { initiate: jest.Mock };
    };
  };
};

const { isAiPickerApiEnabled, isAiPickerLocalFallbackEnabled } = jest.requireMock(
  "../../api/aiPickerEnv",
) as {
  isAiPickerApiEnabled: jest.Mock;
  isAiPickerLocalFallbackEnabled: jest.Mock;
};

const { loadAiCatalogWithMeta, loadAiCatalogSeedOnly } = jest.requireMock(
  "../../catalog/aiCatalogService",
) as {
  loadAiCatalogWithMeta: jest.Mock;
  loadAiCatalogSeedOnly: jest.Mock;
};

const sampleCar: AiCatalogItem = {
  id: "1",
  siteId: "indep",
  brand: "KIA",
  title: "KIA Rio",
  priceFrom: 1_000_000,
  year: 2026,
  condition: "new",
  availability: "from_price",
};

describe("useAiPickerBootstrap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockImplementation((action: { unwrap: () => Promise<unknown> }) => action);
    isAiPickerLocalFallbackEnabled.mockReturnValue(false);
  });

  it("loads remote meta and catalog", async () => {
    isAiPickerApiEnabled.mockReturnValue(true);

    aiPickerApi.endpoints.getAiMeta.initiate.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          catalogCount: 1,
          catalogSource: "api",
          welcomeText: "Remote welcome",
          disclaimer: "Disclaimer from server",
        }),
    });
    aiPickerApi.endpoints.getAiCatalog.initiate.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          items: [sampleCar],
          catalogSource: "api",
        }),
    });

    const { result } = renderHook(() => useAiPickerBootstrap("indep"));

    await waitFor(() => {
      expect(result.current.catalog).toEqual([sampleCar]);
    });

    expect(result.current.useRemoteApi).toBe(true);
    expect(result.current.catalogLoading).toBe(false);
    expect(result.current.apiServerWarning).toBeNull();
    expect(result.current.welcomeText).toBe("Remote welcome");
    expect(result.current.disclaimer).toBe("Disclaimer from server");
  });

  it("uses catalog when meta fails but catalog succeeds", async () => {
    isAiPickerApiEnabled.mockReturnValue(true);

    aiPickerApi.endpoints.getAiMeta.initiate.mockReturnValue({
      unwrap: () => Promise.reject(new Error("meta down")),
    });
    aiPickerApi.endpoints.getAiCatalog.initiate.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          items: [sampleCar],
          catalogSource: "api",
        }),
    });

    const { result } = renderHook(() => useAiPickerBootstrap("indep"));

    await waitFor(() => {
      expect(result.current.catalog).toEqual([sampleCar]);
    });

    expect(result.current.apiServerWarning).toBeNull();
    expect(result.current.disclaimer).toBe("Static disclaimer from JSON");
  });

  it("loads local catalog when remote API is disabled", async () => {
    isAiPickerApiEnabled.mockReturnValue(false);
    loadAiCatalogWithMeta.mockResolvedValue({
      items: [sampleCar],
      source: "seed",
    });

    const { result } = renderHook(() => useAiPickerBootstrap("indep"));

    await waitFor(() => {
      expect(result.current.catalogLoading).toBe(false);
    });

    expect(result.current.useRemoteApi).toBe(false);
    expect(result.current.catalog).toEqual([sampleCar]);
    expect(result.current.catalogSource).toBe("seed");
    expect(result.current.disclaimer).toBe("Static disclaimer from JSON");
    expect(loadAiCatalogSeedOnly).not.toHaveBeenCalled();
  });
});
