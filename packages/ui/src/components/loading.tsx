import { Spinner } from "./spinner.js";

export interface LoadingProps {
  label?: string;
  /** `screen` centra en toda la altura de la ventana (guards de ruta); `section` centra dentro de su contenedor (una tarjeta, un panel). */
  variant?: "screen" | "section";
}

/**
 * Loading — estado de carga a nivel de pantalla o de sección, construido
 * sobre `Spinner` (que es solo el ícono girando + texto inline). No
 * duplica la animación, solo el contenedor: UX/UI Specification §0.6.
 */
export function Loading({ label, variant = "section" }: LoadingProps) {
  const containerClass =
    variant === "screen"
      ? "flex min-h-screen items-center justify-center"
      : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <Spinner label={label} />
    </div>
  );
}
