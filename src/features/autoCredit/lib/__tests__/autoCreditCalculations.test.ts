import {
  adjustTermMonths,
  calcLoanPrincipal,
  calcMonthlyPayment,
  canAdjustTermMonths,
  clampDownPayment,
  clampTermMonths,
  formatTermMonths,
  snapCreditStep,
} from "../autoCreditCalculations";
import {
  CREDIT_AMOUNT_MAX,
  CREDIT_AMOUNT_MIN,
  CREDIT_AMOUNT_STEP,
  CREDIT_TERM_MONTHS_MAX,
  CREDIT_TERM_MONTHS_MIN,
} from "../../ui/autoCredit.content";

describe("calcLoanPrincipal", () => {
  it("subtracts down payment from credit amount", () => {
    expect(calcLoanPrincipal(1_350_000, 350_000)).toBe(1_000_000);
  });

  it("does not go below zero", () => {
    expect(calcLoanPrincipal(500_000, 600_000)).toBe(0);
  });
});

describe("calcMonthlyPayment", () => {
  it("divides principal by term months", () => {
    expect(calcMonthlyPayment(1_200_000, 36)).toBe(33_333);
  });

  it("returns zero for empty principal", () => {
    expect(calcMonthlyPayment(0, 60)).toBe(0);
  });
});

describe("snapCreditStep", () => {
  it("snaps to step within bounds", () => {
    expect(snapCreditStep(1_370_000, CREDIT_AMOUNT_STEP, CREDIT_AMOUNT_MIN, CREDIT_AMOUNT_MAX)).toBe(
      1_350_000,
    );
  });
});

describe("clampDownPayment", () => {
  it("clamps to credit amount", () => {
    expect(clampDownPayment(2_000_000, 1_000_000)).toBe(1_000_000);
  });
});

describe("term months helpers", () => {
  it("clamps to allowed range", () => {
    expect(clampTermMonths(6)).toBe(CREDIT_TERM_MONTHS_MIN);
    expect(clampTermMonths(120)).toBe(CREDIT_TERM_MONTHS_MAX);
    expect(clampTermMonths(48)).toBe(48);
  });

  it("adjusts by one month within bounds", () => {
    expect(adjustTermMonths(36, 1)).toBe(37);
    expect(adjustTermMonths(36, -1)).toBe(35);
    expect(adjustTermMonths(CREDIT_TERM_MONTHS_MIN, -1)).toBe(CREDIT_TERM_MONTHS_MIN);
    expect(adjustTermMonths(CREDIT_TERM_MONTHS_MAX, 1)).toBe(CREDIT_TERM_MONTHS_MAX);
  });

  it("reports whether month adjustment is allowed", () => {
    expect(canAdjustTermMonths(CREDIT_TERM_MONTHS_MIN, -1)).toBe(false);
    expect(canAdjustTermMonths(CREDIT_TERM_MONTHS_MAX, 1)).toBe(false);
    expect(canAdjustTermMonths(36, 1)).toBe(true);
  });

  it("formats months with years in parentheses when divisible by 12", () => {
    expect(formatTermMonths(36)).toBe("36 мес. (3 года)");
    expect(formatTermMonths(18)).toBe("18 мес.");
  });
});
