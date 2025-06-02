
import { createClient } from '@/lib/supabase/client';

export interface ProductionUser {
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

export interface ProductionIntern {
  id: string;
  user_id: string;
  tutor_id?: string;
  department: string;
  university: string;
  level: string;
  contract_type: string;
  project?: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled' | 'terminated';
  progress: number;
  evaluation_score?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: ProductionUser;
  tutor?: ProductionUser;
}

export interface ProductionRequest {
  id: string;
  intern_id: string;
  type: 'convention' | 'prolongation' | 'conge' | 'attestation' | 'evaluation' | 'extension' | 'leave' | 'termination';
  title: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  priority: 'low' | 'normal' | 'medium' | 'high' | 'urgent';
  submitted_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  reviewer_comments?: string;
  created_at: string;
  updated_at: string;
  intern?: ProductionIntern;
  reviewer?: ProductionUser;
}

export interface DashboardStats {
  totalInterns: number;
  activeInterns: number;
  completedInterns: number;
  upcomingInterns: number;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalUsers: number;
  tutorCount: number;
  adminCount: number;
  hrCount: number;
  financeCount: number;
  averageInternDuration: number;
  averageEvaluationScore: number;
  monthlyInternships: Array<{ month: string; count: number }>;
  requestsByType: Array<{ type: string; count: number }>;
  departmentStats: Array<{ department: string; count: number }>;
  recentActivity: Array<{ action: string; date: string; user: string }>;
}

const supabase = createClient();

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

  static async getUsersByRole(role: string): Promise<ProductionUser[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createUser(userData: Partial<ProductionUser>): Promise<ProductionUser> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateUser(id: string, updates: Partial<ProductionUser>): Promise<ProductionUser> {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
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

  static async createIntern(internData: Partial<ProductionIntern>): Promise<ProductionIntern> {
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
      .update({ ...updates, updated_at: new Date().toISOString() })
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
          user:users!interns_user_id_fkey(*)
        ),
        reviewer:users!requests_reviewer_id_fkey(*)
      `)
      .order('submitted_at', { ascending: false });
    
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
          user:users!interns_user_id_fkey(*)
        ),
        reviewer:users!requests_reviewer_id_fkey(*)
      `)
      .eq('intern_id', internId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createRequest(requestData: Partial<ProductionRequest>): Promise<ProductionRequest> {
    const { data, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select(`
        *,
        intern:interns(
          *,
          user:users!interns_user_id_fkey(*)
        ),
        reviewer:users!requests_reviewer_id_fkey(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateRequest(id: string, updates: Partial<ProductionRequest>): Promise<ProductionRequest> {
    const { data, error } = await supabase
      .from('requests')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        intern:interns(
          *,
          user:users!interns_user_id_fkey(*)
        ),
        reviewer:users!requests_reviewer_id_fkey(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Dashboard Statistics
  static async getDashboardStats(userId?: string, role?: string): Promise<DashboardStats> {
    try {
      const stats: DashboardStats = {
        totalInterns: 0,
        activeInterns: 0,
        completedInterns: 0,
        upcomingInterns: 0,
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0,
        totalUsers: 0,
        tutorCount: 0,
        adminCount: 0,
        hrCount: 0,
        financeCount: 0,
        averageInternDuration: 0,
        averageEvaluationScore: 0,
        monthlyInternships: [],
        requestsByType: [],
        departmentStats: [],
        recentActivity: []
      };

      // Get all base data
      const [internsResult, requestsResult, usersResult] = await Promise.all([
        supabase.from('interns').select('*'),
        supabase.from('requests').select('*'),
        supabase.from('users').select('*')
      ]);

      const interns = internsResult.data || [];
      const requests = requestsResult.data || [];
      const users = usersResult.data || [];

      // Filter data based on user role
      let filteredInterns = interns;
      let filteredRequests = requests;

      if (role === 'tutor' && userId) {
        filteredInterns = interns.filter(intern => intern.tutor_id === userId);
        filteredRequests = requests.filter(request => 
          filteredInterns.some(intern => intern.id === request.intern_id)
        );
      } else if (role === 'intern' && userId) {
        const userIntern = interns.find(intern => intern.user_id === userId);
        if (userIntern) {
          filteredInterns = [userIntern];
          filteredRequests = requests.filter(request => request.intern_id === userIntern.id);
        } else {
          filteredInterns = [];
          filteredRequests = [];
        }
      }

      // Calculate basic stats
      stats.totalInterns = filteredInterns.length;
      stats.activeInterns = filteredInterns.filter(i => i.status === 'active').length;
      stats.completedInterns = filteredInterns.filter(i => i.status === 'completed').length;
      stats.upcomingInterns = filteredInterns.filter(i => i.status === 'upcoming').length;

      stats.totalRequests = filteredRequests.length;
      stats.pendingRequests = filteredRequests.filter(r => r.status === 'pending').length;
      stats.approvedRequests = filteredRequests.filter(r => r.status === 'approved').length;
      stats.rejectedRequests = filteredRequests.filter(r => r.status === 'rejected').length;

      // User statistics (only for admin/hr)
      if (!role || ['admin', 'hr'].includes(role)) {
        stats.totalUsers = users.length;
        stats.tutorCount = users.filter(u => u.role === 'tutor').length;
        stats.adminCount = users.filter(u => u.role === 'admin').length;
        stats.hrCount = users.filter(u => u.role === 'hr').length;
        stats.financeCount = users.filter(u => u.role === 'finance').length;
      }

      // Calculate average intern duration
      const completedInterns = filteredInterns.filter(i => i.status === 'completed' && i.start_date && i.end_date);
      if (completedInterns.length > 0) {
        const totalDuration = completedInterns.reduce((sum, intern) => {
          const start = new Date(intern.start_date);
          const end = new Date(intern.end_date);
          const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // days
          return sum + duration;
        }, 0);
        stats.averageInternDuration = Math.round(totalDuration / completedInterns.length);
      }

      // Calculate average evaluation score
      const internsWithScores = filteredInterns.filter(i => i.evaluation_score !== null && i.evaluation_score !== undefined);
      if (internsWithScores.length > 0) {
        const totalScore = internsWithScores.reduce((sum, intern) => sum + (intern.evaluation_score || 0), 0);
        stats.averageEvaluationScore = Math.round((totalScore / internsWithScores.length) * 100) / 100;
      }

      // Monthly internships
      const monthlyData: { [key: string]: number } = {};
      filteredInterns.forEach(intern => {
        const month = new Date(intern.start_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });
      stats.monthlyInternships = Object.entries(monthlyData)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
        .slice(-6); // Last 6 months

      // Requests by type
      const requestTypeData: { [key: string]: number } = {};
      filteredRequests.forEach(request => {
        requestTypeData[request.type] = (requestTypeData[request.type] || 0) + 1;
      });
      stats.requestsByType = Object.entries(requestTypeData)
        .map(([type, count]) => ({ type, count }));

      // Department stats
      const departmentData: { [key: string]: number } = {};
      filteredInterns.forEach(intern => {
        departmentData[intern.department] = (departmentData[intern.department] || 0) + 1;
      });
      stats.departmentStats = Object.entries(departmentData)
        .map(([department, count]) => ({ department, count }));

      // Recent activity (last 10 activities)
      const recentRequests = filteredRequests
        .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
        .slice(0, 10);
      
      stats.recentActivity = recentRequests.map(request => ({
        action: `Nouvelle demande: ${request.title}`,
        date: request.submitted_at,
        user: request.intern_id // This would need to be joined with user data
      }));

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Departments
  static async getAllDepartments() {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Settings
  static async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  static async updateSetting(key: string, value: any, description?: string) {
    const { data, error } = await supabase
      .from('settings')
      .upsert({
        key,
        value,
        description,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
