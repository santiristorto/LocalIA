import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { forgotPasswordSchema } from "@localia/types";
import { Alert, Button, FormField, Input } from "@localia/ui";

import { AuthLayout } from "../components/auth-layout.tsx";
import { useForgotPassword } from "../hooks/use-forgot-password.ts";

/** `/recuperar-password`. */
export function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.flatten().fieldErrors.email?.[0]);
      return;
    }

    setError(undefined);
    forgotPassword.mutate(result.data);
  }

  if (forgotPassword.isSuccess) {
    return (
      <AuthLayout title="Revisá tu email">
        <Alert variant="success">
          Si existe una cuenta con ese email, te enviamos un link para
          restablecer tu contraseña.
        </Alert>
        <Link
          to="/login"
          className="mt-6 inline-block text-sm font-medium text-primary hover:text-primary-hover"
        >
          Volver a iniciar sesión
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle="Te enviamos un link para crear una nueva."
      footer={
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary-hover"
        >
          Volver a iniciar sesión
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {forgotPassword.isError && (
          <Alert variant="error">{forgotPassword.error.message}</Alert>
        )}

        <FormField id="email" label="Email" error={error}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            hasError={Boolean(error)}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>

        <Button
          type="submit"
          isLoading={forgotPassword.isPending}
          className="w-full"
        >
          Enviar link de recuperación
        </Button>
      </form>
    </AuthLayout>
  );
}
