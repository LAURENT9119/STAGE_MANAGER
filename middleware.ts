
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
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
    return NextResponse.redirect(new URL('/dashboard/intern', req.url));
  }

  // Vérification des rôles pour les routes dashboard spécifiques
  if (session && req.nextUrl.pathname.startsWith('/dashboard/')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const roleFromPath = req.nextUrl.pathname.split('/')[2];
    
    if (profile?.role && roleFromPath !== profile.role && roleFromPath !== 'intern') {
      return NextResponse.redirect(new URL(`/dashboard/${profile.role}`, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
