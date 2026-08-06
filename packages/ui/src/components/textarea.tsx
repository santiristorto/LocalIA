import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

/** Textarea — mismo criterio visual/de accesibilidad que `Input`. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ hasError = false, className = "", ...props }, ref) {
    const base =
      "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:disabled:bg-gray-800";

    const state = hasError
      ? "border-danger focus-visible:outline-danger"
      : "border-gray-300 focus-visible:outline-primary dark:border-gray-700";

    return (
      <textarea
        ref={ref}
        className={`${base} ${state} ${className}`}
        aria-invalid={hasError}
        {...props}
      />
    );
  },
);
