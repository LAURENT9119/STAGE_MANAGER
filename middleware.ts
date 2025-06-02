import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Pages publiques qui ne nécessitent pas d'authentification
  const publicPaths = ['/', '/auth/login', '/auth/register', '/contact', '/privacy', '/terms'];
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname === path);

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!session && !isPublicPath && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
  if (session && (req.nextUrl.pathname === '/auth/login' || req.nextUrl.pathname === '/auth/register')) {
    // Récupérer le rôle de l'utilisateur
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const userRole = userData?.role || 'intern';
    return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};