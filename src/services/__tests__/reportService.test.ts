import { reportService } from "../reportService";

jest.mock("../api", () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

const { api } = jest.requireMock("../api") as {
  api: {
    post: jest.Mock;
    get: jest.Mock;
  };
};

describe("reportService contract", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submit returns SubmittedReport shape from api", async () => {
    const payload = {
      id: "rep-1",
      carId: "car-1",
      pickerId: "picker-1",
      status: "pending",
      createdAt: "2026-04-14T10:00:00.000Z",
      data: { mileage: "100000" },
    };
    api.post.mockResolvedValue(payload);

    const result = await reportService.submit(payload.data as never);

    expect(api.post).toHaveBeenCalledWith("/reports", payload.data);
    expect(result).toEqual(payload);
  });

  it("getById returns SubmittedReport shape", async () => {
    const payload = {
      id: "rep-2",
      carId: "car-2",
      pickerId: "picker-2",
      status: "completed",
      createdAt: "2026-04-14T11:00:00.000Z",
      data: { mileage: "120000" },
    };
    api.get.mockResolvedValue(payload);

    const result = await reportService.getById("rep-2");

    expect(api.get).toHaveBeenCalledWith("/reports/rep-2");
    expect(result).toEqual(payload);
  });

  it("getMy returns array shape", async () => {
    const payload = [
      {
        id: "rep-3",
        carId: "car-3",
        pickerId: "picker-3",
        status: "draft",
        createdAt: "2026-04-14T12:00:00.000Z",
        data: { mileage: "140000" },
      },
    ];
    api.get.mockResolvedValue(payload);

    const result = await reportService.getMy();

    expect(api.get).toHaveBeenCalledWith("/reports/my");
    expect(result).toEqual(payload);
  });

  it("propagates api errors without changing shape", async () => {
    const apiError = { status: 500, message: "Server Error" };
    api.get.mockRejectedValue(apiError);

    await expect(reportService.getMy()).rejects.toMatchObject({
      status: 500,
      message: "Server Error",
    });
  });
});

