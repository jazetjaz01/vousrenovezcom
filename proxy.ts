// proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "./lib/utils";

// Liste des routes accessibles sans authentification
const PUBLIC_ROUTES = ["/", "/actualite", "/contact", "/auth", "/login"];

// Liste des routes nécessitant une authentification
const PROTECTED_ROUTES = ["/chatbox", "/dashboard", "/profil"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!hasEnvVars) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  const isPublic = PUBLIC_ROUTES.some((path) => pathname.startsWith(path));
  const isProtected = PROTECTED_ROUTES.some((path) => pathname.startsWith(path));

  // Redirige uniquement si l'utilisateur n'est pas connecté et qu'on est sur une route protégée
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return response;
}
