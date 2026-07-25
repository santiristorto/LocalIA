import { createRemoteJWKSet, jwtVerify } from "jose";
import type { JWTVerifyGetKey } from "jose";

import { env } from "../config/env.js";

/**
 * Datos que efectivamente necesitamos del JWT de Supabase — Backend
 * Architecture Specification §9.
 *
 * Supabase incluye muchos más claims (`aud`, `role`, `app_metadata`, etc.);
 * acá solo se tipan los que este sprint consume, para no acoplar el resto
 * del código a la forma completa del token.
 */
export interface SupabaseJwtPayload {
  sub: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

/**
 * Verificación de JWT de Supabase Auth — migrado al mecanismo moderno
 * recomendado por Supabase (Docs → "JSON Web Token (JWT)" →
 * "Verifying a JWT from Supabase"): claves asimétricas (ES256/RSA)
 * resueltas vía el endpoint JWKS público del proyecto, no un secreto
 * compartido.
 *
 *   GET https://<project-id>.supabase.co/auth/v1/.well-known/jwks.json
 *
 * No hay ningún secreto que guardar del lado del backend: el endpoint
 * publica únicamente claves *públicas*, seguras de exponer. Esto es lo que
 * permite verificar la firma sin confiar en, ni depender de, la
 * disponibilidad del servidor de Auth de Supabase en cada request.
 */
export const SUPABASE_ISSUER = `${env.SUPABASE_URL}/auth/v1`;

/**
 * `createRemoteJWKSet` cachea las claves en memoria y las revalida
 * automáticamente cuando aparece un `kid` que no conoce (rotación de
 * claves) — no hay que gestionar el cache a mano ni recargar el proceso al
 * rotar una clave en el dashboard de Supabase.
 */
const defaultJWKS: JWTVerifyGetKey = createRemoteJWKSet(
  new URL(`${SUPABASE_ISSUER}/.well-known/jwks.json`),
);

/**
 * Verifica la firma, expiración y emisor de un JWT emitido por Supabase
 * Auth. `jwks` es inyectable — en producción resuelve contra el endpoint
 * JWKS real del proyecto (valor por defecto); en tests se inyecta un JWKS
 * local (`test-utils/sign-test-jwt.ts`), sin depender de red.
 *
 * No se fuerza ningún `algorithms` a mano: `jwtVerify` + el JWKS resuelven
 * el algoritmo correcto automáticamente a partir del `kid`/`alg` publicado
 * en cada clave — es lo que hace que esta implementación siga funcionando
 * sin cambios si Supabase rota de ES256 a RSA, o publica una clave nueva
 * junto a la anterior durante una rotación.
 */
export async function verifySupabaseJwt(
  token: string,
  jwks: JWTVerifyGetKey = defaultJWKS,
): Promise<SupabaseJwtPayload> {
  const { payload } = await jwtVerify(token, jwks, {
    issuer: SUPABASE_ISSUER,
  });

  if (typeof payload.sub !== "string") {
    throw new Error('Token sin "sub" válido');
  }

  return payload as SupabaseJwtPayload;
}
