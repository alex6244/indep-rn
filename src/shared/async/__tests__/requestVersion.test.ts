import { createRequestVersionTracker } from "../requestVersion";

describe("requestVersionTracker", () => {
  it("marks only latest request version as active", () => {
    const tracker = createRequestVersionTracker();
    const first = tracker.next();
    const second = tracker.next();

    expect(tracker.isActive(first)).toBe(false);
    expect(tracker.isActive(second)).toBe(true);
  });
});

