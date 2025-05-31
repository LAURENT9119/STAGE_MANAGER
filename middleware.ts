
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    // Vérification des variables d'environnement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase environment variables not found");
      return NextResponse.next();
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer la session depuis les cookies
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Protection des routes dashboard
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!session) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      // Vérifier que l'utilisateur existe dans la table users
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!userData) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      // Vérification des rôles pour les routes spécifiques
      const pathname = req.nextUrl.pathname;
      const userRole = userData.role;

      // Routes admin
      if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url));
      }

      // Routes HR
      if (pathname.startsWith("/dashboard/hr") && userRole !== "hr" && userRole !== "admin") {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url));
      }

      // Routes finance
      if (pathname.startsWith("/dashboard/finance") && userRole !== "finance" && userRole !== "admin") {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url));
      }

      // Routes tutor
      if (pathname.startsWith("/dashboard/tutor") && userRole !== "tutor" && userRole !== "admin") {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url));
      }

      // Routes intern
      if (pathname.startsWith("/dashboard/intern") && userRole !== "intern" && userRole !== "admin") {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url));
      }
    }

    // Redirection vers dashboard si déjà connecté et sur page auth
    if ((req.nextUrl.pathname.startsWith("/auth") || req.nextUrl.pathname === "/") && session) {
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
    console.error("Middleware error:", error);
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
