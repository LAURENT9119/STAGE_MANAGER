/*
  # Initial Schema Setup for Stage+ Platform

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - name (text)
      - role (text)
      - avatar_url (text)
      - department (text)
      - position (text)
      - phone (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - interns
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - tutor_id (uuid, references users)
      - department_id (uuid, references departments)
      - school (text)
      - formation (text)
      - start_date (date)
      - end_date (date)
      - status (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - departments
      - id (uuid, primary key)
      - name (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - requests
      - id (uuid, primary key)
      - type (text)
      - title (text)
      - details (text)
      - intern_id (uuid, references interns)
      - status (text)
      - start_date (date)
      - end_date (date)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - documents
      - id (uuid, primary key)
      - name (text)
      - type (text)
      - url (text)
      - intern_id (uuid, references interns)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - payments
      - id (uuid, primary key)
      - intern_id (uuid, references interns)
      - amount (numeric)
      - status (text)
      - period (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - evaluations
      - id (uuid, primary key)
      - intern_id (uuid, references interns)
      - tutor_id (uuid, references users)
      - type (text)
      - score (numeric)
      - comments (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for each table based on user role
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('intern', 'tutor', 'hr', 'finance', 'admin')),
  avatar_url text,
  department text,
  position text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create departments table
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interns table
CREATE TABLE interns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tutor_id uuid REFERENCES users(id),
  department_id uuid REFERENCES departments(id),
  school text NOT NULL,
  formation text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'completed', 'upcoming')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create requests table
CREATE TABLE requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('convention', 'prolongation', 'conge', 'attestation')),
  title text NOT NULL,
  details text,
  intern_id uuid REFERENCES interns(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'processing', 'approved', 'rejected')),
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  intern_id uuid REFERENCES interns(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id uuid REFERENCES interns(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled')),
  period text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create evaluations table
CREATE TABLE evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id uuid REFERENCES interns(id) ON DELETE CASCADE,
  tutor_id uuid REFERENCES users(id),
  type text NOT NULL CHECK (type IN ('mid_term', 'final')),
  score numeric CHECK (score >= 0 AND score <= 5),
  comments text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "HR and Admin can read all users" ON users
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' IN ('hr', 'admin'));

-- Create policies for departments
CREATE POLICY "Everyone can read departments" ON departments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "HR and Admin can manage departments" ON departments
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' IN ('hr', 'admin'));

-- Create policies for interns
CREATE POLICY "Interns can read their own data" ON interns
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Tutors can read their interns" ON interns
  FOR SELECT TO authenticated
  USING (auth.uid() = tutor_id);

CREATE POLICY "HR and Admin can manage interns" ON interns
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' IN ('hr', 'admin'));

-- Create policies for requests
CREATE POLICY "Interns can manage their requests" ON requests
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM interns
    WHERE interns.id = requests.intern_id
    AND interns.user_id = auth.uid()
  ));

CREATE POLICY "Tutors can read and update their interns requests" ON requests
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM interns
    WHERE interns.id = requests.intern_id
    AND interns.tutor_id = auth.uid()
  ));

CREATE POLICY "HR can manage all requests" ON requests
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' IN ('hr', 'admin'));

-- Create policies for documents
CREATE POLICY "Users can read their related documents" ON documents
  FOR SELECT TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM interns WHERE id = documents.intern_id
      UNION
      SELECT tutor_id FROM interns WHERE id = documents.intern_id
    )
    OR auth.jwt() ->> 'role' IN ('hr', 'admin')
  );

CREATE POLICY "HR and Admin can manage documents" ON documents
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' IN ('hr', 'admin'));

-- Create policies for payments
CREATE POLICY "Finance can manage payments" ON payments
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' IN ('finance', 'admin'));

CREATE POLICY "Users can read their related payments" ON payments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interns
      WHERE interns.id = payments.intern_id
      AND (interns.user_id = auth.uid() OR interns.tutor_id = auth.uid())
    )
    OR auth.jwt() ->> 'role' IN ('hr', 'finance', 'admin')
  );

-- Create policies for evaluations
CREATE POLICY "Tutors can manage their evaluations" ON evaluations
  FOR ALL TO authenticated
  USING (auth.uid() = tutor_id);

CREATE POLICY "Interns can read their evaluations" ON evaluations
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM interns
    WHERE interns.id = evaluations.intern_id
    AND interns.user_id = auth.uid()
  ));

CREATE POLICY "HR and Admin can read evaluations" ON evaluations
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' IN ('hr', 'admin'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interns_updated_at
  BEFORE UPDATE ON interns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at
  BEFORE UPDATE ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();