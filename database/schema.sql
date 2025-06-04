
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS
ALTER DATABASE postgres SET row_security = on;

-- Create users table (renamed from profiles)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'hr', 'tutor', 'intern', 'finance')) NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interns table
CREATE TABLE IF NOT EXISTS interns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES users(id),
  department TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled', 'terminated')) DEFAULT 'upcoming',
  university TEXT NOT NULL,
  level TEXT NOT NULL,
  contract_type TEXT NOT NULL,
  project TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  evaluation_score DECIMAL(3,2) CHECK (evaluation_score >= 0 AND evaluation_score <= 20),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  intern_id UUID REFERENCES interns(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('convention', 'prolongation', 'conge', 'attestation', 'evaluation', 'autre')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'submitted', 'tutor_review', 'hr_review', 'finance_review', 'approved', 'rejected')) DEFAULT 'draft',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  submission_date TIMESTAMP WITH TIME ZONE,
  due_date DATE,
  tutor_approved_at TIMESTAMP WITH TIME ZONE,
  tutor_approved_by UUID REFERENCES users(id),
  hr_approved_at TIMESTAMP WITH TIME ZONE,
  hr_approved_by UUID REFERENCES users(id),
  finance_approved_at TIMESTAMP WITH TIME ZONE,
  finance_approved_by UUID REFERENCES users(id),
  final_approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  intern_id UUID REFERENCES interns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES users(id),
  is_generated BOOLEAN DEFAULT FALSE,
  template_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  related_request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
  related_intern_id UUID REFERENCES interns(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  intern_id UUID REFERENCES interns(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES users(id),
  type TEXT CHECK (type IN ('monthly', 'final', 'self')) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  technical_skills DECIMAL(3,2) CHECK (technical_skills >= 0 AND technical_skills <= 20),
  soft_skills DECIMAL(3,2) CHECK (soft_skills >= 0 AND soft_skills <= 20),
  communication DECIMAL(3,2) CHECK (communication >= 0 AND communication <= 20),
  autonomy DECIMAL(3,2) CHECK (autonomy >= 0 AND autonomy <= 20),
  overall_score DECIMAL(3,2) CHECK (overall_score >= 0 AND overall_score <= 20),
  comments TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_interns_user_id ON interns(user_id);
CREATE INDEX IF NOT EXISTS idx_interns_tutor_id ON interns(tutor_id);
CREATE INDEX IF NOT EXISTS idx_interns_status ON interns(status);
CREATE INDEX IF NOT EXISTS idx_requests_intern_id ON requests(intern_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_type ON requests(type);
CREATE INDEX IF NOT EXISTS idx_documents_request_id ON documents(request_id);
CREATE INDEX IF NOT EXISTS idx_documents_intern_id ON documents(intern_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_evaluations_intern_id ON evaluations(intern_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "HR and admin can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('hr', 'admin')
    )
  );

-- RLS Policies for interns
CREATE POLICY "Interns can view their own data" ON interns
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Tutors can view their assigned interns" ON interns
  FOR SELECT USING (tutor_id = auth.uid());

CREATE POLICY "HR and admin can view all interns" ON interns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('hr', 'admin')
    )
  );

-- RLS Policies for requests
CREATE POLICY "Users can view their related requests" ON requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM interns 
      WHERE id = requests.intern_id 
      AND (user_id = auth.uid() OR tutor_id = auth.uid())
    )
    OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('hr', 'admin', 'finance')
    )
  );

CREATE POLICY "Interns can create requests" ON requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM interns 
      WHERE id = intern_id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interns_updated_at BEFORE UPDATE ON interns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```
