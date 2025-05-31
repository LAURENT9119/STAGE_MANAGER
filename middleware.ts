
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("Supabase environment variables not found");
      }
      return NextResponse.next();
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get session from cookies
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { pathname } = req.nextUrl;

    // Dashboard routes protection
    if (pathname.startsWith("/dashboard")) {
      if (!session) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      // Verify user exists in database
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!userData) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      const userRole = userData.role;

      // Role-based route protection
      const roleRoutes = {
        admin: ["/dashboard/admin"],
        hr: ["/dashboard/hr"],
        finance: ["/dashboard/finance"],
        tutor: ["/dashboard/tutor"],
        intern: ["/dashboard/intern"]
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
    if ((pathname.startsWith("/auth") || pathname === "/") && session) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userData) {
        return NextResponse.redirect(new URL(`/dashboard/${userData.role}`, req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Middleware error:", error);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/"
  ],
};
