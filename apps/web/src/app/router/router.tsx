import { createBrowserRouter } from "react-router-dom";

import { WelcomePage } from "../../shared/pages/welcome-page.tsx";

/**
 * Frontend Architecture Specification §5.
 *
 * Sprint 0: una sola ruta placeholder, sin auth guards ni layouts todavía —
 * el árbol de rutas real (Employee Center, onboarding, auth) se construye a
 * partir del Sprint 2.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
]);
