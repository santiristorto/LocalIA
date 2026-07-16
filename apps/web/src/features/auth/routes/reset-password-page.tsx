import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { resetPasswordSchema } from "@localia/types";
import { Alert, Button, FormField, Input } from "@localia/ui";

import { useAuth } from "../../../app/providers/use-auth.ts";
import { AuthLayout } from "../components/auth-layout.tsx";
import { useResetPassword } from "../hooks/use-reset-password.ts";

type FieldErrors = Partial<Record<"password" | "confirmPassword", string>>;

/**
 * `/restablecer-password` — solo es accesible con una sesión de recuperación
 * válida, que `supabase-client.ts` (`detectSessionInUrl`) ya estableció al
 * cargar la página desde el link del email.
 */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const resetPassword = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  if (!session) {
    return (
      <AuthLayout title="Link inválido o expirado">
        <Alert variant="error">
          Este link de recuperación ya no es válido. Pedí uno nuevo para
          continuar.
        </Alert>
        <Link
          to="/recuperar-password"
          className="mt-6 inline-block text-sm font-medium text-primary hover:text-primary-hover"
        >
          Pedir un nuevo link
        </Link>
      </AuthLayout>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = resetPasswordSchema.safeParse({ password, confirmPassword });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        password: errors.password?.[0],
        confirmPassword: errors.confirmPassword?.[0],
      });
      return;
    }

    resetPassword.mutate(result.data, {
      onSuccess: () => navigate("/", { replace: true }),
    });
  }

  return (
    <AuthLayout title="Elegí tu nueva contraseña">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {resetPassword.isError && (
          <Alert variant="error">{resetPassword.error.message}</Alert>
        )}

        <FormField
          id="password"
          label="Nueva contraseña"
          error={fieldErrors.password}
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            hasError={Boolean(fieldErrors.password)}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>

        <FormField
          id="confirmPassword"
          label="Confirmar contraseña"
          error={fieldErrors.confirmPassword}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            hasError={Boolean(fieldErrors.confirmPassword)}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormField>

        <Button
          type="submit"
          isLoading={resetPassword.isPending}
          className="w-full"
        >
          Guardar nueva contraseña
        </Button>
      </form>
    </AuthLayout>
  );
}
