import { createBrowserRouter } from "react-router-dom";

import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from "../../features/auth/index.ts";
import { WelcomePage } from "../../shared/pages/welcome-page.tsx";
import { ProtectedRoute } from "./protected-route.tsx";

/**
 * Frontend Architecture Specification §5.
 *
 * Sprint 1A: rutas públicas de auth + una sola ruta protegida ("/"), que
 * hace de home temporal hasta que exista el shell real del Employee Center.
 */
export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/registro", element: <RegisterPage /> },
  { path: "/recuperar-password", element: <ForgotPasswordPage /> },
  { path: "/restablecer-password", element: <ResetPasswordPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/", element: <WelcomePage /> }],
  },
]);
