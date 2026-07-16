import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerSchema } from "@localia/types";
import { Alert, Button, FormField, Input } from "@localia/ui";

import { AuthLayout } from "../components/auth-layout.tsx";
import { useRegister } from "../hooks/use-register.ts";

type FieldErrors = Partial<Record<"fullName" | "email" | "password", string>>;

/** `/registro` — UX/UI Specification §3. */
export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validateField(field: keyof FieldErrors, value: string) {
    const candidate = { fullName, email, password, [field]: value };
    const result = registerSchema.safeParse(candidate);
    const message = result.success
      ? undefined
      : result.error.flatten().fieldErrors[field]?.[0];

    setFieldErrors((prev) => ({ ...prev, [field]: message }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = registerSchema.safeParse({ fullName, email, password });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        fullName: errors.fullName?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      return;
    }

    register.mutate(result.data, {
      onSuccess: () => {
        // Onboarding real llega en un sprint posterior — por ahora, tras
        // registrarse, el usuario queda logueado (Supabase ya crea la
        // sesión) y va a la raíz de la app.
        navigate("/", { replace: true });
      },
    });
  }

  return (
    <AuthLayout
      title="Creá tu cuenta"
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary-hover"
          >
            Iniciar sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {register.isError && (
          <Alert variant="error">{register.error.message}</Alert>
        )}

        <FormField
          id="fullName"
          label="Nombre y apellido"
          error={fieldErrors.fullName}
        >
          <Input
            id="fullName"
            autoComplete="name"
            value={fullName}
            hasError={Boolean(fieldErrors.fullName)}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={(e) => validateField("fullName", e.target.value)}
          />
        </FormField>

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

        <FormField
          id="password"
          label="Contraseña"
          error={fieldErrors.password}
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            hasError={Boolean(fieldErrors.password)}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={(e) => validateField("password", e.target.value)}
          />
        </FormField>

        <Button type="submit" isLoading={register.isPending} className="w-full">
          Crear cuenta
        </Button>
      </form>
    </AuthLayout>
  );
}
