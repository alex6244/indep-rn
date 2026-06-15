import { createEmptyMediaUploadState } from "../../../types/draftReport";
import { getMissingRequiredMediaKeys, validateMediaUpload } from "../mediaValidation";

const emptyMedia = createEmptyMediaUploadState();

function withPhotos(count: number, prefix: string): string[] {
  return Array.from({ length: count }, (_, i) => `file://${prefix}_${i + 1}.jpg`);
}

describe("validateMediaUpload", () => {
  it("requires minimum body and salon photos", () => {
    expect(validateMediaUpload(emptyMedia)).toBe("Загрузите минимум 10 фото кузова");
  });

  it("passes when both required categories meet minimum", () => {
    const result = validateMediaUpload({
      ...emptyMedia,
      salonPhoto: withPhotos(5, "salon"),
      bodyPhoto: withPhotos(10, "body"),
    });
    expect(result).toBeNull();
  });

  it("reports missing salon photos when body is complete", () => {
    const result = validateMediaUpload({
      ...emptyMedia,
      bodyPhoto: withPhotos(10, "body"),
      salonPhoto: withPhotos(3, "salon"),
    });
    expect(result).toBe("Загрузите минимум 5 фото салона");
  });

  it("does not require videos", () => {
    const result = validateMediaUpload({
      ...emptyMedia,
      salonPhoto: withPhotos(5, "salon"),
      bodyPhoto: withPhotos(10, "body"),
      salonVideo: ["file://one.mp4"],
    });
    expect(result).toBeNull();
  });
});

describe("getMissingRequiredMediaKeys", () => {
  it("lists missing keys", () => {
    expect(getMissingRequiredMediaKeys(emptyMedia)).toEqual(["bodyPhoto", "salonPhoto"]);
  });

  it("returns empty when requirements met", () => {
    expect(
      getMissingRequiredMediaKeys({
        ...emptyMedia,
        salonPhoto: withPhotos(5, "salon"),
        bodyPhoto: withPhotos(10, "body"),
      }),
    ).toEqual([]);
  });
});
