import type { ReactNode } from "react";

export interface AlertProps {
  variant: "success" | "error";
  children: ReactNode;
}

/** Alert — banner de éxito/error, usado en los formularios de auth. */
export function Alert({ variant, children }: AlertProps) {
  const styles =
    variant === "success"
      ? "border-success/30 bg-success/10 text-success"
      : "border-danger/30 bg-danger/10 text-danger";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      {children}
    </div>
  );
}
