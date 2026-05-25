import { resolveFavoriteCars } from "../lib/resolveFavoriteCars";
import { carService } from "../../../services/carService";

jest.mock("../../../services/carService", () => ({
  carService: {
    getById: jest.fn(),
  },
}));

describe("resolveFavoriteCars", () => {
  it("returns empty array for no ids", async () => {
    await expect(resolveFavoriteCars([])).resolves.toEqual([]);
  });

  it("skips ids that fail to load", async () => {
    (carService.getById as jest.Mock)
      .mockResolvedValueOnce({ id: "1", title: "A" })
      .mockRejectedValueOnce(new Error("not found"));

    const result = await resolveFavoriteCars(["1", "2"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });
});
