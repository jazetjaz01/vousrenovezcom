// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    // Récupération des données JSON envoyées
    const { firstName, lastName, email, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    // Création du transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Envoi de l’email
    await transporter.sendMail({
      from: `"Formulaire VousRenovez" <${process.env.SMTP_USER}>`,
      to: "contact@vousrenovez.com",
      replyTo: email,
      subject: `📩 Nouveau message de ${firstName} ${lastName}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Nouveau message reçu via le site VousRenovez</h2>
          <p><strong>Nom :</strong> ${firstName} ${lastName}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

    // Réponse OK
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi mail:", error);
    return NextResponse.json(
      { error: "Impossible d’envoyer le mail" },
      { status: 500 }
    );
  }
}
