
import { supabase } from './supabase';

export interface ProductionUser {
  id: string;
  email: string;
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionIntern {
  id: string;
  user_id: string;
  tutor_id: string;
  department: string;
  university: string;
  level: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  progress: number;
  evaluation_score?: number;
  user?: ProductionUser;
  tutor?: ProductionUser;
}

export interface ProductionRequest {
  id: string;
  intern_id: string;
  type: 'convention' | 'prolongation' | 'conge' | 'attestation' | 'evaluation';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  intern?: ProductionIntern;
}

export class ProductionService {
  // Users
  static async getAllUsers(): Promise<ProductionUser[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getUserById(id: string): Promise<ProductionUser | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }

  static async getUsersByRole(role: string): Promise<ProductionUser[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Interns
  static async getAllInterns(): Promise<ProductionIntern[]> {
    const { data, error } = await supabase
      .from('interns')
      .select(`
        *,
        user:users!interns_user_id_fkey(*),
        tutor:users!interns_tutor_id_fkey(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getInternsByTutor(tutorId: string): Promise<ProductionIntern[]> {
    const { data, error } = await supabase
      .from('interns')
      .select(`
        *,
        user:users!interns_user_id_fkey(*),
        tutor:users!interns_tutor_id_fkey(*)
      `)
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getInternByUserId(userId: string): Promise<ProductionIntern | null> {
    const { data, error } = await supabase
      .from('interns')
      .select(`
        *,
        user:users!interns_user_id_fkey(*),
        tutor:users!interns_tutor_id_fkey(*)
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) return null;
    return data;
  }

  static async createIntern(internData: Omit<ProductionIntern, 'id' | 'user' | 'tutor'>): Promise<ProductionIntern> {
    const { data, error } = await supabase
      .from('interns')
      .insert(internData)
      .select(`
        *,
        user:users!interns_user_id_fkey(*),
        tutor:users!interns_tutor_id_fkey(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateIntern(id: string, updates: Partial<ProductionIntern>): Promise<ProductionIntern> {
    const { data, error } = await supabase
      .from('interns')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        user:users!interns_user_id_fkey(*),
        tutor:users!interns_tutor_id_fkey(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Requests
  static async getAllRequests(): Promise<ProductionRequest[]> {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        intern:interns(
          *,
          user:users(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getRequestsByIntern(internId: string): Promise<ProductionRequest[]> {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        intern:interns(
          *,
          user:users(*)
        )
      `)
      .eq('intern_id', internId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createRequest(requestData: Omit<ProductionRequest, 'id' | 'intern'>): Promise<ProductionRequest> {
    const { data, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select(`
        *,
        intern:interns(
          *,
          user:users(*)
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateRequestStatus(
    id: string, 
    status: string, 
    reviewerId?: string, 
    comments?: string
  ): Promise<ProductionRequest> {
    const updateData: any = { 
      status,
      reviewed_at: new Date().toISOString()
    };
    
    if (reviewerId) updateData.reviewer_id = reviewerId;
    if (comments) updateData.reviewer_comments = comments;

    const { data, error } = await supabase
      .from('requests')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        intern:interns(
          *,
          user:users(*)
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Statistics
  static async getDashboardStats(userId: string, role: string) {
    try {
      const stats: any = {};

      if (role === 'admin' || role === 'hr') {
        // Total stats for admin/hr
        const [internsResult, requestsResult, usersResult] = await Promise.all([
          supabase.from('interns').select('status'),
          supabase.from('requests').select('status'),
          supabase.from('users').select('role')
        ]);

        stats.totalInterns = internsResult.data?.length || 0;
        stats.activeInterns = internsResult.data?.filter(i => i.status === 'active').length || 0;
        stats.pendingRequests = requestsResult.data?.filter(r => r.status === 'pending').length || 0;
        stats.totalUsers = usersResult.data?.length || 0;
        
      } else if (role === 'tutor') {
        // Tutor-specific stats
        const internsResult = await supabase
          .from('interns')
          .select('status')
          .eq('tutor_id', userId);
        
        stats.myInterns = internsResult.data?.length || 0;
        stats.activeInterns = internsResult.data?.filter(i => i.status === 'active').length || 0;
        
      } else if (role === 'intern') {
        // Intern-specific stats
        const [internResult, requestsResult] = await Promise.all([
          supabase.from('interns').select('*').eq('user_id', userId).single(),
          supabase.from('requests').select('status').eq('intern_id', userId)
        ]);

        stats.progress = internResult.data?.progress || 0;
        stats.myRequests = requestsResult.data?.length || 0;
        stats.pendingRequests = requestsResult.data?.filter(r => r.status === 'pending').length || 0;
      }

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {};
    }
  }
}
