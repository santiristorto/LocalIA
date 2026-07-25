import type { Config } from "tailwindcss";

/**
 * Configuración de Tailwind — UX/UI Specification §0 (sistema de diseño).
 *
 * Sprint 0: solo la paleta de color base ya definida en la especificación.
 * El resto de los tokens (espaciado, tipografía, sombras) se amplían a
 * medida que el sistema de diseño (`@localia/ui`) los necesite.
 *
 * Sprint 1B: `darkMode: "class"` — el tema lo controla `ThemeProvider`
 * agregando/quitando la clase `dark` en `<html>`, no `prefers-color-scheme`
 * directo, para poder ofrecer un toggle manual además de "seguir al sistema".
 */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          dark: "#3730A3",
        },
        accent: "#0F9D8B",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
