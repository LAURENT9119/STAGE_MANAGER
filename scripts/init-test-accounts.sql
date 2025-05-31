
-- Script pour créer les données de test - VERSION CORRIGÉE
-- IMPORTANT: Créez d'abord MANUELLEMENT les comptes dans Supabase Dashboard > Authentication > Users

-- 1. Nettoyer les données existantes
DELETE FROM activity_logs;
DELETE FROM evaluations;
DELETE FROM documents;
DELETE FROM notifications;
DELETE FROM requests;
DELETE FROM interns;
DELETE FROM users WHERE email LIKE '%@company.com' OR email LIKE '%@example.com';

-- 2. Insérer les profils utilisateurs (liens automatiques avec Auth)
-- Cette requête récupère automatiquement les UUIDs des comptes Auth existants
INSERT INTO users (id, email, full_name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    CASE 
        WHEN au.email = 'admin@company.com' THEN 'Administrateur Principal'
        WHEN au.email = 'hr@company.com' THEN 'Responsable RH'
        WHEN au.email = 'sarah.hr@company.com' THEN 'Sarah Dupuis'
        WHEN au.email = 'finance@company.com' THEN 'Responsable Finance'
        WHEN au.email = 'marie.laurent@company.com' THEN 'Marie Laurent'
        WHEN au.email = 'pierre.dubois@company.com' THEN 'Pierre Dubois'
        WHEN au.email = 'anne.leroy@company.com' THEN 'Anne Leroy'
        WHEN au.email = 'thomas.moreau@company.com' THEN 'Thomas Moreau'
        ELSE au.email
    END as full_name,
    CASE 
        WHEN au.email = 'admin@company.com' THEN 'admin'
        WHEN au.email IN ('hr@company.com', 'sarah.hr@company.com') THEN 'hr'
        WHEN au.email = 'finance@company.com' THEN 'finance'
        WHEN au.email LIKE '%.laurent@company.com' OR au.email LIKE '%.dubois@company.com' 
             OR au.email LIKE '%.leroy@company.com' OR au.email LIKE '%.moreau@company.com' THEN 'tutor'
        ELSE 'intern'
    END as role,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users au
WHERE au.email IN (
    'admin@company.com',
    'hr@company.com', 
    'sarah.hr@company.com',
    'finance@company.com',
    'marie.laurent@company.com',
    'pierre.dubois@company.com',
    'anne.leroy@company.com',
    'thomas.moreau@company.com'
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 3. Créer quelques stagiaires de test (optionnel pour les tests)
-- Vous pouvez créer ces comptes plus tard ou les ignorer pour commencer

-- VÉRIFICATION: Compter les utilisateurs créés
SELECT 
    role,
    COUNT(*) as count,
    string_agg(email, ', ') as emails
FROM users 
WHERE email LIKE '%@company.com'
GROUP BY role
ORDER BY role;

-- INSTRUCTIONS DÉTAILLÉES:
-- ======================
-- 1. Allez sur https://app.supabase.com
-- 2. Sélectionnez votre projet (ljboqtmrferkafwfanva)
-- 3. Cliquez sur "Authentication" dans le menu latéral
-- 4. Cliquez sur "Users"
-- 5. Pour CHAQUE email ci-dessous, cliquez "Add user":
--    - Email: admin@company.com, Password: password123
--    - Email: hr@company.com, Password: password123
--    - Email: sarah.hr@company.com, Password: password123
--    - Email: finance@company.com, Password: password123
--    - Email: marie.laurent@company.com, Password: password123
--    - Email: pierre.dubois@company.com, Password: password123
--    - Email: anne.leroy@company.com, Password: password123
--    - Email: thomas.moreau@company.com, Password: password123
-- 6. Pour chaque utilisateur créé, cliquez sur les 3 points et "Confirm email"
-- 7. Puis exécutez ce script SQL dans Supabase > SQL Editor

-- COMPTES DE TEST CRÉÉS:
-- ======================
-- admin@company.com / password123 (Administrateur)
-- hr@company.com / password123 (RH)
-- finance@company.com / password123 (Finance)  
-- marie.laurent@company.com / password123 (Tuteur)
