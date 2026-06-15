import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { AiPickerApiError } from "../../api/aiPickerApiError";
import { AI_PICKER_AUTH_REQUIRED_MESSAGE } from "../../api/aiPickerEnv";
import type { AiCatalogItem, AiSiteProfile } from "../../types";
import { useAiPickerChat } from "../useAiPickerChat";

const mockDispatch = jest.fn();
const mockBuildRuleBasedReply = jest.fn();
const scrollToEnd = jest.fn();

jest.mock("../../../../store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock("../../api/aiPickerApi", () => ({
  aiPickerApi: {
    endpoints: {
      sendAiChat: { initiate: jest.fn() },
    },
  },
}));

jest.mock("../../api/aiPickerEnv", () => ({
  isAiPickerLocalFallbackEnabled: jest.fn(),
}));

jest.mock("../../chat/ruleBasedReply", () => ({
  buildRuleBasedReply: (...args: unknown[]) => mockBuildRuleBasedReply(...args),
}));

const { aiPickerApi } = jest.requireMock("../../api/aiPickerApi") as {
  aiPickerApi: {
    endpoints: {
      sendAiChat: { initiate: jest.Mock };
    };
  };
};

const { isAiPickerLocalFallbackEnabled } = jest.requireMock("../../api/aiPickerEnv") as {
  isAiPickerLocalFallbackEnabled: jest.Mock;
};

const site: AiSiteProfile = {
  siteId: "indep",
  displayName: "Indep",
  mode: "multibrand",
  allowOrder: true,
  catalogBannersUrl: "https://example.com/banners",
  locale: "ru",
  disclaimer: "Disclaimer",
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

function renderChatHook(useRemoteApi: boolean) {
  return renderHook(() =>
    useAiPickerChat({
      siteId: "indep",
      catalog: [sampleCar],
      catalogLoading: false,
      useRemoteApi,
      site,
      welcomeText: "Welcome",
      selectedCount: 0,
      scrollToEnd,
    }),
  );
}

describe("useAiPickerChat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockImplementation((action: { unwrap: () => Promise<unknown> }) => action);
    mockBuildRuleBasedReply.mockReturnValue({
      text: "Rule-based reply",
      cars: [sampleCar],
    });
  });

  it("returns remote assistant message on sendAiChat success", async () => {
    aiPickerApi.endpoints.sendAiChat.initiate.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          text: "Remote pick",
          cars: [sampleCar],
          replySource: "llm",
        }),
    });

    const { result } = renderChatHook(true);

    act(() => {
      result.current.setDraft("KIA до 2 млн");
    });
    await act(async () => {
      await result.current.sendUserMessage();
    });

    await waitFor(() => {
      expect(
        result.current.messages.some((m) => m.role === "assistant" && m.text === "Remote pick"),
      ).toBe(true);
    });
    expect(mockBuildRuleBasedReply).not.toHaveBeenCalled();
  });

  it("shows auth message on 401 without local fallback", async () => {
    isAiPickerLocalFallbackEnabled.mockReturnValue(false);

    aiPickerApi.endpoints.sendAiChat.initiate.mockReturnValue({
      unwrap: () =>
        Promise.reject(new AiPickerApiError(AI_PICKER_AUTH_REQUIRED_MESSAGE, 401, "unauthorized")),
    });

    const { result } = renderChatHook(true);

    act(() => {
      result.current.setDraft("BMW");
    });
    await act(async () => {
      await result.current.sendUserMessage();
    });

    await waitFor(() => {
      expect(
        result.current.messages.some((m) => m.role === "assistant" && m.text === AI_PICKER_AUTH_REQUIRED_MESSAGE),
      ).toBe(true);
    });
    expect(mockBuildRuleBasedReply).not.toHaveBeenCalled();
  });

  it("falls back to rule-based reply on 401 when local fallback enabled", async () => {
    isAiPickerLocalFallbackEnabled.mockReturnValue(true);
    mockBuildRuleBasedReply.mockReturnValue({
      text: "Mock rules pick",
      cars: [sampleCar],
      suggestLead: false,
    });

    aiPickerApi.endpoints.sendAiChat.initiate.mockReturnValue({
      unwrap: () =>
        Promise.reject(new AiPickerApiError(AI_PICKER_AUTH_REQUIRED_MESSAGE, 401, "unauthorized")),
    });

    const { result } = renderChatHook(true);

    act(() => {
      result.current.setDraft("киа рио");
    });
    await act(async () => {
      await result.current.sendUserMessage();
    });

    await waitFor(() => {
      expect(mockBuildRuleBasedReply).toHaveBeenCalledWith("киа рио", [sampleCar], {
        selectedCount: 0,
        fixedBrand: undefined,
      });
    });
  });

  it("falls back to rule-based reply on network error when enabled", async () => {
    isAiPickerLocalFallbackEnabled.mockReturnValue(true);

    aiPickerApi.endpoints.sendAiChat.initiate.mockReturnValue({
      unwrap: () => Promise.reject(new Error("network down")),
    });

    const { result } = renderChatHook(true);

    act(() => {
      result.current.setDraft("на дачу");
    });
    await act(async () => {
      await result.current.sendUserMessage();
    });

    await waitFor(() => {
      expect(mockBuildRuleBasedReply).toHaveBeenCalledWith("на дачу", [sampleCar], {
        selectedCount: 0,
        fixedBrand: undefined,
      });
    });
  });

  it("uses rule-based reply when remote API is off", async () => {
    const { result } = renderChatHook(false);

    act(() => {
      result.current.setDraft("семейный авто");
    });
    await act(async () => {
      await result.current.sendUserMessage();
    });

    await waitFor(() => {
      expect(mockBuildRuleBasedReply).toHaveBeenCalledWith("семейный авто", [sampleCar], {
        selectedCount: 0,
        fixedBrand: undefined,
      });
    });
  });
});
