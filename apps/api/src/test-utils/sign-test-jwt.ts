import { SignJWT } from "jose";

/**
 * Firma un JWT de prueba con el mismo secreto que usan los tests
 * (`vitest.config.ts` → `SUPABASE_JWT_SECRET`), simulando el token que
 * emitiría Supabase Auth. Solo para uso en tests.
 */
export async function signTestJwt(payload: {
  sub: string;
  email?: string;
  fullName?: string;
}): Promise<string> {
  const secret = new TextEncoder().encode(
    "test-secret-not-for-production-min-32-chars",
  );

  return new SignJWT({
    email: payload.email,
    user_metadata: payload.fullName
      ? { full_name: payload.fullName }
      : undefined,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}
