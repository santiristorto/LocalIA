import { createBrowserRouter } from "react-router-dom";

import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from "../../features/auth/index.ts";
import { CustomersPage } from "../../features/customers/index.ts";
import {
  ComingSoonPage,
  DashboardHomePage,
} from "../../features/employee-center/index.ts";
import { OnboardingPage } from "../../features/onboarding/index.ts";
import { AppShellLayout } from "./app-shell-layout.tsx";
import { ProtectedRoute } from "./protected-route.tsx";
import { RequireNoOnboarding } from "./require-no-onboarding.tsx";
import { RequireOnboarding } from "./require-onboarding.tsx";

/**
 * Frontend Architecture Specification §5.
 *
 * `AppShellLayout` (TenantProvider + AppLayout) envuelve todas las
 * pantallas reales de la app, detrás de `RequireOnboarding`. Los módulos
 * sin pantalla propia todavía (Reservas, Agenda, Empleado IA,
 * Configuración) apuntan a `ComingSoonPage` — el día que cada uno se
 * construya, solo cambia el `element` de esa ruta puntual. `Clientes`
 * (Sprint 3) ya tiene pantalla real: `CustomersPage`.
 */
export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/registro", element: <RegisterPage /> },
  { path: "/recuperar-password", element: <ForgotPasswordPage /> },
  { path: "/restablecer-password", element: <ResetPasswordPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RequireNoOnboarding />,
        children: [{ path: "/onboarding", element: <OnboardingPage /> }],
      },
      {
        element: <RequireOnboarding />,
        children: [
          {
            element: <AppShellLayout />,
            children: [
              { path: "/", element: <DashboardHomePage /> },
              { path: "/customers", element: <CustomersPage /> },
              {
                path: "/reservations",
                element: <ComingSoonPage title="Reservas" />,
              },
              { path: "/agenda", element: <ComingSoonPage title="Agenda" /> },
              {
                path: "/employee-engine",
                element: <ComingSoonPage title="Empleado IA" />,
              },
              {
                path: "/settings",
                element: <ComingSoonPage title="Configuración" />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
