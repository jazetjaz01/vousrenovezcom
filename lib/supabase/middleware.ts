// app/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

// Liste des routes accessibles sans authentification
const PUBLIC_ROUTES = ["/", "/actualite", "/contact", "/about"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!hasEnvVars) {
    // Si les variables d'environnement ne sont pas configurées, on skip
    return response;
  }

  // Création du client Supabase SSR
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
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Récupération des claims de l'utilisateur connecté
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Vérification des routes publiques
  const isPublicRoute = PUBLIC_ROUTES.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!user && !isPublicRoute) {
    // Utilisateur non connecté sur une route protégée → redirection
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return response;
}
