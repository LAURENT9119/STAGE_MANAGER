
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.json();
  const supabase = createRouteHandlerClient({ cookies });
  
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
        role: formData.role,
      },
    },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // Créer le profil utilisateur
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .insert({
      id: authData.user!.id,
      email: formData.email,
      name: formData.name,
      role: formData.role,
      department: formData.department,
      position: formData.position,
      phone: formData.phone,
    })
    .select()
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ user: profile });
}
