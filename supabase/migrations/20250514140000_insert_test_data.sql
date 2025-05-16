
-- Insérer des départements
INSERT INTO departments (name) VALUES
  ('Ressources Humaines'),
  ('Informatique'),
  ('Finance'),
  ('Marketing');

-- Insérer des utilisateurs
INSERT INTO users (email, name, role, department, position, phone) VALUES
  ('admin@stage.com', 'Admin Principal', 'administrateur', 'Administration', 'Administrateur Système', '0600000001'),
  ('rh@stage.com', 'Sophie Martin', 'RH', 'Ressources Humaines', 'Responsable RH', '0600000002'),
  ('finance@stage.com', 'Lucas Bernard', 'finance', 'Finance', 'Responsable Finance', '0600000003'),
  ('tuteur1@stage.com', 'Pierre Dubois', 'tuteur', 'Informatique', 'Lead Developer', '0600000004'),
  ('tuteur2@stage.com', 'Marie Lambert', 'tuteur', 'Marketing', 'Chef de Projet', '0600000005'),
  ('stagiaire1@stage.com', 'Alex Petit', 'stagiaire', 'Informatique', 'Stagiaire Développeur', '0600000006'),
  ('stagiaire2@stage.com', 'Emma Robert', 'stagiaire', 'Marketing', 'Stagiaire Marketing', '0600000007');

-- Insérer des stagiaires
INSERT INTO stagiaires (user_id, tutor_id, department_id, school, formation, start_date, end_date, status) 
SELECT 
  (SELECT id FROM users WHERE email = 'stagiaire1@stage.com'),
  (SELECT id FROM users WHERE email = 'tuteur1@stage.com'),
  (SELECT id FROM departments WHERE name = 'Informatique'),
  'EPSI',
  'Master Informatique',
  '2024-01-01',
  '2024-06-30',
  'active';

INSERT INTO stagiaires (user_id, tutor_id, department_id, school, formation, start_date, end_date, status)
SELECT 
  (SELECT id FROM users WHERE email = 'stagiaire2@stage.com'),
  (SELECT id FROM users WHERE email = 'tuteur2@stage.com'),
  (SELECT id FROM departments WHERE name = 'Marketing'),
  'ESC',
  'Master Marketing Digital',
  '2024-02-01',
  '2024-07-31',
  'active';

-- Insérer des demandes
INSERT INTO requests (type, title, details, stagiaire_id, status, start_date, end_date)
SELECT 
  'convention',
  'Demande de convention',
  'Convention de stage pour période initiale',
  id,
  'validee',
  '2024-01-01',
  '2024-06-30'
FROM stagiaires
WHERE user_id = (SELECT id FROM users WHERE email = 'stagiaire1@stage.com');

-- Insérer des documents
INSERT INTO documents (name, type, url, stagiaire_id)
SELECT 
  'Convention_signee.pdf',
  'convention',
  'https://example.com/docs/convention.pdf',
  id
FROM stagiaires
WHERE user_id = (SELECT id FROM users WHERE email = 'stagiaire1@stage.com');

-- Insérer des paiements
INSERT INTO payments (stagiaire_id, amount, status, period)
SELECT 
  id,
  600.00,
  'paye',
  'Janvier 2024'
FROM stagiaires
WHERE user_id = (SELECT id FROM users WHERE email = 'stagiaire1@stage.com');

-- Insérer des évaluations
INSERT INTO evaluations (stagiaire_id, tutor_id, type, score, comments)
SELECT 
  s.id,
  s.tutor_id,
  'mid_term',
  4.5,
  'Excellent travail et bonne intégration dans l''équipe'
FROM stagiaires s
WHERE user_id = (SELECT id FROM users WHERE email = 'stagiaire1@stage.com');

-- Insérer des notifications
INSERT INTO notifications (user_id, title, message, read)
SELECT 
  id,
  'Bienvenue sur Stage+',
  'Bienvenue dans notre plateforme de gestion des stages',
  false
FROM users
WHERE role = 'stagiaire';

-- Insérer des projets
INSERT INTO projects (title, description, stagiaire_id, status)
SELECT 
  'Développement Application Web',
  'Création d''une application web avec React et Node.js',
  id,
  'en_cours'
FROM stagiaires
WHERE user_id = (SELECT id FROM users WHERE email = 'stagiaire1@stage.com');

-- Insérer des assignments
INSERT INTO assignments (title, description, stagiaire_id, tutor_id, status, due_date)
SELECT 
  'Création API REST',
  'Développer une API REST pour le nouveau système',
  s.id,
  s.tutor_id,
  'en_cours',
  '2024-03-01'
FROM stagiaires s
WHERE user_id = (SELECT id FROM users WHERE email = 'stagiaire1@stage.com');
