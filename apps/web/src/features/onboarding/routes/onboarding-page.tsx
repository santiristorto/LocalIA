import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  businessVerticalLabels,
  businessVerticalValues,
  createTenantSchema,
  defaultBrandColors,
  defaultOpeningHours,
  timezoneOptions,
} from "@localia/types";
import type { CreateTenantInput } from "@localia/types";
import { Alert, Button, FormField, Input } from "@localia/ui";

import { ColorField } from "../components/color-field.tsx";
import { LogoUploadField } from "../components/logo-upload-field.tsx";
import { OnboardingLayout } from "../components/onboarding-layout.tsx";
import { WeeklyHoursEditor } from "../components/weekly-hours-editor.tsx";
import { useCreateTenant } from "../hooks/use-create-tenant.ts";

const initialFormState: CreateTenantInput = {
  name: "",
  businessVertical: "restaurant",
  description: "",
  phone: "",
  contactEmail: "",
  address: "",
  city: "",
  province: "",
  country: "Argentina",
  timezone: "America/Argentina/Buenos_Aires",
  openingHours: defaultOpeningHours,
  logoUrl: "",
  brandPrimaryColor: defaultBrandColors.primary,
  brandSecondaryColor: defaultBrandColors.secondary,
};

type FieldErrors = Partial<Record<keyof CreateTenantInput, string>>;

/**
 * `/onboarding` — pantalla única (no un wizard de varios pasos como el de
 * 5 pasos de la UX/UI Specification §4). Decisión de alcance deliberada:
 * cubre el caso de uso completo con menos superficie de código; se puede
 * partir en pasos más adelante sin cambiar el modelo de datos ni el
 * endpoint (`POST /api/v1/tenants` recibe el mismo payload de cualquier
 * forma).
 */
export function OnboardingPage() {
  const navigate = useNavigate();
  const createTenant = useCreateTenant();

  const [form, setForm] = useState<CreateTenantInput>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function update<K extends keyof CreateTenantInput>(
    key: K,
    value: CreateTenantInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = createTenantSchema.safeParse(form);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const nextErrors: FieldErrors = {};
      for (const key of Object.keys(errors) as (keyof CreateTenantInput)[]) {
        nextErrors[key] = errors[key]?.[0];
      }
      setFieldErrors(nextErrors);
      // Lleva la vista al primer error, en vez de dejar al usuario
      // adivinando qué falló más abajo en un formulario largo.
      document
        .getElementById("name")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setFieldErrors({});
    createTenant.mutate(result.data, {
      onSuccess: () => navigate("/", { replace: true }),
    });
  }

  return (
    <OnboardingLayout>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
        {createTenant.isError && (
          <Alert variant="error">{createTenant.error.message}</Alert>
        )}

        {/* Datos generales */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Datos generales
          </h2>

          <FormField
            id="name"
            label="Nombre del negocio"
            error={fieldErrors.name}
          >
            <Input
              id="name"
              value={form.name}
              hasError={Boolean(fieldErrors.name)}
              onChange={(e) => update("name", e.target.value)}
            />
          </FormField>

          <FormField
            id="businessVertical"
            label="Rubro"
            error={fieldErrors.businessVertical}
          >
            <select
              id="businessVertical"
              value={form.businessVertical}
              onChange={(e) =>
                update(
                  "businessVertical",
                  e.target.value as CreateTenantInput["businessVertical"],
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              {businessVerticalValues.map((vertical) => (
                <option key={vertical} value={vertical}>
                  {businessVerticalLabels[vertical]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="description"
            label="Descripción corta"
            error={fieldErrors.description}
            hint="Opcional — un par de líneas sobre tu comercio."
          >
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </FormField>
        </section>

        {/* Contacto */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Contacto
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="phone" label="Teléfono" error={fieldErrors.phone}>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                hasError={Boolean(fieldErrors.phone)}
                onChange={(e) => update("phone", e.target.value)}
              />
            </FormField>

            <FormField
              id="contactEmail"
              label="Email de contacto"
              error={fieldErrors.contactEmail}
            >
              <Input
                id="contactEmail"
                type="email"
                value={form.contactEmail}
                hasError={Boolean(fieldErrors.contactEmail)}
                onChange={(e) => update("contactEmail", e.target.value)}
              />
            </FormField>
          </div>
        </section>

        {/* Ubicación */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Ubicación
          </h2>

          <FormField id="address" label="Dirección" error={fieldErrors.address}>
            <Input
              id="address"
              value={form.address}
              hasError={Boolean(fieldErrors.address)}
              onChange={(e) => update("address", e.target.value)}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="city" label="Ciudad" error={fieldErrors.city}>
              <Input
                id="city"
                value={form.city}
                hasError={Boolean(fieldErrors.city)}
                onChange={(e) => update("city", e.target.value)}
              />
            </FormField>

            <FormField
              id="province"
              label="Provincia"
              error={fieldErrors.province}
            >
              <Input
                id="province"
                value={form.province}
                hasError={Boolean(fieldErrors.province)}
                onChange={(e) => update("province", e.target.value)}
              />
            </FormField>

            <FormField id="country" label="País" error={fieldErrors.country}>
              <Input
                id="country"
                value={form.country}
                hasError={Boolean(fieldErrors.country)}
                onChange={(e) => update("country", e.target.value)}
              />
            </FormField>
          </div>

          <FormField
            id="timezone"
            label="Zona horaria"
            error={fieldErrors.timezone}
          >
            <select
              id="timezone"
              value={form.timezone}
              onChange={(e) => update("timezone", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              {timezoneOptions.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </FormField>
        </section>

        {/* Horario */}
        <section>
          <WeeklyHoursEditor
            value={form.openingHours}
            onChange={(openingHours) => update("openingHours", openingHours)}
          />
        </section>

        {/* Marca */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Marca
          </h2>

          <LogoUploadField
            value={form.logoUrl ?? ""}
            onChange={(url) => update("logoUrl", url)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              id="brandPrimaryColor"
              label="Color principal"
              value={form.brandPrimaryColor}
              onChange={(v) => update("brandPrimaryColor", v)}
              error={fieldErrors.brandPrimaryColor}
            />
            <ColorField
              id="brandSecondaryColor"
              label="Color secundario"
              value={form.brandSecondaryColor}
              onChange={(v) => update("brandSecondaryColor", v)}
              error={fieldErrors.brandSecondaryColor}
            />
          </div>
        </section>

        <Button
          type="submit"
          isLoading={createTenant.isPending}
          className="w-full"
        >
          Guardar y continuar
        </Button>
      </form>
    </OnboardingLayout>
  );
}
