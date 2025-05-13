import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const internId = searchParams.get('internId');
  const tutorId = searchParams.get('tutorId');
  
  let query = supabase.from('assignments').select('*');
  
  if (internId) {
    query = query.eq('intern_id', internId);
  }
  
  if (tutorId) {
    query = query.eq('tutor_id', tutorId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const assignmentData = await req.json();
  
  const { data, error } = await supabase
    .from('assignments')
    .insert({
      ...assignmentData,
      created_at: new Date().toISOString(),
      status: 'active'
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  
  const { data, error } = await supabase
    .from('assignments')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}