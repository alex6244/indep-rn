export function getContractApiBaseUrl(): string {
  const raw = process.env.CONTRACT_API_URL?.trim() || "https://indep.su/api/v1.0";
  return raw.replace(/\/$/, "");
}

export function unwrapEnvelope(payload: unknown): unknown {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

export async function contractFetch(
  path: string,
  init?: RequestInit,
): Promise<{ status: number; body: unknown }> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${getContractApiBaseUrl()}${normalizedPath}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    },
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  return { status: response.status, body };
}

export function hasErrorShape(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  if ("error" in body) return true;
  if ("message" in body && !("id" in body) && !("email" in body)) return true;
  return false;
}
