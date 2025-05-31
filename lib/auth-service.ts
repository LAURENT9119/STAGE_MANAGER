import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export class AuthService {
  private isProduction = process.env.NODE_ENV === 'production';

  async signIn(email: string, password: string): Promise<User | null> {
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

        if (userError) {
          // Si l'utilisateur n'existe pas dans la table users, le créer
          const newUser: Partial<User> = {
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || data.user.email!,
            role: data.user.user_metadata?.role || 'intern',
          };

          const { data: createdUser, error: createError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();

          if (createError) throw createError;

          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(createdUser));
          }
          return createdUser;
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(userData));
        }
        return userData;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    return null;
  }

  async signUp(email: string, password: string, fullName: string, role: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        }
      });

      if (error) throw error;

      if (data.user) {
        // Créer le profil utilisateur
        const newUser: Partial<User> = {
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: role as any,
        };

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();

        if (createError) throw createError;

        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(createdUser));
        }
        return createdUser;
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }

    return null;
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser');
      }
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

  async refreshUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) return null;

      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(data));
      }
      return data;
    } catch (error) {
      console.error('Refresh user error:', error);
      return null;
    }
  }

  // Mode développement - utilisateurs de test (uniquement en dev)
  getTestUsers(): User[] {
    if (process.env.NODE_ENV !== 'development') return [];
    
    return [
      { id: '1', email: 'admin@company.com', full_name: 'Admin Test', role: 'admin', created_at: new Date().toISOString() },
      { id: '2', email: 'hr@company.com', full_name: 'HR Test', role: 'hr', created_at: new Date().toISOString() },
      { id: '3', email: 'tutor@company.com', full_name: 'Tutor Test', role: 'tutor', created_at: new Date().toISOString() },
      { id: '4', email: 'intern@company.com', full_name: 'Intern Test', role: 'intern', created_at: new Date().toISOString() },
      { id: '5', email: 'finance@company.com', full_name: 'Finance Test', role: 'finance', created_at: new Date().toISOString() },
    ];
  }

  async switchTestUser(email: string): Promise<User | null> {
    if (process.env.NODE_ENV !== 'development') return null;
    
    const testUsers = this.getTestUsers();
    const user = testUsers.find(u => u.email === email);
    
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    return null;
  }
}

export const authService = new AuthService();