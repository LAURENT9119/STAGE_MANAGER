
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Vérifier que les variables d'environnement Supabase sont définies
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
    return NextResponse.next();
  }

  const res = NextResponse.next();

  try {
    const supabase = createMiddlewareClient({ req, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Routes protégées
    const protectedRoutes = ['/dashboard'];
    const isProtectedRoute = protectedRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    );

    // Routes d'authentification
    const authRoutes = ['/auth/login', '/auth/register'];
    const isAuthRoute = authRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    );

    // Redirection si pas d'authentification sur route protégée
    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Redirection si déjà authentifié sur route d'auth
    if (isAuthRoute && session) {
      // Récupérer le rôle utilisateur
      try {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const role = profile?.role || 'intern';
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.redirect(new URL('/dashboard/intern', req.url));
      }
    }

  } catch (error) {
    console.error('Middleware error:', error);
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
