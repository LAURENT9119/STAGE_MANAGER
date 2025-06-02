
-- Script pour créer des données de test complètes
-- Exécuter ce script dans la console SQL de Supabase

-- 1. Créer des comptes utilisateurs de test
-- Admin principal
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'admin@company.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin Principal", "role": "admin"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- RH Manager
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'hr@company.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Marie Dubois", "role": "hr"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Tuteur
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'tuteur@company.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Pierre Martin", "role": "tutor"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Finance Manager
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'finance@company.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Sophie Finance", "role": "finance"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Stagiaires de test
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'stagiaire1@email.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Julie Stagiaire", "role": "intern"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '66666666-6666-6666-6666-666666666666',
  '00000000-0000-0000-0000-000000000000',
  'stagiaire2@email.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Lucas Intern", "role": "intern"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 2. Créer les profils utilisateurs correspondants
INSERT INTO public.users (id, email, full_name, role, phone, address) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@company.com', 'Admin Principal', 'admin', '+33 1 23 45 67 89', '123 Rue Admin, Paris'),
('22222222-2222-2222-2222-222222222222', 'hr@company.com', 'Marie Dubois', 'hr', '+33 1 23 45 67 90', '456 Avenue RH, Paris'),
('33333333-3333-3333-3333-333333333333', 'tuteur@company.com', 'Pierre Martin', 'tutor', '+33 1 23 45 67 91', '789 Boulevard Tech, Paris'),
('44444444-4444-4444-4444-444444444444', 'finance@company.com', 'Sophie Finance', 'finance', '+33 1 23 45 67 92', '321 Rue Finance, Paris'),
('55555555-5555-5555-5555-555555555555', 'stagiaire1@email.com', 'Julie Stagiaire', 'intern', '+33 6 12 34 56 78', '12 Rue Étudiant, Lille'),
('66666666-6666-6666-6666-666666666666', 'stagiaire2@email.com', 'Lucas Intern', 'intern', '+33 6 12 34 56 79', '34 Avenue Campus, Lyon')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address;

-- 3. Créer des départements
INSERT INTO departments (id, name, description, manager_id) VALUES
(gen_random_uuid(), 'Informatique', 'Développement et maintenance des systèmes informatiques', '33333333-3333-3333-3333-333333333333'),
(gen_random_uuid(), 'Marketing', 'Stratégie marketing et communication', '22222222-2222-2222-2222-222222222222'),
(gen_random_uuid(), 'Finance', 'Gestion financière et comptabilité', '44444444-4444-4444-4444-444444444444'),
(gen_random_uuid(), 'Ressources Humaines', 'Gestion du personnel et recrutement', '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- 4. Créer des stages pour les stagiaires
INSERT INTO interns (id, user_id, tutor_id, department, university, level, contract_type, project, start_date, end_date, status, progress, evaluation_score, notes) VALUES
(gen_random_uuid(), '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Informatique', 'Université Paris-Saclay', 'Master 2', 'Convention de stage', 'Développement d''une application de gestion', CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months', 'active', 65, 4.2, 'Excellente motivation et compétences techniques'),
(gen_random_uuid(), '66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Marketing', 'ESSEC Business School', 'Master 1', 'Convention de stage', 'Analyse marketing et stratégie digitale', CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months', 'active', 30, 3.8, 'Bon potentiel en développement');

-- 5. Créer des demandes d'exemple
WITH intern_ids AS (
  SELECT id, user_id FROM interns WHERE user_id IN ('55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666')
)
INSERT INTO requests (id, intern_id, type, title, description, status, priority, submitted_at, reviewer_id, reviewer_comments) 
SELECT 
  gen_random_uuid(),
  i.id,
  CASE 
    WHEN i.user_id = '55555555-5555-5555-5555-555555555555' THEN 'conge'
    ELSE 'prolongation'
  END,
  CASE 
    WHEN i.user_id = '55555555-5555-5555-5555-555555555555' THEN 'Demande de congé'
    ELSE 'Demande de prolongation de stage'
  END,
  CASE 
    WHEN i.user_id = '55555555-5555-5555-5555-555555555555' THEN 'Demande de congé pour examen universitaire du 15 au 17 février'
    ELSE 'Demande de prolongation du stage de 2 mois supplémentaires'
  END,
  CASE 
    WHEN i.user_id = '55555555-5555-5555-5555-555555555555' THEN 'approved'
    ELSE 'pending'
  END,
  'normal',
  NOW() - INTERVAL '3 days',
  CASE 
    WHEN i.user_id = '55555555-5555-5555-5555-555555555555' THEN '33333333-3333-3333-3333-333333333333'
    ELSE NULL
  END,
  CASE 
    WHEN i.user_id = '55555555-5555-5555-5555-555555555555' THEN 'Congé approuvé pour les examens'
    ELSE NULL
  END
FROM intern_ids i;

-- 6. Créer des évaluations
WITH intern_data AS (
  SELECT id FROM interns WHERE user_id = '55555555-5555-5555-5555-555555555555'
)
INSERT INTO evaluations (id, intern_id, evaluator_id, period, technical_skills, soft_skills, punctuality, initiative, overall_rating, comments, recommendations, status)
SELECT 
  gen_random_uuid(),
  i.id,
  '33333333-3333-3333-3333-333333333333',
  'monthly',
  4,
  4,
  5,
  4,
  4,
  'Excellent travail et progression constante. Très autonome.',
  'Continuer sur cette voie, peut-être explorer de nouvelles technologies.',
  'validated'
FROM intern_data i;

-- 7. Créer des notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, action_url) VALUES
(gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 'Demande approuvée', 'Votre demande de congé a été approuvée par votre tuteur.', 'success', false, '/dashboard/intern/requests'),
(gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 'Nouvelle évaluation', 'Votre tuteur a publié une nouvelle évaluation.', 'info', false, '/dashboard/intern/profile'),
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Nouvelle demande', 'Lucas Intern a soumis une demande de prolongation.', 'warning', false, '/dashboard/tutor/requests'),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Rapport mensuel', 'Le rapport mensuel des stagiaires est disponible.', 'info', false, '/dashboard/hr/reports');

-- 8. Mettre à jour les paramètres système
UPDATE settings SET value = jsonb_build_object(
  'name', 'TechCorp SARL',
  'address', '123 Avenue de la Technologie, 75001 Paris',
  'phone', '+33 1 23 45 67 89',
  'email', 'contact@techcorp.com',
  'city', 'Paris',
  'logo_url', '/logo.png'
) WHERE key = 'company_info';

-- 9. Logs d'activité d'exemple
INSERT INTO activity_logs (id, user_id, action, resource_type, resource_id, details, ip_address) VALUES
(gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 'CREATE_REQUEST', 'request', (SELECT id FROM requests WHERE intern_id = (SELECT id FROM interns WHERE user_id = '55555555-5555-5555-5555-555555555555') LIMIT 1), '{"type": "conge", "title": "Demande de congé"}', '192.168.1.100'),
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'APPROVE_REQUEST', 'request', (SELECT id FROM requests WHERE status = 'approved' LIMIT 1), '{"action": "approved", "comments": "Congé approuvé"}', '192.168.1.101'),
(gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 'LOGIN', 'user', '66666666-6666-6666-6666-666666666666', '{"login_time": "' || NOW() || '"}', '192.168.1.102');

-- Message de confirmation
SELECT 'Données de test créées avec succès!' as message,
       COUNT(*) as users_created FROM users WHERE role != 'admin';

-- Afficher les comptes créés
SELECT 
  email,
  full_name,
  role,
  'password123' as password
FROM users 
ORDER BY role, full_name;
