import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface DashboardStats {
  totalInterns: number;
  activeInterns: number;
  totalRequests: number;
  pendingRequests: number;
  monthlyInterns: { month: string; count: number }[];
  requestsByStatus: { status: string; count: number }[];
  departmentStats: { department: string; count: number }[];
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    user: string;
    timestamp: string;
  }>;
}

export interface InternData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  department: string;
  university: string;
  level: string;
  tutor_name: string;
  start_date: string;
  end_date: string;
  status: string;
  progress: number;
  evaluation_score: number;
}

export interface RequestData {
  id: string;
  intern_id: string;
  intern_name: string;
  type: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  submitted_at: string;
  reviewer_name?: string;
  reviewer_comments?: string;
}

class ProductionService {
  static async getDashboardStats(userRole: string, userId: string): Promise<DashboardStats> {
    try {
      // Statistiques de base
      const { data: allInterns } = await supabase
        .from('interns')
        .select(`
          *,
          users!inner(full_name, email),
          tutor:users!tutor_id(full_name)
        `);

      const { data: allRequests } = await supabase
        .from('requests')
        .select(`
          *,
          intern:interns!inner(
            users!inner(full_name)
          )
        `);

      const { data: recentLogs } = await supabase
        .from('activity_logs')
        .select(`
          *,
          users!inner(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculs en fonction du rôle
      let totalInterns = 0;
      let activeInterns = 0;
      let totalRequests = 0;
      let pendingRequests = 0;

      if (userRole === 'tutor') {
        const tutorInterns = allInterns?.filter(intern => intern.tutor_id === userId) || [];
        totalInterns = tutorInterns.length;
        activeInterns = tutorInterns.filter(intern => intern.status === 'active').length;

        const tutorRequests = allRequests?.filter(request => 
          tutorInterns.some(intern => intern.id === request.intern_id)
        ) || [];
        totalRequests = tutorRequests.length;
        pendingRequests = tutorRequests.filter(req => req.status === 'pending').length;
      } else {
        totalInterns = allInterns?.length || 0;
        activeInterns = allInterns?.filter(intern => intern.status === 'active').length || 0;
        totalRequests = allRequests?.length || 0;
        pendingRequests = allRequests?.filter(req => req.status === 'pending').length || 0;
      }

      // Données mensuelles
      const monthlyData = this.calculateMonthlyStats(allInterns || []);

      // Statistiques par statut
      const requestsByStatus = this.calculateRequestsByStatus(allRequests || []);

      // Statistiques par département
      const departmentStats = this.calculateDepartmentStats(allInterns || []);

      // Activité récente
      const recentActivity = (recentLogs || []).map(log => ({
        id: log.id,
        type: log.action,
        description: this.formatLogDescription(log),
        user: log.users?.full_name || 'Utilisateur inconnu',
        timestamp: log.created_at
      }));

      return {
        totalInterns,
        activeInterns,
        totalRequests,
        pendingRequests,
        monthlyInterns: monthlyData,
        requestsByStatus,
        departmentStats,
        recentActivity
      };
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      // Retourner des données par défaut en cas d'erreur
      return {
        totalInterns: 0,
        activeInterns: 0,
        totalRequests: 0,
        pendingRequests: 0,
        monthlyInterns: [],
        requestsByStatus: [],
        departmentStats: [],
        recentActivity: []
      };
    }
  }

  static async getInterns(userRole: string, userId: string): Promise<InternData[]> {
    try {
      let query = supabase
        .from('interns')
        .select(`
          *,
          users!inner(full_name, email),
          tutor:users!tutor_id(full_name)
        `);

      if (userRole === 'tutor') {
        query = query.eq('tutor_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(intern => ({
        id: intern.id,
        user_id: intern.user_id,
        full_name: intern.users?.full_name || '',
        email: intern.users?.email || '',
        department: intern.department || '',
        university: intern.university || '',
        level: intern.level || '',
        tutor_name: intern.tutor?.full_name || '',
        start_date: intern.start_date || '',
        end_date: intern.end_date || '',
        status: intern.status || 'active',
        progress: intern.progress || 0,
        evaluation_score: intern.evaluation_score || 0
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des stagiaires:', error);
      return [];
    }
  }

  static async getRequests(userRole: string, userId: string): Promise<RequestData[]> {
    try {
      let query = supabase
        .from('requests')
        .select(`
          *,
          intern:interns!inner(
            users!inner(full_name)
          ),
          reviewer:users!reviewer_id(full_name)
        `);

      if (userRole === 'tutor') {
        // Pour les tuteurs, récupérer seulement les demandes de leurs stagiaires
        const { data: tutorInterns } = await supabase
          .from('interns')
          .select('id')
          .eq('tutor_id', userId);

        const internIds = tutorInterns?.map(intern => intern.id) || [];
        if (internIds.length > 0) {
          query = query.in('intern_id', internIds);
        } else {
          return [];
        }
      } else if (userRole === 'intern') {
        // Pour les stagiaires, récupérer seulement leurs propres demandes
        const { data: internProfile } = await supabase
          .from('interns')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (internProfile) {
          query = query.eq('intern_id', internProfile.id);
        } else {
          return [];
        }
      }

      const { data, error } = await query.order('submitted_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(request => ({
        id: request.id,
        intern_id: request.intern_id,
        intern_name: request.intern?.users?.full_name || '',
        type: request.type || '',
        title: request.title || '',
        description: request.description || '',
        status: request.status || 'pending',
        priority: request.priority || 'normal',
        submitted_at: request.submitted_at || '',
        reviewer_name: request.reviewer?.full_name,
        reviewer_comments: request.reviewer_comments
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
      return [];
    }
  }

  private static calculateMonthlyStats(interns: any[]) {
    const monthCounts: { [key: string]: number } = {};
    const currentDate = new Date();

    // Initialiser les 12 derniers mois
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      monthCounts[monthKey] = 0;
    }

    // Compter les stagiaires par mois de début
    interns.forEach(intern => {
      if (intern.start_date) {
        const startDate = new Date(intern.start_date);
        const monthKey = startDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        if (monthCounts.hasOwnProperty(monthKey)) {
          monthCounts[monthKey]++;
        }
      }
    });

    return Object.entries(monthCounts).map(([month, count]) => ({ month, count }));
  }

  private static calculateRequestsByStatus(requests: any[]) {
    const statusCounts: { [key: string]: number } = {
      pending: 0,
      approved: 0,
      rejected: 0
    };

    requests.forEach(request => {
      if (statusCounts.hasOwnProperty(request.status)) {
        statusCounts[request.status]++;
      }
    });

    return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  }

  private static calculateDepartmentStats(interns: any[]) {
    const deptCounts: { [key: string]: number } = {};

    interns.forEach(intern => {
      const dept = intern.department || 'Non défini';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    return Object.entries(deptCounts).map(([department, count]) => ({ department, count }));
  }

  private static formatLogDescription(log: any): string {
    switch (log.action) {
      case 'LOGIN':
        return 'Connexion à la plateforme';
      case 'CREATE_REQUEST':
        return 'Nouvelle demande créée';
      case 'APPROVE_REQUEST':
        return 'Demande approuvée';
      case 'REJECT_REQUEST':
        return 'Demande rejetée';
      case 'UPDATE_PROFILE':
        return 'Profil mis à jour';
      default:
        return log.action.replace('_', ' ').toLowerCase();
    }
  }
}

export { ProductionService };