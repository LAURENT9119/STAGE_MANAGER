
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Variables d\'environnement Supabase manquantes:');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'DÉFINIE' : 'MANQUANTE');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'DÉFINIE' : 'MANQUANTE');
    throw new Error('Variables d\'environnement Supabase manquantes');
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
};
