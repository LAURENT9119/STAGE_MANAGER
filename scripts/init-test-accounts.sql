
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
-- Script pour créer des comptes de test

-- Insérer des profils de test (les utilisateurs Auth doivent être créés manuellement)
INSERT INTO profiles (id, email, full_name, role, phone, address) VALUES 
-- Admin
('11111111-1111-1111-1111-111111111111', 'admin@test.com', 'Admin Système', 'admin', '+33123456789', '123 Rue Admin, Paris'),
-- RH
('22222222-2222-2222-2222-222222222222', 'rh@test.com', 'Marie RH', 'hr', '+33123456790', '456 Avenue RH, Lyon'),
-- Finance  
('33333333-3333-3333-3333-333333333333', 'finance@test.com', 'Pierre Finance', 'finance', '+33123456791', '789 Boulevard Finance, Marseille'),
-- Tuteur
('44444444-4444-4444-4444-444444444444', 'tuteur@test.com', 'Sophie Tuteur', 'tutor', '+33123456792', '321 Rue Tuteur, Toulouse'),
-- Stagiaire
('55555555-5555-5555-5555-555555555555', 'stagiaire@test.com', 'Jean Stagiaire', 'intern', '+33123456793', '654 Avenue Stagiaire, Nice');

-- Insérer des stagiaires de test
INSERT INTO interns (id, user_id, tutor_id, department, start_date, end_date, status, university, level, contract_type, project, progress) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'Informatique', '2024-02-01', '2024-07-31', 'active', 'Université Paris-Saclay', 'Master 2', 'Stage obligatoire', 'Développement application web de gestion des stagiaires', 65);

-- Insérer des demandes de test
INSERT INTO requests (id, intern_id, type, title, description, status, priority, submission_date, metadata) VALUES 
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'convention', 'Demande de convention de stage', 'Je souhaite obtenir ma convention de stage pour la période février-juillet 2024', 'submitted', 'high', NOW(), '{}'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'attestation', 'Demande d\'attestation de présence', 'Demande d\'attestation pour justificatif auprès de l\'université', 'tutor_review', 'medium', NOW(), '{}');

-- Insérer des notifications de test
INSERT INTO notifications (user_id, title, message, type, related_request_id) VALUES 
('55555555-5555-5555-5555-555555555555', 'Demande soumise', 'Votre demande de convention a été soumise avec succès', 'success', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('44444444-4444-4444-4444-444444444444', 'Nouvelle demande à examiner', 'Jean Stagiaire a soumis une nouvelle demande', 'info', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('22222222-2222-2222-2222-222222222222', 'Demande en attente', 'Une demande d\'attestation nécessite votre attention', 'warning', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

-- Insérer des paramètres de l'application
INSERT INTO settings (key, value, description) VALUES 
('app_name', '"Plateforme de Gestion des Stagiaires"', 'Nom de l\'application'),
('max_file_size', '10485760', 'Taille maximale des fichiers en bytes (10MB)'),
('allowed_file_types', '["pdf", "doc", "docx", "jpg", "png"]', 'Types de fichiers autorisés'),
('email_notifications', 'true', 'Activer les notifications par email'),
('auto_approval_threshold', '3', 'Nombre d\'approbations requises pour validation automatique');
