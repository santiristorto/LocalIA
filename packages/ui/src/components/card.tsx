import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Card — contenedor base del sistema de diseño (UX/UI Specification §0):
 * borde sutil, esquinas redondeadas, sombra suave. Es la base visual de
 * `StatCard` y de cualquier bloque de contenido agrupado del Dashboard.
 */
export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
