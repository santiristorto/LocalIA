import { useState } from "react";
import type { ChangeEvent } from "react";

import { Spinner } from "@localia/ui";

import { useAuth } from "../../../app/providers/use-auth.ts";
import { supabase } from "../../../shared/lib/supabase-client.ts";

export interface LogoUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

/**
 * Carga del logo — sube directo a Supabase Storage desde el navegador (sin
 * pasar por el backend), guardando el path bajo la carpeta del propio
 * usuario (`<user_id>/...`), tal como lo exige la política de Storage de la
 * migración `20260717000005`.
 */
export function LogoUploadField({ value, onChange }: LogoUploadFieldProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>();

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !user) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Formato no soportado. Usá PNG, JPG o WEBP.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError("El logo no puede pesar más de 5MB.");
      return;
    }

    setError(undefined);
    setIsUploading(true);

    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("tenant-logos")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    setIsUploading(false);

    if (uploadError) {
      setError("No se pudo subir el logo. Probá de nuevo.");
      return;
    }

    const { data } = supabase.storage.from("tenant-logos").getPublicUrl(path);
    onChange(data.publicUrl);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Logo (opcional)
      </label>

      <div className="flex items-center gap-4">
        {value ? (
          <img
            src={value}
            alt="Logo del comercio"
            className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 dark:border-gray-700">
            Sin logo
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
            {isUploading ? (
              <Spinner label="Subiendo…" />
            ) : value ? (
              "Cambiar logo"
            ) : (
              "Subir logo"
            )}
            <input
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={(e) => void handleFileChange(e)}
              disabled={isUploading}
              className="hidden"
            />
          </label>
          {error && (
            <p role="alert" aria-live="polite" className="text-sm text-danger">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
