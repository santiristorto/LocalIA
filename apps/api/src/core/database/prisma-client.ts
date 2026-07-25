import { PrismaClient } from "@prisma/client";

/**
 * Cliente de Prisma — instancia única del proceso (Backend Architecture
 * Specification §17). Se conecta con el rol de aplicación de permisos
 * acotados, nunca con `service_role`.
 */
export const prisma = new PrismaClient();
