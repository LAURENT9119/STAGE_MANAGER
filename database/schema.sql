-- Schéma de base de données pour la plateforme de gestion des stagiaires

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop des tables existantes dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS interns CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Table des utilisateurs (profils)
CREATE TABLE users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'hr', 'tutor', 'intern', 'finance')),
    avatar_url TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des départements
CREATE TABLE departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des stagiaires
CREATE TABLE interns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id),
    tutor_id UUID REFERENCES users(id),
    department TEXT NOT NULL,
    university TEXT NOT NULL,
    level TEXT NOT NULL,
    contract_type TEXT NOT NULL,
    project TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled', 'terminated')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    evaluation_score DECIMAL(3,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des demandes
CREATE TABLE requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    intern_id UUID REFERENCES interns(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('convention', 'prolongation', 'conge', 'attestation', 'evaluation', 'extension', 'leave', 'termination')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'medium', 'high', 'urgent')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_id UUID REFERENCES users(id),
    reviewer_comments TEXT,
    documents JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des évaluations
CREATE TABLE evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    intern_id UUID REFERENCES interns(id) ON DELETE CASCADE NOT NULL,
    evaluator_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    period TEXT NOT NULL, -- 'monthly', 'mid-term', 'final'
    technical_skills INTEGER CHECK (technical_skills >= 1 AND technical_skills <= 5),
    soft_skills INTEGER CHECK (soft_skills >= 1 AND soft_skills <= 5),
    punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
    initiative INTEGER CHECK (initiative >= 1 AND initiative <= 5),
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    comments TEXT,
    recommendations TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'validated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des documents
CREATE TABLE documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    intern_id UUID REFERENCES interns(id) ON DELETE CASCADE,
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('convention', 'attestation', 'evaluation', 'report', 'other')),
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    related_to_type VARCHAR(20) CHECK (related_to_type IN ('intern', 'request', 'user')),
    related_to_id UUID,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des notifications
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des logs d'activité
CREATE TABLE activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paramètres système
CREATE TABLE settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes pour optimiser les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_interns_user_id ON interns(user_id);
CREATE INDEX idx_interns_tutor_id ON interns(tutor_id);
CREATE INDEX idx_interns_status ON interns(status);
CREATE INDEX idx_requests_intern_id ON requests(intern_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_type ON requests(type);
CREATE INDEX idx_requests_submitted_at ON requests(submitted_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Triggers pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interns_updated_at 
    BEFORE UPDATE ON interns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at 
    BEFORE UPDATE ON requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at 
    BEFORE UPDATE ON evaluations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at 
    BEFORE UPDATE ON settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) pour la sécurité
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS de base
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies pour requests
CREATE POLICY "Users can view their own requests" ON requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM interns 
            WHERE interns.id = requests.intern_id 
            AND interns.user_id = auth.uid()
        )
        OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'hr', 'tutor', 'finance')
        )
    );

CREATE POLICY "Interns can create requests" ON requests
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM interns 
            WHERE interns.id = requests.intern_id 
            AND interns.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins and HR can update requests" ON requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'hr')
        )
    );

-- RLS Policies pour evaluations
CREATE POLICY "Users can view related evaluations" ON evaluations
    FOR SELECT USING (
        evaluator_id = auth.uid()
        OR 
        EXISTS (
            SELECT 1 FROM interns 
            WHERE interns.id = evaluations.intern_id 
            AND interns.user_id = auth.uid()
        )
        OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'hr')
        )
    );

CREATE POLICY "Tutors can create evaluations" ON evaluations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('tutor', 'admin', 'hr')
        )
    );

-- RLS Policies pour notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies pour documents
CREATE POLICY "Users can view related documents" ON documents
    FOR SELECT USING (
        uploaded_by = auth.uid()
        OR 
        EXISTS (
            SELECT 1 FROM interns 
            WHERE interns.id = documents.intern_id 
            AND interns.user_id = auth.uid()
        )
        OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'hr', 'tutor')
        )
    );

-- RLS Policies pour settings
CREATE POLICY "Admins can manage settings" ON settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Données initiales
INSERT INTO departments (name, description) VALUES 
('Informatique', 'Département IT et développement'),
('Marketing', 'Marketing et communication'),
('Finance', 'Comptabilité et finance'),
('Ressources Humaines', 'Gestion des ressources humaines')
ON CONFLICT DO NOTHING;

-- Insérer les paramètres par défaut
INSERT INTO settings (key, value, description) VALUES
('company_info', '{"name": "Entreprise SARL", "address": "123 Rue de la Paix, 75001 Paris", "phone": "+33 1 23 45 67 89", "email": "contact@entreprise.com", "city": "Paris"}', 'Informations de l''entreprise'),
('email_notifications', '{"enabled": true, "request_updates": true, "evaluation_reminders": true}', 'Configuration des notifications email'),
('document_templates', '{"convention_template": "default", "attestation_template": "default"}', 'Templates de documents'),
('max_intern_duration_months', '6', 'Durée maximale d''un stage en mois'),
('notification_email_enabled', 'true', 'Activer les notifications par email'),
('max_file_upload_size_mb', '10', 'Taille maximale des fichiers uploadés en MB'),
('default_intern_progress', '0', 'Progression par défaut des nouveaux stagiaires')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    description = EXCLUDED.description;

-- COMPTES DE TEST CRÉÉS:
-- ======================
-- admin@company.com / password123 (Administrateur)
-- hr@company.com / password123 (RH)
-- finance@company.com / password123 (Finance)  
-- marie.laurent@company.com / password123 (Tuteur)

-- Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer le profil utilisateur automatiquement
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'intern')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui s'exécute après l'insertion d'un nouvel utilisateur dans auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();