-- LocalIA — Sprint 1B
-- Bucket de Supabase Storage para el logo (opcional) del onboarding.
--
-- A diferencia de `tenants`/`tenant_users` (que el backend consulta vía
-- Prisma, sin contexto de Supabase Auth nativo — ver migración
-- `20260717000001`), la carga del logo la hace el frontend directo contra
-- Supabase Storage con el cliente de Supabase, que sí adjunta el JWT real
-- del usuario a cada request. Ahí `auth.uid()` es correcto y es la función
-- estándar de Supabase Storage — no se usa `fn_current_user_id()` acá.

INSERT INTO storage.buckets (id, name, public)
VALUES ('tenant-logos', 'tenant-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Un usuario autenticado solo puede subir dentro de una "carpeta" con su
-- propio user id como prefijo del path (ej. `<user_id>/logo.png`) — evita
-- que alguien sobreescriba el logo de otro usuario adivinando su path.
CREATE POLICY "tenant_logos_insert_own_folder"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'tenant-logos'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "tenant_logos_update_own_folder"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'tenant-logos'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- El bucket es público de lectura a propósito: el logo lo va a mostrar el
-- Employee/el panel sin necesidad de URLs firmadas — no es información
-- sensible.
CREATE POLICY "tenant_logos_public_read"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'tenant-logos');
