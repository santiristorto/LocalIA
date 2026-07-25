import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { ThemeContext, type Theme } from "./theme-context.ts";

const STORAGE_KEY = "localia:theme";

function getSystemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
}

/**
 * ThemeProvider — Frontend Architecture Specification §7. Tres modos
 * (claro/oscuro/seguir al sistema), persistidos en `localStorage`, aplicados
 * agregando/quitando la clase `dark` en `<html>` (consistente con
 * `darkMode: "class"` de `tailwind.config.ts`).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  const resolvedTheme = useMemo<"light" | "dark">(() => {
    if (theme === "system") {
      return getSystemPrefersDark() ? "dark" : "light";
    }
    return theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      document.documentElement.classList.toggle("dark", media.matches);
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  function setTheme(next: Theme) {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
