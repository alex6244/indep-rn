function isValidEmailShape(email: string): boolean {
  const atIndex = email.indexOf("@");
  return atIndex > 0 && atIndex < email.length - 1;
}

export function maskEmail(email: string): string {
  const normalized = email.trim();
  if (!isValidEmailShape(normalized)) return "указанный email";
  const [localPart, domain] = normalized.split("@");
  if (!localPart || !domain) return "указанный email";
  const visible = localPart[0] ?? "";
  return `${visible}***@${domain}`;
}

export function sanitizeOtpCode(value: string): string {
  return value.replace(/[^\d]/g, "").slice(0, 6);
}

export function formatResendCountdown(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}
