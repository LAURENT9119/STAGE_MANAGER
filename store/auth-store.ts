
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, userData: any) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        set({ error: error.message, loading: false });
        return false;
      }

      if (data.user) {
        // Récupérer les informations utilisateur complètes
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          set({ error: userError.message, loading: false });
          return false;
        }

        set({ 
          user: userData,
          loading: false,
          error: null
        });
        return true;
      }

      set({ loading: false });
      return false;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur de connexion',
        loading: false 
      });
      return false;
    }
  },

  signUp: async (email: string, password: string, userData: any) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        set({ error: error.message, loading: false });
        return false;
      }

      if (data.user) {
        // Créer l'utilisateur dans la table users
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            full_name: userData.full_name,
            role: userData.role || 'intern',
            created_at: new Date().toISOString()
          }]);

        if (insertError) {
          set({ error: insertError.message, loading: false });
          return false;
        }

        set({ loading: false });
        return true;
      }

      set({ loading: false });
      return false;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription',
        loading: false 
      });
      return false;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await supabase.auth.signOut();
      set({ user: null, loading: false, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la déconnexion',
        loading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  initialize: async () => {
    try {
      set({ loading: true });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          set({ user: null, loading: false });
          return;
        }

        set({ user: userData, loading: false });
      } else {
        set({ user: null, loading: false });
      }

      // Écouter les changements d'authentification
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!error && userData) {
            set({ user: userData });
          }
        } else if (event === 'SIGNED_OUT') {
          set({ user: null });
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      set({ user: null, loading: false });
    }
  }
}));
import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ error: error.message, loading: false });
        return false;
      }

      if (data.user) {
        set({ 
          user: {
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || '',
            role: data.user.user_metadata?.role || 'intern'
          },
          loading: false 
        });
        return true;
      }

      return false;
    } catch (error) {
      set({ error: 'Erreur de connexion', loading: false });
      return false;
    }
  },

  signUp: async (email: string, password: string, fullName: string, role: string) => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        set({ error: error.message, loading: false });
        return false;
      }

      if (data.user) {
        set({ 
          user: {
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            role: role
          },
          loading: false 
        });
        return true;
      }

      return false;
    } catch (error) {
      set({ error: 'Erreur lors de l\'inscription', loading: false });
      return false;
    }
  },

  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ user: null, loading: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
