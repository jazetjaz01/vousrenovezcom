"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Récupère la session active
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.replace("/auth/login");
          return;
        }

        const user = session.user;
        const roleFromUrl = searchParams.get("role");

        // Vérifie si le profil existe déjà
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profils")
          .select("id, role")
          .eq("id", user.id)
          .maybeSingle();

        let finalRole = existingProfile?.role || roleFromUrl || "particulier";

        // Si le profil n’existe pas → création
        if (!existingProfile) {
          const { error: insertError } = await supabase.from("profils").insert({
            id: user.id,
            role: finalRole,
            full_name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split("@")[0] ||
              "Utilisateur",
          });

          if (insertError) console.error("Erreur lors de l’insertion du profil :", insertError);
        } else if (roleFromUrl && existingProfile.role !== roleFromUrl) {
          // Si le profil existe mais avec un rôle différent → mise à jour
          const { error: updateError } = await supabase
            .from("profils")
            .update({ role: roleFromUrl })
            .eq("id", user.id);

          if (updateError) console.error("Erreur lors de la mise à jour du rôle :", updateError);
          finalRole = roleFromUrl;
        }

        // Redirection selon le rôle
        if (finalRole === "entreprise") {
          const { data: entreprise } = await supabase
            .from("entreprises")
            .select("profil_id")
            .eq("profil_id", user.id)
            .maybeSingle();

          router.replace(entreprise ? "/dashboard/entreprise" : "/dashboard/entreprise/create");
        } else {
          router.replace("/dashboard/particulier");
        }
      } catch (error) {
        console.error("Erreur callback auth:", error);
        router.replace("/auth/login");
      }
    };

    handleAuthCallback();
  }, [router, supabase, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      <p>Redirection en cours...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          <p>Chargement...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
