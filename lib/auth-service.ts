
import { createClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    role?: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
  avatar_url?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export class AuthService {
  static async signUp(email: string, password: string, userData: { full_name: string; role: string }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
          },
        },
      });

      if (error) throw error;

      // Le profil utilisateur sera créé automatiquement par le trigger
      // Pas besoin d'insérer manuellement car le trigger handle_new_user() s'en charge

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  static async getCurrentUser(): Promise<{ user: User | null; session: Session | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (error) throw error;
      return { user, session };
    } catch (error) {
      return { user: null, session: null };
    }
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Erreur getUserProfile:', error);
      return null;
    }
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
