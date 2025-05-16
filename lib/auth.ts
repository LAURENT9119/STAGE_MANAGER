'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from './supabase';
import { UserDTO } from './dtos/user.dto';

export const supabase = createClientComponentClient<Database>();

export async function getCurrentUser(): Promise<UserDTO | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  // Set session cookie
  const cookieStore = cookies();
  cookieStore.set('session', data.session?.access_token || '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;

  // Clear session cookie
  const cookieStore = cookies();
  cookieStore.delete('session');
}

export async function getDashboardStats(role: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  switch (role) {
    case 'RH':
      const { data: activeInterns } = await supabase
        .from('interns')
        .select('*')
        .eq('status', 'active');

      const { data: pendingRequests } = await supabase
        .from('requests')
        .select('*')
        .eq('status', 'pending');

      const { data: monthlyConventions } = await supabase
        .from('requests')
        .select('*')
        .eq('type', 'convention')
        .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

      const { data: evaluations } = await supabase
        .from('evaluations')
        .select('*');

      return {
        totalInterns: activeInterns?.length || 0,
        pendingRequests: pendingRequests?.length || 0,
        monthlyConventions: monthlyConventions?.length || 0,
        evaluationRate: evaluations?.length ?
          Math.round((evaluations.filter(e => e.status === 'completed').length / evaluations.length) * 100) : 0
      };

    case 'tuteur':
      const { data: tutorInterns } = await supabase
        .from('interns')
        .select('*')
        .eq('tutor_id', currentUser.id);

      const { data: tutorRequests } = await supabase
        .from('requests')
        .select('*')
        .eq('status', 'pending')
        .eq('tutor_id', currentUser.id);

      return {
        activeInterns: tutorInterns?.length || 0,
        pendingRequests: tutorRequests?.length || 0
      };

    case 'finance':
      const { data: payments } = await supabase
        .from('payments')
        .select('*');

      return {
        totalAmount: payments?.reduce((sum, p) => sum + p.amount, 0) || 0,
        pendingPayments: payments?.filter(p => p.status === 'pending').length || 0
      };

    default:
      return null;
  }
}

export async function getRecentActivity(role: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

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
    query = query.eq('tutor_id', currentUser.id);
  } else if (role === 'intern') {
    query = query.eq('intern_id', currentUser.id);
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
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  const alerts = [];

  if (role === 'hr') {
    // Conventions à signer
    const { data: pendingConventions } = await supabase
      .from('requests')
      .select('*')
      .eq('type', 'convention')
      .eq('status', 'pending');

    if (pendingConventions && pendingConventions.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Conventions à signer',
        message: `${pendingConventions.length} conventions nécessitent votre signature.`
      });
    }

    // Campagne de recrutement
    const today = new Date();
    if (today.getMonth() === 4 && today.getDate() > 10) { // Mai
      alerts.push({
        type: 'info',
        title: 'Campagne de recrutement',
        message: 'La campagne de recrutement des stagiaires d\'été commence bientôt.'
      });
    }
  }

  return alerts;
}