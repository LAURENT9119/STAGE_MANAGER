
-- Supprimer l'ancien trigger et fonction
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Nouvelle fonction améliorée pour créer automatiquement les profils
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
    user_name TEXT;
BEGIN
    -- Extraire le rôle et le nom des métadonnées
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'intern');
    user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

    -- Insérer le profil utilisateur
    INSERT INTO public.users (id, email, full_name, role, phone, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        user_name,
        user_role,
        COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        updated_at = NOW();

    -- Si c'est un stagiaire et qu'il y a des données de stage, créer le profil stagiaire
    IF user_role = 'intern' AND NEW.raw_user_meta_data ? 'internData' THEN
        INSERT INTO public.interns (
            user_id,
            department,
            university,
            level,
            contract_type,
            start_date,
            end_date,
            project,
            status,
            created_at,
            updated_at
        )
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->'internData'->>'department', 'Non spécifié'),
            COALESCE(NEW.raw_user_meta_data->'internData'->>'university', 'Non spécifié'),
            COALESCE(NEW.raw_user_meta_data->'internData'->>'level', 'Non spécifié'),
            COALESCE(NEW.raw_user_meta_data->'internData'->>'contract_type', 'stage'),
            COALESCE((NEW.raw_user_meta_data->'internData'->>'start_date')::DATE, CURRENT_DATE),
            COALESCE((NEW.raw_user_meta_data->'internData'->>'end_date')::DATE, CURRENT_DATE + INTERVAL '6 months'),
            NEW.raw_user_meta_data->'internData'->>'project',
            'upcoming',
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas empêcher la création de l'utilisateur
        RAISE WARNING 'Erreur lors de la création du profil utilisateur: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour créer manuellement les profils manquants
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void AS $$
DECLARE
    auth_user RECORD;
BEGIN
    -- Parcourir tous les utilisateurs auth qui n'ont pas de profil
    FOR auth_user IN 
        SELECT au.id, au.email, au.raw_user_meta_data
        FROM auth.users au
        LEFT JOIN public.users pu ON au.id = pu.id
        WHERE pu.id IS NULL
    LOOP
        -- Créer le profil manquant
        INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
        VALUES (
            auth_user.id,
            auth_user.email,
            COALESCE(auth_user.raw_user_meta_data->>'full_name', split_part(auth_user.email, '@', 1)),
            COALESCE(auth_user.raw_user_meta_data->>'role', 'intern'),
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la fonction pour créer les profils manquants
SELECT public.create_missing_profiles();
