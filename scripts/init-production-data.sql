
-- Création des utilisateurs de production
INSERT INTO users (id, email, full_name, role, phone) VALUES
-- Admin
('11111111-1111-1111-1111-111111111111', 'admin@company.com', 'Administrateur Principal', 'admin', '+33123456789'),

-- RH
('22222222-2222-2222-2222-222222222222', 'hr@company.com', 'Sarah Dubois', 'hr', '+33123456790'),
('22222222-2222-2222-2222-222222222223', 'hr2@company.com', 'Marc Lefebvre', 'hr', '+33123456791'),

-- Finance
('33333333-3333-3333-3333-333333333333', 'finance@company.com', 'Julie Martin', 'finance', '+33123456792'),

-- Tuteurs
('44444444-4444-4444-4444-444444444444', 'marie.laurent@company.com', 'Marie Laurent', 'tutor', '+33123456793'),
('44444444-4444-4444-4444-444444444445', 'pierre.dubois@company.com', 'Pierre Dubois', 'tutor', '+33123456794'),
('44444444-4444-4444-4444-444444444446', 'claire.bernard@company.com', 'Claire Bernard', 'tutor', '+33123456795'),

-- Stagiaires
('55555555-5555-5555-5555-555555555555', 'jean.dupont@example.com', 'Jean Dupont', 'intern', '+33123456796'),
('55555555-5555-5555-5555-555555555556', 'sophie.martin@example.com', 'Sophie Martin', 'intern', '+33123456797'),
('55555555-5555-5555-5555-555555555557', 'lucas.rousseau@example.com', 'Lucas Rousseau', 'intern', '+33123456798'),
('55555555-5555-5555-5555-555555555558', 'emma.bernard@example.com', 'Emma Bernard', 'intern', '+33123456799'),
('55555555-5555-5555-5555-555555555559', 'thomas.petit@example.com', 'Thomas Petit', 'intern', '+33123456800');

-- Création des stages
INSERT INTO interns (id, user_id, tutor_id, department, university, level, start_date, end_date, status, progress, contract_type) VALUES
('66666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'Développement', 'Université Paris-Saclay', 'Master 2', '2024-02-01', '2024-07-31', 'active', 65, 'stage'),
('66666666-6666-6666-6666-666666666667', '55555555-5555-5555-5555-555555555556', '44444444-4444-4444-4444-444444444445', 'Marketing Digital', 'ESCP Business School', 'Master 1', '2024-03-01', '2024-08-31', 'active', 45, 'stage'),
('66666666-6666-6666-6666-666666666668', '55555555-5555-5555-5555-555555555557', '44444444-4444-4444-4444-444444444444', 'Data Science', 'École Polytechnique', 'Master 2', '2024-01-15', '2024-06-15', 'active', 80, 'stage'),
('66666666-6666-6666-6666-666666666669', '55555555-5555-5555-5555-555555555558', '44444444-4444-4444-4444-444444444446', 'Design UX/UI', 'École de Design Nantes', 'Master 1', '2024-04-01', '2024-09-30', 'upcoming', 0, 'stage'),
('66666666-6666-6666-6666-666666666670', '55555555-5555-5555-5555-555555555559', '44444444-4444-4444-4444-444444444445', 'Communication', 'Sorbonne Université', 'Licence 3', '2023-09-01', '2024-01-31', 'completed', 100, 'stage');

-- Création des demandes
INSERT INTO requests (id, intern_id, type, title, description, status, priority, submitted_at) VALUES
('77777777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', 'conge', 'Demande de congé', 'Demande de congé du 15 au 19 avril pour raisons personnelles', 'pending', 'normal', NOW()),
('77777777-7777-7777-7777-777777777778', '66666666-6666-6666-6666-666666666667', 'attestation', 'Attestation de stage', 'Demande d''attestation de stage pour dossier universitaire', 'approved', 'normal', NOW() - INTERVAL '2 days'),
('77777777-7777-7777-7777-777777777779', '66666666-6666-6666-6666-666666666668', 'prolongation', 'Prolongation de stage', 'Demande de prolongation du stage de 2 mois supplémentaires', 'in_review', 'high', NOW() - INTERVAL '1 day'),
('77777777-7777-7777-7777-777777777780', '66666666-6666-6666-6666-666666666666', 'evaluation', 'Demande d''évaluation', 'Demande d''évaluation mi-parcours', 'pending', 'normal', NOW() - INTERVAL '3 days');

-- Création des notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, action_url) VALUES
('88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 'Nouvelle demande', 'Jean Dupont a soumis une demande de congé', 'info', false, '/dashboard/hr/requests'),
('88888888-8888-8888-8888-888888888889', '44444444-4444-4444-4444-444444444444', 'Évaluation en attente', 'Évaluation de Jean Dupont à compléter', 'warning', false, '/dashboard/tutor/interns'),
('88888888-8888-8888-8888-888888888890', '55555555-5555-5555-5555-555555555556', 'Demande approuvée', 'Votre demande d''attestation a été approuvée', 'success', false, '/dashboard/intern/requests');
