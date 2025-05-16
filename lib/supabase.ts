import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: string;
          avatar_url?: string;
          department?: string;
          position?: string;
          phone?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'stagiaire' | 'tuteur' | 'RH' | 'finance' | 'administrateur';
          avatar_url?: string | null;
          department?: string | null;
          position?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'stagiaire' | 'tuteur' | 'RH' | 'finance' | 'administrateur';
          avatar_url?: string | null;
          department?: string | null;
          position?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      stagiaires: {
        Row: {
          id: string;
          user_id: string;
          tuteur_id: string;
          department_id: string;
          school: string;
          formation: string;
          start_date: string;
          end_date: string;
          status: 'actif' | 'termine' | 'a_venir';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tuteur_id: string;
          department_id: string;
          school: string;
          formation: string;
          start_date: string;
          end_date: string;
          status: 'actif' | 'termine' | 'a_venir';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tuteur_id?: string;
          department_id?: string;
          school?: string;
          formation?: string;
          start_date?: string;
          end_date?: string;
          status?: 'actif' | 'termine' | 'a_venir';
          created_at?: string;
          updated_at?: string;
        };
      };
      requests: {
        Row: {
          id: string;
          type: 'convention' | 'prolongation' | 'conge' | 'attestation';
          title: string;
          details: string | null;
          intern_id: string;
          status: 'en_attente' | 'en_cours' | 'validee' | 'refusee';
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: 'convention' | 'prolongation' | 'conge' | 'attestation';
          title: string;
          details?: string | null;
          intern_id: string;
          status: 'en_attente' | 'en_cours' | 'validee' | 'refusee';
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: 'convention' | 'prolongation' | 'conge' | 'attestation';
          title?: string;
          details?: string | null;
          intern_id?: string;
          status?: 'en_attente' | 'en_cours' | 'validee' | 'refusee';
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          name: string;
          type: string;
          url: string;
          intern_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          url: string;
          intern_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          url?: string;
          intern_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          intern_id: string;
          amount: number;
          status: 'en_attente' | 'paye' | 'annule';
          period: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          intern_id: string;
          amount: number;
          status: 'en_attente' | 'paye' | 'annule';
          period: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          intern_id?: string;
          amount?: number;
          status?: 'en_attente' | 'paye' | 'annule';
          period?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      evaluations: {
        Row: {
          id: string;
          intern_id: string;
          tutor_id: string;
          type: 'mi_parcours' | 'finale';
          score: number;
          comments: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          intern_id: string;
          tutor_id: string;
          type: 'mi_parcours' | 'finale';
          score: number;
          comments?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          intern_id?: string;
          tutor_id?: string;
          type?: 'mi_parcours' | 'finale';
          score?: number;
          comments?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};