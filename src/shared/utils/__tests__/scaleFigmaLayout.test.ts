import { scaleFigmaInset } from "../scaleFigmaLayout";

describe("scaleFigmaInset", () => {
  const design = { width: 335, height: 385 };

  it("scales proportionally on width axis", () => {
    expect(scaleFigmaInset(24, { width: 167.5, height: 192.5 }, design, "width")).toBe(12);
  });

  it("scales proportionally on height axis", () => {
    expect(scaleFigmaInset(14, { width: 335, height: 385 }, design, "height")).toBe(14);
  });
});
