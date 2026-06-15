import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "@jest/globals";

type EasBuildProfile = {
  env?: Record<string, string>;
};

type EasConfig = {
  build: {
    preview: EasBuildProfile;
    production: EasBuildProfile;
  };
};

const easPath = path.resolve(__dirname, "../../../eas.json");
const eas = JSON.parse(readFileSync(easPath, "utf8")) as EasConfig;

describe("eas.json production AI API env", () => {
  it("sets EXPO_PUBLIC_AI_API_URL in production matching preview", () => {
    const previewUrl = eas.build.preview.env?.EXPO_PUBLIC_AI_API_URL;
    const productionUrl = eas.build.production.env?.EXPO_PUBLIC_AI_API_URL;

    expect(productionUrl).toBeDefined();
    expect(productionUrl).toBe(previewUrl);
    expect(productionUrl).toMatch(/^https:\/\//);
    expect(productionUrl?.endsWith("/")).toBe(false);
  });
});
