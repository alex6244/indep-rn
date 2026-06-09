/** Max digits for dd.mm.yyyy (2 + 2 + 4). */
const MAX_DATE_DIGITS = 8;

const DD_MM_YYYY_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/;

export const MIN_OWNERSHIP_YEAR = 1900;
export const MAX_OWNERSHIP_YEAR = 2100;

export type DdMmYyyyParts = {
  day: number;
  month: number;
  year: number;
};

export type OwnerDateField = "startDate" | "endDate";

export type OwnerDateFieldError = {
  field: OwnerDateField;
  message: string;
};

/**
 * Restricts ownership date input to dd.mm.yyyy (digits only, dots inserted automatically).
 */
export function formatDdMmYyyyInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, MAX_DATE_DIGITS);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

export const DD_MM_YYYY_PLACEHOLDER = "дд.мм.гггг";

/** Length of a complete masked value: "31.12.2024". */
export const DD_MM_YYYY_MAX_LENGTH = 10;

/** Splits a masked string into day / month / year, or null if the format is wrong. */
export function parseDdMmYyyy(value: string): DdMmYyyyParts | null {
  const match = DD_MM_YYYY_PATTERN.exec(value.trim());
  if (!match) return null;
  return {
    day: Number(match[1]),
    month: Number(match[2]),
    year: Number(match[3]),
  };
}

type ValidDateOptions = {
  minYear?: number;
  maxYear?: number;
};

/**
 * True when the string is a real calendar date in dd.mm.yyyy (rejects 31.02.2024, 00.00.0000, etc.).
 */
export function isValidDdMmYyyy(
  value: string,
  options: ValidDateOptions = {},
): boolean {
  const parts = parseDdMmYyyy(value);
  if (!parts) return false;

  const minYear = options.minYear ?? MIN_OWNERSHIP_YEAR;
  const maxYear = options.maxYear ?? MAX_OWNERSHIP_YEAR;

  const { day, month, year } = parts;
  if (year < minYear || year > maxYear) return false;
  if (month < 1 || month > 12 || day < 1) return false;

  const probe = new Date(year, month - 1, day);
  return (
    probe.getFullYear() === year &&
    probe.getMonth() === month - 1 &&
    probe.getDate() === day
  );
}

/**
 * Compares two valid dd.mm.yyyy strings. Returns null if either value is invalid.
 * -1 if a < b, 0 if equal, 1 if a > b.
 */
export function compareDdMmYyyy(a: string, b: string): number | null {
  const left = parseDdMmYyyy(a);
  const right = parseDdMmYyyy(b);
  if (!left || !right) return null;
  if (!isValidDdMmYyyy(a) || !isValidDdMmYyyy(b)) return null;

  const timeA = new Date(left.year, left.month - 1, left.day).getTime();
  const timeB = new Date(right.year, right.month - 1, right.day).getTime();
  if (timeA === timeB) return 0;
  return timeA < timeB ? -1 : 1;
}

/** End of ownership must be on or after the start date (both must be valid). */
export function isEndDateOnOrAfterStart(start: string, end: string): boolean {
  const order = compareDdMmYyyy(start, end);
  return order !== null && order <= 0;
}

export function validateOwnerDateField(
  value: string,
  field: OwnerDateField,
): string | null {
  const label =
    field === "startDate" ? "дату начала владения" : "дату окончания владения";

  if (!value.trim()) {
    return `Укажите ${label}.`;
  }
  if (!isValidDdMmYyyy(value)) {
    return "Некорректная дата. Используйте формат дд.мм.гггг.";
  }
  return null;
}

/** Validates one owner row; returns the first field error or null. */
export function validateOwnerDates(owner: {
  startDate: string;
  endDate: string;
}): OwnerDateFieldError | null {
  const startError = validateOwnerDateField(owner.startDate, "startDate");
  if (startError) {
    return { field: "startDate", message: startError };
  }

  const endError = validateOwnerDateField(owner.endDate, "endDate");
  if (endError) {
    return { field: "endDate", message: endError };
  }

  if (!isEndDateOnOrAfterStart(owner.startDate, owner.endDate)) {
    return {
      field: "endDate",
      message: "Дата окончания не может быть раньше даты начала.",
    };
  }

  return null;
}

/** Validates every owner block before leaving the create-report screen. */
export function validateAllOwnersDates(
  owners: { startDate: string; endDate: string }[],
): OwnerDateFieldError | null {
  for (const owner of owners) {
    const error = validateOwnerDates(owner);
    if (error) return error;
  }
  return null;
}

export type OwnerFieldErrors = Partial<Record<OwnerDateField, string>>;

function validateOwnerRowFieldErrors(owner: {
  startDate: string;
  endDate: string;
}): OwnerFieldErrors {
  const errors: OwnerFieldErrors = {};

  const startError = validateOwnerDateField(owner.startDate, "startDate");
  if (startError) errors.startDate = startError;

  const endError = validateOwnerDateField(owner.endDate, "endDate");
  if (endError) {
    errors.endDate = endError;
  } else if (
    !startError &&
    owner.startDate.trim() &&
    owner.endDate.trim() &&
    !isEndDateOnOrAfterStart(owner.startDate, owner.endDate)
  ) {
    errors.endDate = "Дата окончания не может быть раньше даты начала.";
  }

  return errors;
}

/** All owner date errors keyed by owner id; firstError for banner text. */
export function collectAllOwnerDateErrors(
  owners: { id: string; startDate: string; endDate: string }[],
): {
  errorsByOwnerId: Record<string, OwnerFieldErrors>;
  firstError: OwnerDateFieldError | null;
} {
  const errorsByOwnerId: Record<string, OwnerFieldErrors> = {};
  let firstError: OwnerDateFieldError | null = null;

  for (const owner of owners) {
    const rowErrors = validateOwnerRowFieldErrors(owner);
    if (Object.keys(rowErrors).length === 0) continue;

    errorsByOwnerId[owner.id] = rowErrors;

    if (!firstError) {
      const field: OwnerDateField = rowErrors.startDate ? "startDate" : "endDate";
      firstError = { field, message: rowErrors[field]! };
    }
  }

  return { errorsByOwnerId, firstError };
}
