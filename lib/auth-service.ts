
import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
  full_name: string;
  created_at: string;
}

// Test users for development
const TEST_USERS: User[] = [
  {
    id: 'test-admin-1',
    email: 'admin@test.com',
    role: 'admin',
    full_name: 'Admin Test',
    created_at: new Date().toISOString(),
  },
  {
    id: 'test-hr-1',
    email: 'hr@test.com',
    role: 'hr',
    full_name: 'HR Test',
    created_at: new Date().toISOString(),
  },
  {
    id: 'test-tutor-1',
    email: 'tutor@test.com',
    role: 'tutor',
    full_name: 'Tuteur Test',
    created_at: new Date().toISOString(),
  },
  {
    id: 'test-intern-1',
    email: 'intern@test.com',
    role: 'intern',
    full_name: 'Stagiaire Test',
    created_at: new Date().toISOString(),
  },
  {
    id: 'test-finance-1',
    email: 'finance@test.com',
    role: 'finance',
    full_name: 'Finance Test',
    created_at: new Date().toISOString(),
  },
];

export class AuthService {
  private isTestMode = process.env.NODE_ENV === 'development';

  async signIn(email: string, password: string): Promise<User | null> {
    if (this.isTestMode && password === 'test123') {
      const testUser = TEST_USERS.find(user => user.email === email);
      if (testUser) {
        localStorage.setItem('currentUser', JSON.stringify(testUser));
        return testUser;
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    return null;
  }

  async signOut(): Promise<void> {
    if (this.isTestMode) {
      localStorage.removeItem('currentUser');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
    return null;
  }

  async switchTestUser(email: string): Promise<User | null> {
    if (!this.isTestMode) return null;
    
    const testUser = TEST_USERS.find(user => user.email === email);
    if (testUser) {
      localStorage.setItem('currentUser', JSON.stringify(testUser));
      return testUser;
    }
    return null;
  }

  getTestUsers(): User[] {
    return this.isTestMode ? TEST_USERS : [];
  }
}

export const authService = new AuthService();
