import { SignJWT, createLocalJWKSet, exportJWK, generateKeyPair } from "jose";
import type { JWTVerifyGetKey, KeyLike } from "jose";

import { SUPABASE_ISSUER } from "../core/auth/verify-supabase-jwt.js";

/**
 * Reemplazo del `SUPABASE_JWT_SECRET` (HS256) que este helper usaba antes
 * de la migración a JWKS. Ahora firma con una clave ES256 generada en el
 * momento, y publica su mitad pública como un JWKS *local* (`createLocalJWKSet`,
 * no `createRemoteJWKSet`) — mismo mecanismo de verificación que produción,
 * sin ninguna llamada de red real. El `kid` es el mismo que usa Supabase
 * para identificar qué clave de la rotación firmó cada token.
 */
const TEST_KID = "test-key-1";

let cached: { privateKey: KeyLike; jwks: JWTVerifyGetKey } | null = null;

async function getTestKeys() {
  if (cached) return cached;

  const { privateKey, publicKey } = await generateKeyPair("ES256", {
    extractable: true,
  });
  const publicJwk = await exportJWK(publicKey);

  const jwks = createLocalJWKSet({
    keys: [{ ...publicJwk, kid: TEST_KID, alg: "ES256", use: "sig" }],
  });

  cached = { privateKey, jwks };
  return cached;
}

/** JWKS local de prueba — se inyecta en `createAuthenticate()` en los tests. */
export async function getTestJWKS(): Promise<JWTVerifyGetKey> {
  const { jwks } = await getTestKeys();
  return jwks;
}

/**
 * Firma un JWT de prueba con la clave privada de `getTestKeys()`, simulando
 * el token que emitiría Supabase Auth (mismo `iss`, mismo formato de
 * claims). Solo para uso en tests.
 */
export async function signTestJwt(payload: {
  sub: string;
  email?: string;
  fullName?: string;
}): Promise<string> {
  const { privateKey } = await getTestKeys();

  return new SignJWT({
    email: payload.email,
    user_metadata: payload.fullName
      ? { full_name: payload.fullName }
      : undefined,
  })
    .setProtectedHeader({ alg: "ES256", kid: TEST_KID })
    .setSubject(payload.sub)
    .setIssuer(SUPABASE_ISSUER)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);
}
