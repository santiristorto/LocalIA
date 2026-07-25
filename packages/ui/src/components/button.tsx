import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

/**
 * Button — UX/UI Specification §0.1/§0.6 (paleta, estados universales de
 * componente: default/hover/focus/active/disabled/loading).
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      isLoading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref,
  ) {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary",
      secondary:
        "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus-visible:outline-primary dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800",
      danger:
        "bg-danger text-white hover:opacity-90 focus-visible:outline-danger",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        disabled={disabled ?? isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);
