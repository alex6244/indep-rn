import { getMissingRequiredMediaKeys, validateMediaUpload } from "../mediaValidation";

const emptyMedia = {
  salonPhoto: null,
  bodyPhoto: null,
  salonVideo: null,
  bodyVideo: null,
};

describe("validateMediaUpload", () => {
  it("requires salon and body photos", () => {
    expect(validateMediaUpload(emptyMedia)).toBe("Загрузите фото салона и фото кузова");
  });

  it("passes when both photos present", () => {
    const result = validateMediaUpload({
      ...emptyMedia,
      salonPhoto: "file://salon.jpg",
      bodyPhoto: "file://body.jpg",
    });
    expect(result).toBeNull();
  });

  it("reports single missing photo", () => {
    const result = validateMediaUpload({
      ...emptyMedia,
      salonPhoto: "file://salon.jpg",
    });
    expect(result).toBe("Загрузите фото кузова");
  });
});

describe("getMissingRequiredMediaKeys", () => {
  it("lists missing keys", () => {
    expect(getMissingRequiredMediaKeys(emptyMedia)).toEqual(["salonPhoto", "bodyPhoto"]);
  });
});
