import { createClient } from '@/lib/supabase/client';

export class ProductionService {
  private static supabase = createClient();

  // Statistiques du dashboard basées sur le rôle
  static async getDashboardStats(userId: string, userRole: string) {
    try {
      const stats: any = {};

      switch (userRole) {
        case 'admin':
          // Admin voit toutes les statistiques
          const [internsResult, requestsResult, usersResult] = await Promise.all([
            this.supabase.from('interns').select('id, status, start_date, end_date'),
            this.supabase.from('requests').select('id, status, type, submitted_at'),
            this.supabase.from('users').select('id, role, created_at')
          ]);

          const interns = internsResult.data || [];
          const requests = requestsResult.data || [];
          const users = usersResult.data || [];

          stats.totalInterns = interns.length;
          stats.activeInterns = interns.filter(i => i.status === 'active').length;
          stats.pendingRequests = requests.filter(r => r.status === 'pending').length;
          stats.totalUsers = users.length;
          stats.usersByRole = this.groupByRole(users);
          stats.internsByStatus = this.groupByStatus(interns);
          stats.requestsByType = this.groupByType(requests);
          stats.monthlyInterns = this.groupByMonth(interns);
          break;

        case 'hr':
          // RH voit les stagiaires et demandes
          const [hrInternsResult, hrRequestsResult] = await Promise.all([
            this.supabase.from('interns').select('id, status, start_date, end_date'),
            this.supabase.from('requests').select('id, status, type, submitted_at')
          ]);

          const hrInterns = hrInternsResult.data || [];
          const hrRequests = hrRequestsResult.data || [];

          stats.totalInterns = hrInterns.length;
          stats.activeInterns = hrInterns.filter(i => i.status === 'active').length;
          stats.pendingRequests = hrRequests.filter(r => r.status === 'pending').length;
          stats.internsByStatus = this.groupByStatus(hrInterns);
          stats.requestsByType = this.groupByType(hrRequests);
          break;

        case 'tutor':
          // Tuteur voit ses stagiaires
          const tutorInternsResult = await this.supabase
            .from('interns')
            .select('id, status, start_date, end_date, user:users(*)')
            .eq('tutor_id', userId);

          const tutorInterns = tutorInternsResult.data || [];
          const tutorRequestsResult = await this.supabase
            .from('requests')
            .select('id, status, type, submitted_at')
            .in('intern_id', tutorInterns.map(i => i.id));

          const tutorRequests = tutorRequestsResult.data || [];

          stats.myInterns = tutorInterns.length;
          stats.activeInterns = tutorInterns.filter(i => i.status === 'active').length;
          stats.pendingRequests = tutorRequests.filter(r => r.status === 'pending').length;
          stats.internsByStatus = this.groupByStatus(tutorInterns);
          stats.requestsByType = this.groupByType(tutorRequests);
          break;

        case 'intern':
          // Stagiaire voit ses propres données
          const internProfileResult = await this.supabase
            .from('interns')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (internProfileResult.data) {
            const internId = internProfileResult.data.id;
            const myRequestsResult = await this.supabase
              .from('requests')
              .select('id, status, type, submitted_at')
              .eq('intern_id', internId);

            const myRequests = myRequestsResult.data || [];

            stats.myProgress = internProfileResult.data.progress || 0;
            stats.myRequests = myRequests.length;
            stats.pendingRequests = myRequests.filter(r => r.status === 'pending').length;
            stats.approvedRequests = myRequests.filter(r => r.status === 'approved').length;
            stats.requestsByType = this.groupByType(myRequests);
            stats.contractInfo = {
              startDate: internProfileResult.data.start_date,
              endDate: internProfileResult.data.end_date,
              status: internProfileResult.data.status,
              department: internProfileResult.data.department
            };
          }
          break;

        case 'finance':
          // Finance voit les données financières
          const financeRequestsResult = await this.supabase
            .from('requests')
            .select('id, status, type, submitted_at')
            .in('type', ['convention', 'attestation']);

          const financeRequests = financeRequestsResult.data || [];

          stats.conventionRequests = financeRequests.filter(r => r.type === 'convention').length;
          stats.attestationRequests = financeRequests.filter(r => r.type === 'attestation').length;
          stats.pendingFinanceRequests = financeRequests.filter(r => r.status === 'pending').length;
          break;
      }

      return { data: stats, error: null };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return { data: null, error };
    }
  }

  // Méthodes utilitaires pour regrouper les données
  private static groupByRole(users: any[]) {
    return users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
  }

  private static groupByStatus(interns: any[]) {
    return interns.reduce((acc, intern) => {
      acc[intern.status] = (acc[intern.status] || 0) + 1;
      return acc;
    }, {});
  }

  private static groupByType(requests: any[]) {
    return requests.reduce((acc, request) => {
      acc[request.type] = (acc[request.type] || 0) + 1;
      return acc;
    }, {});
  }

  private static groupByMonth(interns: any[]) {
    const monthCounts: { [key: string]: number } = {};
    const now = new Date();

    // Derniers 6 mois
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM
      monthCounts[monthKey] = 0;
    }

    interns.forEach(intern => {
      const startDate = new Date(intern.start_date);
      const monthKey = startDate.toISOString().substring(0, 7);
      if (monthCounts.hasOwnProperty(monthKey)) {
        monthCounts[monthKey]++;
      }
    });

    return monthCounts;
  }

  // Récupérer les données spécifiques à l'utilisateur
  static async getUserSpecificData(userId: string, userRole: string) {
    try {
      const data: any = {};

      switch (userRole) {
        case 'intern':
          // Profil du stagiaire
          const internResult = await this.supabase
            .from('interns')
            .select(`
              *,
              tutor:users!interns_tutor_id_fkey(full_name, email)
            `)
            .eq('user_id', userId)
            .single();

          if (internResult.data) {
            data.internProfile = internResult.data;

            // Ses demandes
            const requestsResult = await this.supabase
              .from('requests')
              .select('*')
              .eq('intern_id', internResult.data.id)
              .order('created_at', { ascending: false });

            data.requests = requestsResult.data || [];
          }
          break;

        case 'tutor':
          // Stagiaires du tuteur
          const tutorInternsResult = await this.supabase
            .from('interns')
            .select(`
              *,
              user:users(full_name, email)
            `)
            .eq('tutor_id', userId);

          data.myInterns = tutorInternsResult.data || [];
          break;

        case 'hr':
        case 'admin':
          // Tous les stagiaires et demandes
          const allInternsResult = await this.supabase
            .from('interns')
            .select(`
              *,
              user:users(full_name, email),
              tutor:users!interns_tutor_id_fkey(full_name, email)
            `);

          const allRequestsResult = await this.supabase
            .from('requests')
            .select(`
              *,
              intern:interns(
                *,
                user:users(full_name, email)
              )
            `)
            .order('created_at', { ascending: false });

          data.allInterns = allInternsResult.data || [];
          data.allRequests = allRequestsResult.data || [];
          break;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      return { data: null, error };
    }
  }
}