
-- Supprimer les anciennes politiques et en créer de nouvelles plus spécifiques

-- Politiques pour la table users
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

CREATE POLICY "Users can view profiles based on role" ON users
    FOR SELECT USING (
        -- Utilisateur peut voir son propre profil
        auth.uid()::text = id::text
        OR 
        -- Admin peut voir tous les profils
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role = 'admin'
        )
        OR
        -- RH peut voir tous les profils
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role = 'hr'
        )
        OR
        -- Tuteurs peuvent voir les profils de leurs stagiaires
        (
            EXISTS (
                SELECT 1 FROM users u 
                WHERE u.id = auth.uid() AND u.role = 'tutor'
            )
            AND
            EXISTS (
                SELECT 1 FROM interns i 
                WHERE i.tutor_id = auth.uid() AND i.user_id = users.id
            )
        )
    );

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (
        auth.uid()::text = id::text
        OR 
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr')
        )
    );

-- Politiques pour la table interns
DROP POLICY IF EXISTS "Users can view related interns" ON interns;

CREATE POLICY "Users can view interns based on role" ON interns
    FOR SELECT USING (
        -- Stagiaire peut voir son propre profil
        user_id = auth.uid()
        OR
        -- Tuteur peut voir ses stagiaires
        tutor_id = auth.uid()
        OR
        -- Admin et RH peuvent voir tous les stagiaires
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr')
        )
        OR
        -- Finance peut voir les stagiaires pour les conventions
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role = 'finance'
        )
    );

CREATE POLICY "Authorized users can create interns" ON interns
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr')
        )
    );

CREATE POLICY "Authorized users can update interns" ON interns
    FOR UPDATE USING (
        tutor_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr')
        )
    );

-- Politiques améliorées pour les requests
DROP POLICY IF EXISTS "Users can view their own requests" ON requests;
DROP POLICY IF EXISTS "Interns can create requests" ON requests;
DROP POLICY IF EXISTS "Admins and HR can update requests" ON requests;

CREATE POLICY "Users can view requests based on role" ON requests
    FOR SELECT USING (
        -- Stagiaire peut voir ses propres demandes
        EXISTS (
            SELECT 1 FROM interns i 
            WHERE i.id = requests.intern_id AND i.user_id = auth.uid()
        )
        OR
        -- Tuteur peut voir les demandes de ses stagiaires
        EXISTS (
            SELECT 1 FROM interns i 
            WHERE i.id = requests.intern_id AND i.tutor_id = auth.uid()
        )
        OR
        -- Admin, RH et Finance peuvent voir toutes les demandes
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr', 'finance')
        )
    );

CREATE POLICY "Interns can create their own requests" ON requests
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM interns i 
            WHERE i.id = requests.intern_id AND i.user_id = auth.uid()
        )
    );

CREATE POLICY "Authorized users can update requests" ON requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr', 'finance')
        )
        OR
        -- Tuteur peut approuver certaines demandes de ses stagiaires
        (
            EXISTS (
                SELECT 1 FROM users u 
                WHERE u.id = auth.uid() AND u.role = 'tutor'
            )
            AND
            EXISTS (
                SELECT 1 FROM interns i 
                WHERE i.id = requests.intern_id AND i.tutor_id = auth.uid()
            )
        )
    );

-- Politiques pour les évaluations
DROP POLICY IF EXISTS "Users can view related evaluations" ON evaluations;
DROP POLICY IF EXISTS "Tutors can create evaluations" ON evaluations;

CREATE POLICY "Users can view evaluations based on role" ON evaluations
    FOR SELECT USING (
        -- Evaluateur peut voir ses évaluations
        evaluator_id = auth.uid()
        OR
        -- Stagiaire peut voir ses propres évaluations
        EXISTS (
            SELECT 1 FROM interns i 
            WHERE i.id = evaluations.intern_id AND i.user_id = auth.uid()
        )
        OR
        -- Admin et RH peuvent voir toutes les évaluations
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr')
        )
    );

CREATE POLICY "Authorized users can create evaluations" ON evaluations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role IN ('tutor', 'admin', 'hr')
        )
        AND
        -- Vérifier que le tuteur évalue bien ses stagiaires
        (
            EXISTS (
                SELECT 1 FROM users u 
                WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr')
            )
            OR
            EXISTS (
                SELECT 1 FROM interns i 
                WHERE i.id = evaluations.intern_id AND i.tutor_id = auth.uid()
            )
        )
    );

-- Politiques pour les documents
DROP POLICY IF EXISTS "Users can view related documents" ON documents;

CREATE POLICY "Users can view documents based on role" ON documents
    FOR SELECT USING (
        -- Utilisateur qui a uploadé le document
        uploaded_by = auth.uid()
        OR
        -- Stagiaire peut voir ses documents
        EXISTS (
            SELECT 1 FROM interns i 
            WHERE i.id = documents.intern_id AND i.user_id = auth.uid()
        )
        OR
        -- Tuteur peut voir les documents de ses stagiaires
        EXISTS (
            SELECT 1 FROM interns i 
            WHERE i.id = documents.intern_id AND i.tutor_id = auth.uid()
        )
        OR
        -- Admin, RH et Finance peuvent voir tous les documents
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr', 'finance')
        )
        OR
        -- Documents publics
        is_public = true
    );

CREATE POLICY "Authorized users can upload documents" ON documents
    FOR INSERT WITH CHECK (
        uploaded_by = auth.uid()
        AND
        (
            -- Admin et RH peuvent uploader des documents
            EXISTS (
                SELECT 1 FROM users u 
                WHERE u.id = auth.uid() AND u.role IN ('admin', 'hr', 'finance')
            )
            OR
            -- Stagiaire peut uploader des documents pour ses demandes/profil
            EXISTS (
                SELECT 1 FROM interns i 
                WHERE i.id = documents.intern_id AND i.user_id = auth.uid()
            )
            OR
            -- Tuteur peut uploader des documents pour ses stagiaires
            EXISTS (
                SELECT 1 FROM interns i 
                WHERE i.id = documents.intern_id AND i.tutor_id = auth.uid()
            )
        )
    );
