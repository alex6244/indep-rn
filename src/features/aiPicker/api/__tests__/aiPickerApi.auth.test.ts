import { buildAiAuthHeaders } from "../aiPickerAuthHeaders";
import { AiPickerApiError } from "../aiPickerApiError";
import { AI_PICKER_AUTH_REQUIRED_MESSAGE } from "../aiPickerEnv";

jest.mock("../../../../services/api/tokenStorage", () => ({
  tokenStorage: {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
  },
}));

const { tokenStorage } = jest.requireMock("../../../../services/api/tokenStorage") as {
  tokenStorage: { get: jest.Mock };
};

describe("aiPickerApi auth headers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds Authorization when token exists", async () => {
    tokenStorage.get.mockResolvedValue("jwt-token");
    const headers = await buildAiAuthHeaders();
    expect(headers.Authorization).toBe("Bearer jwt-token");
  });

  it("throws unauthorized error when token is missing", async () => {
    tokenStorage.get.mockResolvedValue(null);
    await expect(buildAiAuthHeaders()).rejects.toMatchObject({
      message: AI_PICKER_AUTH_REQUIRED_MESSAGE,
      status: 401,
      code: "unauthorized",
    });
  });
});
