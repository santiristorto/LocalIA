export interface SpinnerProps {
  label?: string;
}

/** Spinner — estado de carga de pantalla completa (ej. resolviendo sesión). */
export function Spinner({ label = "Cargando…" }: SpinnerProps) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 text-sm text-gray-500"
    >
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
