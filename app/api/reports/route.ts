import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const period = searchParams.get('period');
  
  let query = supabase.from('reports').select('*');
  
  if (type) {
    query = query.eq('type', type);
  }
  
  if (period) {
    query = query.eq('period', period);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const reportData = await req.json();
  
  const { data, error } = await supabase
    .from('reports')
    .insert({
      ...reportData,
      created_at: new Date().toISOString()
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}