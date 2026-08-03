import type { Prisma } from "@prisma/client";

import { prisma } from "./prisma-client.js";

/**
 * Ejecuta `callback` dentro de una transacción con la variable de sesión
 * `app.current_user_id` seteada — Database Specification §9.1/§9.3,
 * Backend Architecture Specification §11.
 *
 * Es lo que permite que las políticas de RLS (que evalúan
 * `fn_current_user_id()`, ver migración `20260717000001`) reconozcan al
 * usuario autenticado. `set_config(..., true)` lo setea como `SET LOCAL`
 * (transaction-scoped): se descarta automáticamente al terminar la
 * transacción, sin riesgo de que un valor quede pegado a una conexión
 * reutilizada por el pool.
 *
 * Todo repositorio que consulte una tabla con RLS basada en el usuario
 * autenticado pasa por acá — nunca usa `prisma` directamente para esas
 * tablas.
 */
export async function withUserContext<T>(
  userId: string,
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, true)`;
    return callback(tx);
  });
}
