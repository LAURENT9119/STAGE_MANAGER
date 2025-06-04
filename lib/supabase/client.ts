
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Variables d\'environnement Supabase manquantes:');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'DÉFINIE' : 'MANQUANTE');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'DÉFINIE' : 'MANQUANTE');
    
    // Retourner un client mock en cas d'erreur pour éviter les crashes
    return {
      from: () => ({
        select: () => ({ data: null, error: { message: 'Configuration Supabase manquante' } }),
        insert: () => ({ data: null, error: { message: 'Configuration Supabase manquante' } }),
        update: () => ({ data: null, error: { message: 'Configuration Supabase manquante' } }),
        delete: () => ({ data: null, error: { message: 'Configuration Supabase manquante' } })
      }),
      auth: {
        getUser: () => ({ data: { user: null }, error: { message: 'Configuration Supabase manquante' } }),
        getSession: () => ({ data: { session: null }, error: null }),
        signInWithPassword: () => ({ data: null, error: { message: 'Configuration Supabase manquante' } }),
        signOut: () => ({ error: { message: 'Configuration Supabase manquante' } })
      }
    } as any;
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Content-Type': 'application/json',
          },
        });
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 2
      }
    }
  });
};
