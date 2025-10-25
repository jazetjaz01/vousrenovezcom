"use client";

import { cn, getRedirectUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState<"particulier" | "entreprise">("particulier");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const supabase = createClient();

  // 🔹 Inscription email/password
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectUrl(`/auth/callback?role=${role}`),
        },
      });
      if (error) throw error;

      // 🔹 Création / mise à jour du profil
      if (data.user) {
        const { error: upsertError } = await supabase
          .from("profils")
          .update({
            role,
            full_name:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              "Utilisateur",
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.user.id);

        if (upsertError) {
          await supabase.from("profils").insert({
            id: data.user.id,
            role,
            full_name:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              "Utilisateur",
          });
        }
      }

      router.push("/auth/sign-up-success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Inscription via Google
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl(`/auth/callback?role=${role}`),
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>
            Inscrivez-vous en tant que particulier ou entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              {/* 🔹 Choix du rôle */}
              <div className="grid gap-2">
                <Label>Vous êtes :</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="particulier"
                      checked={role === "particulier"}
                      onChange={(e) =>
                        setRole(e.target.value as "particulier" | "entreprise")
                      }
                    />
                    Particulier
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="entreprise"
                      checked={role === "entreprise"}
                      onChange={(e) =>
                        setRole(e.target.value as "particulier" | "entreprise")
                      }
                    />
                    Entreprise
                  </label>
                </div>
              </div>

              {/* 🔹 Google signup */}
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading}
                onClick={handleGoogleSignUp}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
                {isLoading ? "Redirection..." : "S’inscrire avec Google"}
              </Button>

              <div className="text-center text-xs text-muted-foreground">ou</div>

              {/* 🔹 Email/password */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

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

              <div className="grid gap-2">
                <Label htmlFor="repeat-password">Confirmez le mot de passe</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création du compte..." : "S’inscrire"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Vous avez déjà un compte ?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
