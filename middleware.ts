
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

    // Protection des routes dashboard (rediriger si non connecté)
    if (pathname.startsWith('/dashboard') && !user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Vérification du rôle pour les routes dashboard avec rôle spécifique
    if (pathname.startsWith('/dashboard/') && user) {
      const pathSegments = pathname.split('/');
      if (pathSegments.length >= 3 && pathSegments[2] !== 'undefined') {
        const requestedRole = pathSegments[2];
        
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (userData && userData.role !== requestedRole) {
            return NextResponse.redirect(new URL(`/dashboard/${userData.role}`, req.url));
          }
        } catch (error) {
          // En cas d'erreur, rediriger vers login
          return NextResponse.redirect(new URL('/auth/login', req.url));
        }
      }
    }

    // Protection des routes auth (rediriger si déjà connecté)
    if (pathname.startsWith('/auth') && user) {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userData) {
          return NextResponse.redirect(new URL(`/dashboard/${userData.role}`, req.url));
        }
      } catch (error) {
        // En cas d'erreur, permettre l'accès aux pages auth
        return response;
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return response;
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
  runtime: 'experimental-edge',
};
