
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
  created_at: string;
  updated_at?: string;
  avatar_url?: string;
  phone?: string;
  department?: string;
  position?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  phone?: string;
  department?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: User;
}
