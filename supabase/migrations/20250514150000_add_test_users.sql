
-- Supprimer les utilisateurs existants (optionnel)
DELETE FROM users WHERE email IN (
  'admin@stage.com',
  'rh@stage.com',
  'finance@stage.com',
  'tuteur1@stage.com',
  'tuteur2@stage.com',
  'stagiaire1@stage.com',
  'stagiaire2@stage.com'
);

-- Insérer les nouveaux utilisateurs
INSERT INTO users (email, name, role, department, position, phone) VALUES
  ('admin@stage.com', 'Admin Principal', 'administrateur', 'Administration', 'Administrateur Système', '0600000001'),
  ('rh@stage.com', 'Sophie Martin', 'RH', 'Ressources Humaines', 'Responsable RH', '0600000002'),
  ('finance@stage.com', 'Lucas Bernard', 'finance', 'Finance', 'Responsable Finance', '0600000003'),
  ('tuteur1@stage.com', 'Pierre Dubois', 'tuteur', 'Informatique', 'Lead Developer', '0600000004'),
  ('tuteur2@stage.com', 'Marie Lambert', 'tuteur', 'Marketing', 'Chef de Projet', '0600000005'),
  ('stagiaire1@stage.com', 'Alex Petit', 'stagiaire', 'Informatique', 'Stagiaire Développeur', '0600000006'),
  ('stagiaire2@stage.com', 'Emma Robert', 'stagiaire', 'Marketing', 'Stagiaire Marketing', '0600000007');

-- Mettre à jour les mots de passe (en utilisant la fonction de hachage de Supabase)
SELECT supabase_auth.create_user(
  'admin@stage.com',
  'password123',
  'Admin Principal',
  'administrateur'
);

SELECT supabase_auth.create_user(
  'rh@stage.com',
  'password123',
  'Sophie Martin',
  'RH'
);

SELECT supabase_auth.create_user(
  'finance@stage.com',
  'password123',
  'Lucas Bernard',
  'finance'
);

SELECT supabase_auth.create_user(
  'tuteur1@stage.com',
  'password123',
  'Pierre Dubois',
  'tuteur'
);

SELECT supabase_auth.create_user(
  'tuteur2@stage.com',
  'password123',
  'Marie Lambert',
  'tuteur'
);

SELECT supabase_auth.create_user(
  'stagiaire1@stage.com',
  'password123',
  'Alex Petit',
  'stagiaire'
);

SELECT supabase_auth.create_user(
  'stagiaire2@stage.com',
  'password123',
  'Emma Robert',
  'stagiaire'
);
