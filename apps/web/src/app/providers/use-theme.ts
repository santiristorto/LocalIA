import { useContext } from "react";

import { ThemeContext, type ThemeContextValue } from "./theme-context.ts";

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  }

  return context;
}
