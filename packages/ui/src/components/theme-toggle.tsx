export interface ThemeToggleProps {
  resolvedTheme: "light" | "dark";
  onToggle: () => void;
}

/**
 * ThemeToggle — botón simple claro↔oscuro. Vive en `@localia/ui` porque,
 * a diferencia de `ThemeProvider` (que conoce `localStorage`/`matchMedia`,
 * detalle de `apps/web`), este componente es puramente presentacional.
 */
export function ThemeToggle({ resolvedTheme, onToggle }: ThemeToggleProps) {
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}
