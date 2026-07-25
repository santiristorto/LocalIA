import { randomBytes } from "node:crypto";

/**
 * Genera un slug único a partir de un nombre — API Specification §3.1:
 * "se resuelve internamente con sufijo antes de fallar" ante una eventual
 * colisión. En vez de consultar la base para detectar el choque y reintentar,
 * se agrega siempre un sufijo aleatorio corto — más simple, y la
 * probabilidad de colisión de dos sufijos iguales para el mismo nombre es
 * despreciable para el volumen de este producto.
 */
export function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");

  const suffix = randomBytes(3).toString("hex");

  return `${base}-${suffix}`;
}
