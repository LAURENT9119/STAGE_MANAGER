import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  
  try {
    switch(type) {
      case 'interns': {
        const { count } = await supabase
          .from('interns')
          .select('*', { count: 'exact' });
        return NextResponse.json({ count });
      }
      
      case 'payments': {
        const { data } = await supabase
          .from('payments')
          .select('amount');
        const total = data?.reduce((sum, payment) => sum + payment.amount, 0);
        return NextResponse.json({ total });
      }
      
      case 'requests': {
        const { data } = await supabase
          .from('requests')
          .select('status');
        const pending = data?.filter(req => req.status === 'pending').length;
        return NextResponse.json({ pending });
      }
      
      default:
        return NextResponse.json({ error: 'Invalid stat type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}