import { shouldShowLeadCta } from "../aiPickerUtils";

describe("shouldShowLeadCta", () => {
  it("shows CTA when server suggests lead and cars are selected", () => {
    expect(shouldShowLeadCta(true, 2, false)).toBe(true);
  });

  it("hides CTA when lead already sent", () => {
    expect(shouldShowLeadCta(true, 2, true)).toBe(false);
  });

  it("hides CTA when no cars selected", () => {
    expect(shouldShowLeadCta(true, 0, false)).toBe(false);
  });
});
