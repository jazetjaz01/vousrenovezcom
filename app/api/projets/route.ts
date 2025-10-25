// app/api/projets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    const { travaux, details, remarques, code_postal, ville } = body;

    if (!travaux || !code_postal) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

   
    const { data, error } = await supabase
      .from("projets")
      .insert([
        { travaux, details, remarques, code_postal, ville, profil_id: user.id }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ projet: data });
  } catch (err: unknown) {
    console.error("❌ /api/projets exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}
