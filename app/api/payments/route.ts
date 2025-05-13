import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const month = searchParams.get('month');
  
  let query = supabase.from('payments').select('*');
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (month) {
    query = query.eq('month', month);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const paymentData = await req.json();
  
  const { data, error } = await supabase
    .from('payments')
    .insert({
      ...paymentData,
      created_at: new Date().toISOString(),
      status: paymentData.status || 'pending'
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
    .from('payments')
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