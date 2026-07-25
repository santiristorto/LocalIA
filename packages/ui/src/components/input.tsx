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
    "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:disabled:bg-gray-800 [color-scheme:light] dark:[color-scheme:dark]";

  const state = hasError
    ? "border-danger focus-visible:outline-danger"
    : "border-gray-300 focus-visible:outline-primary dark:border-gray-700";

  return (
    <input
      ref={ref}
      className={`${base} ${state} ${className}`}
      aria-invalid={hasError}
      {...props}
    />
  );
});
