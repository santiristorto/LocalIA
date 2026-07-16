-- LocalIA — Sprint 1A
-- Crea automáticamente la fila de `profiles` cuando un usuario se registra
-- vía Supabase Auth (frontend, `supabase.auth.signUp`) — Backend Architecture
-- Specification §9: el backend no gestiona contraseñas ni intercepta el
-- registro, así que la creación del perfil debe resolverse a nivel de base
-- de datos, no de aplicación.
--
-- `full_name` se toma de `raw_user_meta_data`, que el frontend completa al
-- llamar `supabase.auth.signUp({ options: { data: { full_name } } })`.

CREATE FUNCTION "public"."handle_new_user"()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        CURRENT_TIMESTAMP
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER "on_auth_user_created"
    AFTER INSERT ON "auth"."users"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."handle_new_user"();
