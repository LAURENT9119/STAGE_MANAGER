-- Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "HR and admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Interns can view their own data" ON interns;
DROP POLICY IF EXISTS "Tutors can view their assigned interns" ON interns;
DROP POLICY IF EXISTS "HR and admin can view all interns" ON interns;
DROP POLICY IF EXISTS "Users can view their related requests" ON requests;
DROP POLICY IF EXISTS "Interns can create requests" ON requests;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

-- Politiques pour profiles
CREATE POLICY "Users can view profiles based on role" ON profiles
  FOR SELECT USING (
    auth.uid() = id
    OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'hr')
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles p JOIN interns i ON i.tutor_id = p.id
      WHERE p.id = auth.uid() AND p.role = 'tutor' AND i.user_id = profiles.id
    )
  );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin and HR can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'hr')
    )
  );

-- Politiques pour interns
CREATE POLICY "View interns based on role" ON interns
  FOR SELECT USING (
    user_id = auth.uid()
    OR tutor_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'hr', 'finance')
    )
  );

CREATE POLICY "Admin and HR can manage interns" ON interns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'hr')
    )
  );

-- Politiques pour requests
CREATE POLICY "View requests based on role" ON requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM interns i 
      WHERE i.id = requests.intern_id 
      AND (i.user_id = auth.uid() OR i.tutor_id = auth.uid())
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'hr', 'finance')
    )
  );

CREATE POLICY "Interns can create their requests" ON requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM interns i 
      WHERE i.id = requests.intern_id AND i.user_id = auth.uid()
    )
  );

CREATE POLICY "Update requests based on role" ON requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM interns i 
      WHERE i.id = requests.intern_id AND i.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'hr', 'finance', 'tutor')
    )
  );

-- Politiques pour notifications
CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Politiques pour documents
CREATE POLICY "View documents based on role" ON documents
  FOR SELECT USING (
    uploaded_by = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM interns i 
      WHERE i.id = documents.intern_id 
      AND (i.user_id = auth.uid() OR i.tutor_id = auth.uid())
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'hr', 'finance')
    )
  );

CREATE POLICY "Upload documents based on role" ON documents
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid()
    AND
    (
      EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() AND p.role IN ('admin', 'hr', 'finance')
      )
      OR
      EXISTS (
        SELECT 1 FROM interns i 
        WHERE i.id = documents.intern_id AND i.user_id = auth.uid()
      )
    )
  );

-- Politiques pour evaluations
CREATE POLICY "View evaluations based on role" ON evaluations
  FOR SELECT USING (
    evaluator_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM interns i 
      WHERE i.id = evaluations.intern_id AND i.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'hr')
    )
  );

CREATE POLICY "Create evaluations based on role" ON evaluations
  FOR INSERT WITH CHECK (
    evaluator_id = auth.uid()
    AND
    (
      EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() AND p.role IN ('admin', 'hr', 'tutor')
      )
    )
  );