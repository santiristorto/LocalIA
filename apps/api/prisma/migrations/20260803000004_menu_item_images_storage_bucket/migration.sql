-- LocalIA — Sprint 4 (Menú)
-- Bucket de Supabase Storage para la imagen (opcional) de cada ítem del
-- menú. Mismo mecanismo que `tenant-logos` (Sprint 1B, migración
-- `20260717000005`): la carga la hace el frontend directo contra Supabase
-- Storage con el cliente de Supabase (`auth.uid()` sí resuelve ahí, a
-- diferencia del camino de Prisma — ver esa migración para el detalle).
--
-- DIFERENCIA deliberada respecto al patrón de `tenant-logos`: ese bucket
-- restringe por carpeta propia del usuario (`<user_id>/...`) porque el
-- logo se sube durante el onboarding, antes de que exista membresía de
-- tenant. Acá el path es por comercio (`<tenant_id>/...`), porque
-- cualquier owner/manager del equipo puede cargar imágenes del menú, no
-- solo quien lo creó — la política reutiliza `fn_tenant_role`, la misma
-- función de la migración `20260717000004_tenant_rls_policies`.

INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-item-images', 'menu-item-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "menu_item_images_insert_owner_manager"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'menu-item-images'
        AND fn_tenant_role(
            ((storage.foldername(name))[1])::uuid,
            auth.uid()
        ) IN ('owner', 'manager')
    );

CREATE POLICY "menu_item_images_update_owner_manager"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'menu-item-images'
        AND fn_tenant_role(
            ((storage.foldername(name))[1])::uuid,
            auth.uid()
        ) IN ('owner', 'manager')
    );

-- Público de lectura, igual que `tenant-logos`: las fotos del menú las va
-- a mostrar el panel sin URLs firmadas — no es información sensible.
CREATE POLICY "menu_item_images_public_read"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'menu-item-images');
