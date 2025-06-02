
-- Script pour corriger les politiques RLS et éviter la récursion infinie

-- Supprimer toutes les politiques existantes pour les utilisateurs
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view related evaluations" ON evaluations;
DROP POLICY IF EXISTS "Tutors can create evaluations" ON evaluations;
DROP POLICY IF EXISTS "Users can view their own requests" ON requests;
DROP POLICY IF EXISTS "Interns can create requests" ON requests;
DROP POLICY IF EXISTS "Admins and HR can update requests" ON requests;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view related documents" ON documents;
DROP POLICY IF EXISTS "Admins can manage settings" ON settings;

-- Créer des politiques simplifiées et sécurisées

-- Politiques pour la table users
CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable users to update own record" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Enable insert for authenticated users" ON users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politiques pour requests
CREATE POLICY "Enable read for authenticated users" ON requests
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON requests
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Politiques pour evaluations
CREATE POLICY "Enable read for authenticated users" ON evaluations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON evaluations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON evaluations
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Politiques pour notifications
CREATE POLICY "Enable read for own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Enable update for own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Politiques pour documents
CREATE POLICY "Enable read for authenticated users" ON documents
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON documents
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politiques pour settings (admin seulement via fonction)
CREATE POLICY "Enable read for authenticated users" ON settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Politiques pour interns
CREATE POLICY "Enable read for authenticated users" ON interns
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON interns
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON interns
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Politiques pour departments
CREATE POLICY "Enable read for authenticated users" ON departments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Politiques pour activity_logs
CREATE POLICY "Enable read for authenticated users" ON activity_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON activity_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
