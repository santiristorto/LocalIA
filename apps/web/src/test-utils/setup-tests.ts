import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// jsdom no implementa `window.matchMedia` — lo necesita `ThemeProvider`
// para resolver el modo "seguir al sistema". Sin este polyfill, cualquier
// árbol de componentes que incluya `ThemeProvider` rompe en tests.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Sin esto, el DOM de un test queda montado para el siguiente dentro del
// mismo archivo (Vitest no limpia automáticamente como sí hace Jest con
// `testEnvironment: jsdom` + `testing-library/jest-dom` en algunos presets).
afterEach(() => {
  cleanup();
});
