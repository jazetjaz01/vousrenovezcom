// app/api/chat/route.ts
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export const maxDuration = 30;

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const TRAVAUX_AUTORISES = [
  "architecte","architecte d'intérieur","bardage","carrelage","chauffage","charpente",
  "charpentier","chape liquide","climatisation","construction maison","cuisine équipée",
  "decorateur","diagnostics immobiliers","élagueur","électricité","placo","fenêtres",
  "isolation","jardin paysager","jardinier","maçonnerie","menuiserie","mobilier sur mesure",
  "parquet","piscine","plomberie","portes","peinture","ramonage","revêtement de sol",
  "rénovation","salle de bain","serrurier","terrasse","toiture","escaliers","plafond",
  "cave à vin","chauffe-eau","pompe à chaleur","pose de véranda","pose de pergola","garde-corps",
  "pose de clôture","pose de portail","pose de carport","isolation phonique","pose de faux plafond",
  "pose de moulures",
] as const;

const SYSTEM_PROMPT = `
Tu es un assistant expert pour créer un projet de travaux pour les utilisateurs de Vousrenovez.com.

Guidelines importantes :
1. Le champ "travaux" correspond au **type général de travaux** (ex : "peinture", "pose carrelage").  
   - Préfère utiliser la liste suivante si possible : ${TRAVAUX_AUTORISES.join(", ")}.  
   - Si le projet ne correspond à aucun item de la liste, accepte exactement le texte fourni par l'utilisateur.
2. Le champ "details" correspond aux **détails précis du projet** (ex : "peindre les murs jaunes en blanc").  
3. Le champ "remarques" contient des observations ou contraintes particulières, comme le calendrier, la configuration du chantier ou l'accessibilité.
4. Les champs "code_postal" et "ville" sont obligatoires.
5. Une fois toutes les informations obligatoires collectées, fais un résumé complet et clair de la demande.
6. Demande ensuite **confirmation explicite de l'utilisateur** avant de générer le JSON final.
7. Remercie l'utilisateur d'avoir utilisé Vousrenovez.com.
8. Informe l'utilisateur que sa demande sera enregistrée et visible dans son espace profil après confirmation.
9. Les questions doivent être posées unes à unes 

Règles pour générer le JSON final :
- NE JAMAIS générer [DONE] tant que tous les champs obligatoires ("travaux", "details", "code_postal", "ville") ne sont pas remplis.
- Pose systématiquement les questions nécessaires pour obtenir toutes les informations manquantes.
- Lorsque tous les champs obligatoires sont renseignés et que l'utilisateur confirme l'envoi, génère **exactement** ce JSON suivi du signal [DONE] :

[DONE]{
  "travaux": "...",
  "details": "...",
  "remarques": "...",
  "code_postal": "...",
  "ville": "..."
}

- Respecte strictement le format JSON, sans ajouter ni omettre de champ obligatoire.
- Le champ "details" doit toujours être rempli (jamais vide).
- Toujours distinguer clairement "travaux" (type général) et "details" (détails précis).
- Utilise des exemples concrets dans tes questions pour guider l'utilisateur et éviter toute confusion.
- Accepte sans avertissement tout texte libre pour le champ "travaux" si le projet de l'utilisateur ne correspond pas à la liste.
`;



export async function POST(req: Request) {
  try {
    const { messages, model, webSearch }: { messages: UIMessage[]; model: string; webSearch: boolean } = await req.json();

    // Ajout du message system
    const systemMessage: UIMessage = {
      id: "system-prompt",
      role: "system",
      parts: [{ type: "text", text: SYSTEM_PROMPT }],
    };

    const messagesWithSystem = [systemMessage, ...messages];

    // --- Streaming du texte via OpenAI ---
    const result = streamText({
      model: webSearch ? "perplexity/sonar" : openai.chat(model),
      messages: convertToModelMessages(messagesWithSystem),
    });

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (err: unknown) {
    console.error("❌ Erreur route /api/chat :", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Erreur inconnue" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
