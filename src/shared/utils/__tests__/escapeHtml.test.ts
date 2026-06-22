import { describe, expect, it } from "@jest/globals";
import { escapeHtml } from "../escapeHtml";

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });

  it("escapes ampersands first", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("KIA Rio 2024")).toBe("KIA Rio 2024");
  });
});
