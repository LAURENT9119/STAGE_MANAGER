
-- Script pour créer les comptes de démonstration
-- À exécuter dans Supabase SQL Editor

-- 1. Créer les utilisateurs de test dans auth.users via l'API Admin
-- (À faire manuellement dans le Dashboard Supabase)

-- 2. Insérer ou mettre à jour les profils utilisateurs
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    CASE 
        WHEN au.email = 'admin@company.com' THEN 'Administrateur Principal'
        WHEN au.email = 'hr@company.com' THEN 'Responsable RH'
        WHEN au.email = 'finance@company.com' THEN 'Responsable Finance'
        WHEN au.email = 'marie.laurent@company.com' THEN 'Marie Laurent'
        WHEN au.email = 'mongolaurent92@gmail.com' THEN 'Laurent Mongo'
        ELSE SPLIT_PART(au.email, '@', 1)
    END as full_name,
    CASE 
        WHEN au.email = 'admin@company.com' THEN 'admin'
        WHEN au.email = 'hr@company.com' THEN 'hr'
        WHEN au.email = 'finance@company.com' THEN 'finance'
        WHEN au.email = 'marie.laurent@company.com' THEN 'tutor'
        ELSE 'intern'
    END as role,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users au
WHERE au.email IN (
    'admin@company.com',
    'hr@company.com',
    'finance@company.com',
    'marie.laurent@company.com',
    'mongolaurent92@gmail.com'
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 3. Créer un stagiaire de test pour mongolaurent92@gmail.com
INSERT INTO public.interns (
    user_id,
    tutor_id,
    department,
    university,
    level,
    contract_type,
    project,
    start_date,
    end_date,
    status,
    progress
)
SELECT 
    u1.id as user_id,
    u2.id as tutor_id,
    'Informatique' as department,
    'Université de Paris' as university,
    'Master 2' as level,
    'Convention de stage' as contract_type,
    'Développement d''une application web de gestion' as project,
    CURRENT_DATE as start_date,
    CURRENT_DATE + INTERVAL '6 months' as end_date,
    'active' as status,
    25 as progress
FROM public.users u1, public.users u2
WHERE u1.email = 'mongolaurent92@gmail.com'
AND u2.email = 'marie.laurent@company.com'
AND NOT EXISTS (
    SELECT 1 FROM public.interns i WHERE i.user_id = u1.id
);

-- Vérification des données créées
SELECT 
    u.email,
    u.full_name,
    u.role,
    CASE WHEN i.id IS NOT NULL THEN 'Oui' ELSE 'Non' END as has_intern_profile
FROM public.users u
LEFT JOIN public.interns i ON u.id = i.user_id
WHERE u.email LIKE '%@%'
ORDER BY u.role, u.email;
