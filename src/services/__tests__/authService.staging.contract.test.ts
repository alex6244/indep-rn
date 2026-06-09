import { mapApiUserToDomain, pickAccessToken, toApiRole } from "../authService";
import {
  contractFetch,
  getContractApiBaseUrl,
  hasErrorShape,
  unwrapEnvelope,
} from "./helpers/contractAuth";

const CONTRACT_ENABLED = process.env.CONTRACT_TEST === "1";
const describeContract = CONTRACT_ENABLED ? describe : describe.skip;

function envOrNull(key: string): string | null {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : null;
}

describeContract("authService staging contract", () => {
  jest.setTimeout(60_000);

  it("POST /auth/request-verification returns 2xx with a body", async () => {
    const email = envOrNull("CONTRACT_AUTH_EMAIL");
    if (!email) {
      console.warn(
        "[contract-auth] Skip request-verification: set CONTRACT_AUTH_EMAIL",
      );
      return;
    }

    const role = envOrNull("CONTRACT_AUTH_ROLE") ?? "client";
    const name = envOrNull("CONTRACT_AUTH_NAME");
    const payload: Record<string, string> = { email, role: toApiRole(role) };
    if (name) payload.name = name;

    const { status, body } = await contractFetch("/auth/request-verification", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(300);
    expect(body).not.toBeNull();
    expect(typeof body === "object").toBe(true);
  });

  it("happy path: confirm-verification → me with issued token", async () => {
    const email = envOrNull("CONTRACT_AUTH_EMAIL");
    const otp = envOrNull("CONTRACT_AUTH_OTP");
    if (!email || !otp) {
      console.warn(
        "[contract-auth] Skip happy path: set CONTRACT_AUTH_EMAIL and CONTRACT_AUTH_OTP (or enable staging OTP bypass)",
      );
      return;
    }

    const role = envOrNull("CONTRACT_AUTH_ROLE") ?? "client";
    const name = envOrNull("CONTRACT_AUTH_NAME");
    const requestPayload: Record<string, string> = {
      email,
      role: toApiRole(role),
    };
    if (name) requestPayload.name = name;

    const request = await contractFetch("/auth/request-verification", {
      method: "POST",
      body: JSON.stringify(requestPayload),
    });
    expect(request.status).toBeGreaterThanOrEqual(200);
    expect(request.status).toBeLessThan(300);

    const confirm = await contractFetch("/auth/confirm-verification", {
      method: "POST",
      body: JSON.stringify({ email, code: otp, ...requestPayload }),
    });
    expect(confirm.status).toBeGreaterThanOrEqual(200);
    expect(confirm.status).toBeLessThan(300);

    const confirmData = unwrapEnvelope(confirm.body);
    const accessToken = pickAccessToken(confirmData);
    expect(accessToken).toBeTruthy();

    const me = await contractFetch("/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(me.status).toBe(200);

    const meUser = mapApiUserToDomain(unwrapEnvelope(me.body));
    expect(meUser).not.toBeNull();
    expect(meUser?.email).toBe(email);
    expect(meUser?.id).toBeTruthy();
  });

  it("confirm with invalid OTP returns 4xx and error body", async () => {
    const email = envOrNull("CONTRACT_AUTH_EMAIL");
    if (!email) {
      console.warn(
        "[contract-auth] Skip invalid OTP: set CONTRACT_AUTH_EMAIL",
      );
      return;
    }

    const { status, body } = await contractFetch("/auth/confirm-verification", {
      method: "POST",
      body: JSON.stringify({ email, code: "000000" }),
    });

    expect(status).toBeGreaterThanOrEqual(400);
    expect(status).toBeLessThan(500);
    expect(hasErrorShape(body)).toBe(true);
  });

  it("documents contract base URL for operators", () => {
    expect(getContractApiBaseUrl()).toMatch(/^https:\/\//);
  });
});
