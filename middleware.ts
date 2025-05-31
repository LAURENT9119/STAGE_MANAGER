import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const pathname = req.nextUrl.pathname;

    // Redirection pour la page d'accueil
    if (pathname === '/') {
      if (user) {
        // Si l'utilisateur est connecté, récupérer son rôle depuis la base de données
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userData) {
          return NextResponse.redirect(new URL(`/dashboard/${userData.role}`, req.url));
        }
      } else {
        // Si l'utilisateur n'est pas connecté, rediriger vers login
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
    }

    // Protection des routes dashboard
    if (pathname.startsWith('/dashboard')) {
      if (!user) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }

      // Vérifier le rôle pour les routes spécifiques
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData) {
        const userRole = userData.role;
        const requestedRole = pathname.split('/')[2]; // Extraire le rôle de l'URL

        // Si l'utilisateur accède à /dashboard/[role] mais que ce n'est pas son rôle
        if (requestedRole && requestedRole !== userRole && pathname !== `/dashboard/${userRole}`) {
          return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url));
        }
      }
    }

    // Protection des routes auth (rediriger si déjà connecté)
    if (pathname.startsWith('/auth') && user) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    // Protected routes
    const protectedRoutes = ['/dashboard'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Redirect unauthenticated users to login
    if (isProtectedRoute && !user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Role-based access control
    if (user && isProtectedRoute) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      const userRole = userData?.role;

      const roleRoutes = {
        admin: ['/dashboard/admin'],
        hr: ['/dashboard/hr'],
        tutor: ['/dashboard/tutor'],
        intern: ['/dashboard/intern'],
        finance: ['/dashboard/finance']
      };

      // Check if user is trying to access unauthorized routes
      for (const [role, routes] of Object.entries(roleRoutes)) {
        for (const route of routes) {
          if (pathname.startsWith(route) && userRole !== role && userRole !== "admin") {
            return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url));
          }
        }
      }
    }

    // Redirect authenticated users away from auth pages
    if ((pathname.startsWith("/auth") || pathname === "/") && user) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData) {
        return NextResponse.redirect(new URL(`/dashboard/${userData.role}`, req.url));
      }
    }

    return response;
  } catch (error) {
    // Silent fail in production
    return response;
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/"
  ],
};