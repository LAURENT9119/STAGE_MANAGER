
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST() {
  try {
    // Supprimer les données de chaque table
    await supabase.from('evaluations').delete().neq('id', '');
    await supabase.from('payments').delete().neq('id', '');
    await supabase.from('documents').delete().neq('id', '');
    await supabase.from('requests').delete().neq('id', '');
    await supabase.from('stagiaires').delete().neq('id', '');
    await supabase.from('departments').delete().neq('id', '');
    await supabase.from('users').delete().neq('id', '');
    await supabase.from('settings').delete().neq('id', '');

    return NextResponse.json({ message: 'Base de données vidée avec succès' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression des données' }, { status: 500 });
  }
}
