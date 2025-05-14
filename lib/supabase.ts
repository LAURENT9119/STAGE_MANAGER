import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'intern' | 'tutor' | 'hr' | 'finance' | 'admin';
          avatar_url: string | null;
          department: string | null;
          position: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'intern' | 'tutor' | 'hr' | 'finance' | 'admin';
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
          role?: 'intern' | 'tutor' | 'hr' | 'finance' | 'admin';
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
      interns: {
        Row: {
          id: string;
          user_id: string;
          tutor_id: string;
          department_id: string;
          school: string;
          formation: string;
          start_date: string;
          end_date: string;
          status: 'active' | 'completed' | 'upcoming';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tutor_id: string;
          department_id: string;
          school: string;
          formation: string;
          start_date: string;
          end_date: string;
          status: 'active' | 'completed' | 'upcoming';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tutor_id?: string;
          department_id?: string;
          school?: string;
          formation?: string;
          start_date?: string;
          end_date?: string;
          status?: 'active' | 'completed' | 'upcoming';
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
          status: 'pending' | 'processing' | 'approved' | 'rejected';
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
          status: 'pending' | 'processing' | 'approved' | 'rejected';
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
          status?: 'pending' | 'processing' | 'approved' | 'rejected';
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
          status: 'pending' | 'paid' | 'cancelled';
          period: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          intern_id: string;
          amount: number;
          status: 'pending' | 'paid' | 'cancelled';
          period: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          intern_id?: string;
          amount?: number;
          status?: 'pending' | 'paid' | 'cancelled';
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
          type: 'mid_term' | 'final';
          score: number;
          comments: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          intern_id: string;
          tutor_id: string;
          type: 'mid_term' | 'final';
          score: number;
          comments?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          intern_id?: string;
          tutor_id?: string;
          type?: 'mid_term' | 'final';
          score?: number;
          comments?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};