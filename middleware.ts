
<old_str>import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Rediriger vers login si non authentifié et que la page nécessite une auth
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Si authentifié et sur une page d'auth, rediriger vers le dashboard
  if (session && (req.nextUrl.pathname.startsWith('/auth/login') || req.nextUrl.pathname.startsWith('/auth/register'))) {
    if (req.nextUrl.pathname === '/dashboard') {
      try {
        const { data: user } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (user && user.role) {
          return NextResponse.redirect(new URL(`/dashboard/${user.role}`, req.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard/intern', req.url));
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        return NextResponse.redirect(new URL('/dashboard/intern', req.url));
      }
    }
          .single();

        const role = profile?.role || 'intern';
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};</old_str>
<new_str>import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Rediriger vers login si non authentifié et que la page nécessite une auth
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Si authentifié et sur une page d'auth, rediriger vers le dashboard
  if (session && (req.nextUrl.pathname.startsWith('/auth/login') || req.nextUrl.pathname.startsWith('/auth/register'))) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (user && user.role) {
        return NextResponse.redirect(new URL(`/dashboard/${user.role}`, req.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/intern', req.url));
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return NextResponse.redirect(new URL('/dashboard/intern', req.url));
    }
  }

  // Redirection automatique pour /dashboard vers le rôle spécifique
  if (session && req.nextUrl.pathname === '/dashboard') {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (user && user.role) {
        return NextResponse.redirect(new URL(`/dashboard/${user.role}`, req.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/intern', req.url));
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return NextResponse.redirect(new URL('/dashboard/intern', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};</new_str>
