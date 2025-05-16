
-- Créer la table des assignments (missions)
CREATE TABLE assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  stagiaire_id uuid REFERENCES stagiaires(id) ON DELETE CASCADE,
  tutor_id uuid REFERENCES users(id),
  status text NOT NULL CHECK (status IN ('en_cours', 'termine', 'en_attente')),
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des projets
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  stagiaire_id uuid REFERENCES stagiaires(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('en_cours', 'termine', 'en_attente')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS pour la table projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Créer les politiques pour la table projects
CREATE POLICY "Les stagiaires peuvent voir leurs projets" ON projects
  FOR SELECT USING (
    stagiaire_id IN (
      SELECT id FROM stagiaires WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Les tuteurs peuvent voir les projets de leurs stagiaires" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stagiaires
      WHERE stagiaires.id = projects.stagiaire_id
      AND stagiaires.tutor_id = auth.uid()
    )
  );

CREATE POLICY "RH et Admin peuvent tout faire" ON projects
  FOR ALL USING (auth.jwt() ->> 'role' IN ('RH', 'administrateur'));

-- Créer la table des logs
CREATE TABLE logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Créer la table des notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Créer la table des projects
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  stagiaire_id uuid REFERENCES stagiaires(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('en_cours', 'termine', 'en_attente')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS sur les nouvelles tables
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de sécurité
CREATE POLICY "Les utilisateurs peuvent voir leurs assignments" ON assignments FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM stagiaires WHERE id = stagiaire_id)
  OR auth.uid() = tutor_id
  OR auth.jwt() ->> 'role' IN ('RH', 'administrateur')
);

CREATE POLICY "Seuls les administrateurs peuvent voir les logs" ON logs FOR SELECT USING (
  auth.jwt() ->> 'role' = 'administrateur'
);

CREATE POLICY "Les utilisateurs peuvent voir leurs notifications" ON notifications FOR SELECT USING (
  auth.uid() = user_id OR auth.jwt() ->> 'role' = 'administrateur'
);

CREATE POLICY "Les utilisateurs peuvent voir leurs projets" ON projects FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM stagiaires WHERE id = stagiaire_id)
  OR auth.jwt() ->> 'role' IN ('RH', 'administrateur')
);
