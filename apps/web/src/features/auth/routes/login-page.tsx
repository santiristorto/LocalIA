import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { loginSchema } from "@localia/types";
import { Alert, Button, FormField, Input } from "@localia/ui";

import { AuthLayout } from "../components/auth-layout.tsx";
import { useLogin } from "../hooks/use-login.ts";

type FieldErrors = Partial<Record<"email" | "password", string>>;

/**
 * `/login` — UX/UI Specification §2.
 *
 * Validación on blur (no en cada tecla), error genérico ante credenciales
 * inválidas (nunca se especifica cuál de los dos campos falló).
 */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validateField(field: "email" | "password", value: string) {
    const result = loginSchema.safeParse({ email, password, [field]: value });
    const message = result.success
      ? undefined
      : result.error.flatten().fieldErrors[field]?.[0];

    setFieldErrors((prev) => ({ ...prev, [field]: message }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      return;
    }

    login.mutate(result.data, {
      onSuccess: () => {
        const redirectTo =
          (location.state as { from?: string } | null)?.from ?? "/";
        navigate(redirectTo, { replace: true });
      },
    });
  }

  return (
    <AuthLayout
      title="Iniciá sesión"
      footer={
        <>
          ¿No tenés cuenta?{" "}
          <Link
            to="/registro"
            className="font-medium text-primary hover:text-primary-hover"
          >
            Crear cuenta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {login.isError && <Alert variant="error">{login.error.message}</Alert>}

        <FormField id="email" label="Email" error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            hasError={Boolean(fieldErrors.email)}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => validateField("email", e.target.value)}
          />
        </FormField>

        <div>
          <FormField
            id="password"
            label="Contraseña"
            error={fieldErrors.password}
          >
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              hasError={Boolean(fieldErrors.password)}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => validateField("password", e.target.value)}
            />
          </FormField>
          <Link
            to="/recuperar-password"
            className="mt-1.5 inline-block text-sm text-primary hover:text-primary-hover"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" isLoading={login.isPending} className="w-full">
          Iniciar sesión
        </Button>
      </form>
    </AuthLayout>
  );
}
