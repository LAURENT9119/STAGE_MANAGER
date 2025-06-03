
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
          avatar_url: string | null;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          updated_at?: string;
        };
      };
      interns: {
        Row: {
          id: string;
          user_id: string;
          tutor_id: string;
          department: string;
          start_date: string;
          end_date: string;
          status: 'upcoming' | 'active' | 'completed' | 'cancelled' | 'terminated';
          university: string;
          level: string;
          contract_type: string;
          project: string | null;
          progress: number;
          evaluation_score: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tutor_id: string;
          department: string;
          start_date: string;
          end_date: string;
          status?: 'upcoming' | 'active' | 'completed' | 'cancelled' | 'terminated';
          university: string;
          level: string;
          contract_type: string;
          project?: string | null;
          progress?: number;
          evaluation_score?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tutor_id?: string;
          department?: string;
          start_date?: string;
          end_date?: string;
          status?: 'upcoming' | 'active' | 'completed' | 'cancelled' | 'terminated';
          university?: string;
          level?: string;
          contract_type?: string;
          project?: string | null;
          progress?: number;
          evaluation_score?: number | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      requests: {
        Row: {
          id: string;
          intern_id: string;
          type: 'convention' | 'prolongation' | 'conge' | 'attestation' | 'evaluation' | 'autre';
          title: string;
          description: string;
          status: 'draft' | 'submitted' | 'tutor_review' | 'hr_review' | 'finance_review' | 'approved' | 'rejected';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          submission_date: string | null;
          due_date: string | null;
          tutor_approved_at: string | null;
          tutor_approved_by: string | null;
          hr_approved_at: string | null;
          hr_approved_by: string | null;
          finance_approved_at: string | null;
          finance_approved_by: string | null;
          final_approved_at: string | null;
          rejection_reason: string | null;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          intern_id: string;
          type: 'convention' | 'prolongation' | 'conge' | 'attestation' | 'evaluation' | 'autre';
          title: string;
          description: string;
          status?: 'draft' | 'submitted' | 'tutor_review' | 'hr_review' | 'finance_review' | 'approved' | 'rejected';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          submission_date?: string | null;
          due_date?: string | null;
          tutor_approved_at?: string | null;
          tutor_approved_by?: string | null;
          hr_approved_at?: string | null;
          hr_approved_by?: string | null;
          finance_approved_at?: string | null;
          finance_approved_by?: string | null;
          final_approved_at?: string | null;
          rejection_reason?: string | null;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          intern_id?: string;
          type?: 'convention' | 'prolongation' | 'conge' | 'attestation' | 'evaluation' | 'autre';
          title?: string;
          description?: string;
          status?: 'draft' | 'submitted' | 'tutor_review' | 'hr_review' | 'finance_review' | 'approved' | 'rejected';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          submission_date?: string | null;
          due_date?: string | null;
          tutor_approved_at?: string | null;
          tutor_approved_by?: string | null;
          hr_approved_at?: string | null;
          hr_approved_by?: string | null;
          finance_approved_at?: string | null;
          finance_approved_by?: string | null;
          final_approved_at?: string | null;
          rejection_reason?: string | null;
          metadata?: Record<string, any>;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          request_id: string | null;
          intern_id: string | null;
          name: string;
          type: string;
          file_path: string;
          file_size: number | null;
          mime_type: string | null;
          uploaded_by: string | null;
          is_generated: boolean;
          template_used: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id?: string | null;
          intern_id?: string | null;
          name: string;
          type: string;
          file_path: string;
          file_size?: number | null;
          mime_type?: string | null;
          uploaded_by?: string | null;
          is_generated?: boolean;
          template_used?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string | null;
          intern_id?: string | null;
          name?: string;
          type?: string;
          file_path?: string;
          file_size?: number | null;
          mime_type?: string | null;
          uploaded_by?: string | null;
          is_generated?: boolean;
          template_used?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          is_read: boolean;
          related_request_id: string | null;
          related_intern_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          is_read?: boolean;
          related_request_id?: string | null;
          related_intern_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          is_read?: boolean;
          related_request_id?: string | null;
          related_intern_id?: string | null;
        };
      };
      evaluations: {
        Row: {
          id: string;
          intern_id: string;
          evaluator_id: string;
          type: 'monthly' | 'final' | 'self';
          period_start: string;
          period_end: string;
          technical_skills: number | null;
          soft_skills: number | null;
          communication: number | null;
          autonomy: number | null;
          overall_score: number | null;
          comments: string | null;
          recommendations: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          intern_id: string;
          evaluator_id: string;
          type: 'monthly' | 'final' | 'self';
          period_start: string;
          period_end: string;
          technical_skills?: number | null;
          soft_skills?: number | null;
          communication?: number | null;
          autonomy?: number | null;
          overall_score?: number | null;
          comments?: string | null;
          recommendations?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          intern_id?: string;
          evaluator_id?: string;
          type?: 'monthly' | 'final' | 'self';
          period_start?: string;
          period_end?: string;
          technical_skills?: number | null;
          soft_skills?: number | null;
          communication?: number | null;
          autonomy?: number | null;
          overall_score?: number | null;
          comments?: string | null;
          recommendations?: string | null;
          updated_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: Record<string, any>;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Record<string, any>;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          details?: Record<string, any>;
          ip_address?: string | null;
          user_agent?: string | null;
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: Record<string, any>;
          description: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Record<string, any>;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Record<string, any>;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
