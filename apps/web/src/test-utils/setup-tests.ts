import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// Sin esto, el DOM de un test queda montado para el siguiente dentro del
// mismo archivo (Vitest no limpia automáticamente como sí hace Jest con
// `testEnvironment: jsdom` + `testing-library/jest-dom` en algunos presets).
afterEach(() => {
  cleanup();
});
