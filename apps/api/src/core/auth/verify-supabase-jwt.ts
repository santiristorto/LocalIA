import { jwtVerify } from "jose";

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

const secretKey = new TextEncoder().encode(env.SUPABASE_JWT_SECRET);

/**
 * Verifica la firma y expiración de un JWT emitido por Supabase Auth
 * (algoritmo HS256, secreto compartido de proyecto). Lanza si el token es
 * inválido, expiró, o la firma no corresponde — nunca decodifica sin
 * verificar.
 */
export async function verifySupabaseJwt(
  token: string,
): Promise<SupabaseJwtPayload> {
  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ["HS256"],
  });

  if (typeof payload.sub !== "string") {
    throw new Error('Token sin "sub" válido');
  }

  return payload as SupabaseJwtPayload;
}
