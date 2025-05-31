import { createMiddlewareClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  try {
    // Vérification des variables d'environnement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase environment variables not found");
      return res;
    }

    const supabase = createMiddlewareClient({
      supabaseUrl,
      supabaseKey,
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Protect all dashboard routes
    if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return res;
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};