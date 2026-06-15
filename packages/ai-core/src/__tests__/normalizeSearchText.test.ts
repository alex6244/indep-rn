import { normalizeSearchText, tokenizeSearchText } from "../normalizeSearchText";

describe("normalizeSearchText", () => {
  it("maps киа рио and KIA Rio to overlapping tokens", () => {
    const cyrillic = tokenizeSearchText("киа рио");
    const latin = tokenizeSearchText("KIA Rio");
    expect(cyrillic).toEqual(expect.arrayContaining(["kia", "rio"]));
    expect(latin).toEqual(expect.arrayContaining(["kia", "rio"]));
    expect(cyrillic.filter((t) => latin.includes(t))).toEqual(
      expect.arrayContaining(["kia", "rio"]),
    );
  });

  it("normalizes БМВ to bmw via brand alias", () => {
    const tokens = tokenizeSearchText("БМВ");
    expect(tokens).toContain("bmw");
    expect(normalizeSearchText("БМВ")).toBe("bmv");
  });
});
