"use client";

import { cn, getRedirectUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // 🔐 Connexion email/password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non trouvé");

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = profile?.role || "particulier";

      if (role === "entreprise") {
        const { data: entreprise } = await supabase
          .from("entreprises")
          .select("profil_id")
          .eq("profil_id", user.id)
          .maybeSingle();

        router.push(entreprise ? "/dashboard/entreprise" : "/dashboard/entreprise/create");
      } else {
        router.push("/dashboard/particulier");
      }

      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔗 Connexion Google
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl("/auth/callback"),
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-6">
            {/* Connexion Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mb-4 mt-6"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                width={20}
                height={20}
              />
              {isLoading ? "Redirection..." : "Se connecter avec Google"}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              ou se connecter par email
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Mot de passe */}
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Bouton connexion */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            Vous n’avez pas encore de compte ?{" "}
            <Link href="/auth/sign-up" className="underline underline-offset-4">
              Créer un compte
            </Link>
          </div>
        </form>
      </CardContent>
    </div>
  );
}
