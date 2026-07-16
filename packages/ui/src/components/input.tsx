import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

/** Input — UX/UI Specification §0. Foco visible, estado de error vía `aria-invalid`. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError = false, className = "", ...props },
  ref,
) {
  const base =
    "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-gray-50";

  const state = hasError
    ? "border-danger focus-visible:outline-danger"
    : "border-gray-300 focus-visible:outline-primary";

  return (
    <input
      ref={ref}
      className={`${base} ${state} ${className}`}
      aria-invalid={hasError}
      {...props}
    />
  );
});
