import { createBrowserRouter } from "react-router-dom";

import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from "../../features/auth/index.ts";
import { OnboardingPage } from "../../features/onboarding/index.ts";
import { WelcomePage } from "../../shared/pages/welcome-page.tsx";
import { ProtectedRoute } from "./protected-route.tsx";
import { RequireNoOnboarding } from "./require-no-onboarding.tsx";
import { RequireOnboarding } from "./require-onboarding.tsx";

/**
 * Frontend Architecture Specification §5.
 *
 * `/onboarding` está protegida en ambos sentidos — `RequireNoOnboarding`
 * evita mostrarla si ya se completó, y las rutas de la app real quedan
 * detrás de `RequireOnboarding`, que exige que exista al menos una
 * membresía antes de dejar pasar.
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
        children: [{ path: "/", element: <WelcomePage /> }],
      },
    ],
  },
]);
