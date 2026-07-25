import type { ReactNode } from "react";

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/**
 * FormField — UX/UI Specification §0.7 (accesibilidad global): asocia
 * label↔input explícitamente y anuncia el error con `aria-live`, una sola
 * vez acá en vez de repetirlo en cada formulario del producto.
 */
export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          aria-live="polite"
          className="text-sm text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
