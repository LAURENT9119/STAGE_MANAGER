import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './supabase';

export const supabase = createClientComponentClient<Database>();

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function getDashboardStats(role: string) {
  switch (role) {
    case 'hr':
      const { data: interns } = await supabase
        .from('interns')
        .select('*', { count: 'exact' });

      const { data: requests } = await supabase
        .from('requests')
        .select('*')
        .eq('status', 'pending');

      const { data: conventions } = await supabase
        .from('requests')
        .select('*')
        .eq('type', 'convention')
        .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

      const { data: evaluations } = await supabase
        .from('evaluations')
        .select('*');

      const totalEvaluations = evaluations?.length || 0;
      const completedEvaluations = evaluations?.filter(e => e.score !== null).length || 0;
      const completionRate = totalEvaluations > 0 
        ? Math.round((completedEvaluations / totalEvaluations) * 100) 
        : 0;

      return {
        totalInterns: interns?.length || 0,
        pendingRequests: requests?.length || 0,
        monthlyConventions: conventions?.length || 0,
        evaluationRate: completionRate
      };

    case 'tutor':
      const { data: tutorInterns } = await supabase
        .from('interns')
        .select('*')
        .eq('tutor_id', (await getCurrentUser())?.id);

      const { data: tutorRequests } = await supabase
        .from('requests')
        .select('*')
        .eq('status', 'pending')
        .in('intern_id', tutorInterns?.map(i => i.id) || []);

      return {
        activeInterns: tutorInterns?.length || 0,
        pendingRequests: tutorRequests?.length || 0
      };

    case 'finance':
      const { data: payments } = await supabase
        .from('payments')
        .select('amount');

      const totalAmount = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

      const { data: pendingPayments } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'pending');

      return {
        totalAmount,
        pendingPayments: pendingPayments?.length || 0
      };

    case 'admin':
      const { data: users } = await supabase
        .from('users')
        .select('*', { count: 'exact' });

      const { data: activeInterns } = await supabase
        .from('interns')
        .select('*')
        .eq('status', 'active');

      const { data: tutors } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'tutor');

      return {
        totalUsers: users?.length || 0,
        activeInterns: activeInterns?.length || 0,
        totalTutors: tutors?.length || 0
      };

    default:
      return null;
  }
}

export async function getRecentActivity(role: string) {
  const user = await getCurrentUser();
  if (!user) return [];

  let query = supabase
    .from('requests')
    .select(`
      *,
      intern:interns(
        user:users(name, email)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (role === 'tutor') {
    query = query.eq('tutor_id', user.id);
  } else if (role === 'intern') {
    query = query.eq('intern_id', user.id);
  }

  const { data: activities } = await query;

  return activities?.map(activity => ({
    date: new Date(activity.created_at).toLocaleDateString('fr-FR'),
    type: activity.type,
    status: activity.status,
    details: `${activity.intern.user.name} - ${activity.title}`
  })) || [];
}

export async function getAlerts(role: string) {
  const user = await getCurrentUser();
  if (!user) return [];

  const alerts = [];

  if (role === 'hr') {
    // Check for expiring conventions
    const { data: expiringConventions } = await supabase
      .from('interns')
      .select('*')
      .lt('end_date', new Date(new Date().setDate(new Date().getDate() + 30)).toISOString())
      .gt('end_date', new Date().toISOString());

    if (expiringConventions && expiringConventions.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Conventions à renouveler',
        message: `${expiringConventions.length} conventions arrivent à échéance dans les 30 prochains jours.`
      });
    }

    // Check for pending evaluations
    const { data: pendingEvaluations } = await supabase
      .from('evaluations')
      .select('*')
      .is('score', null);

    if (pendingEvaluations && pendingEvaluations.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Évaluations en retard',
        message: `${pendingEvaluations.length} évaluations de fin de stage sont en attente.`
      });
    }
  }

  if (role === 'tutor') {
    // Check for pending evaluations
    const { data: pendingEvaluations } = await supabase
      .from('evaluations')
      .select('*')
      .eq('tutor_id', user.id)
      .is('score', null);

    if (pendingEvaluations && pendingEvaluations.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Évaluations en retard',
        message: `${pendingEvaluations.length} évaluations n'ont pas été complétées dans les délais prévus.`
      });
    }
  }

  return alerts;
}