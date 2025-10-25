"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "./textarea";
import { MailIcon, MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react";
import Link from "next/link";

const Contact02Page = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur lors de l’envoi");

      setSuccess(true);
      form.reset();
    } catch (err) {
      setError("Impossible d’envoyer le message. Réessaie plus tard.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 bg-white pr-6 pl-6">
      <div className="w-full max-w-(--breakpoint-xl) mx-auto px-6 xl:px-0">
        <b className="text-muted-foreground uppercase font-semibold text-sm">
          Contact
        </b>
        <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
          Nous contacter directement
        </h2>
        <p className="mt-3 text-base sm:text-lg text-muted-foreground">
          Nous sommes disponibles pour vous répondre directement
        </p>

        <div className="mt-24 grid lg:grid-cols-2 gap-16 md:gap-10">
          {/* --- Infos de contact --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/5 text-primary rounded-full">
                <MailIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Email</h3>
              <p className="my-2.5 text-muted-foreground">
                Service client disponible par email
              </p>
              <Link
                className="font-medium text-primary"
                href="mailto:contact@vousrenovez.com"
              >
                contact@vousrenovez.com
              </Link>
            </div>

            <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/5 text-primary rounded-full">
                <MessageCircle />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Live chat</h3>
              <p className="my-2.5 text-muted-foreground">
                Service bientôt disponible
              </p>
              <Link className="font-medium text-primary" href="#">
                Discuter ici...
              </Link>
            </div>

            <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/5 text-primary rounded-full">
                <MapPinIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Domiciliation</h3>
              <p className="my-2.5 text-muted-foreground">
                Nous rendre visite.
              </p>
              <Link
                className="font-medium text-primary"
                href="https://map.google.com"
                target="_blank"
              >
                7 avenue de Banyuls sur Mer <br /> 66100 Perpignan France
              </Link>
            </div>

            <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/5 text-primary rounded-full">
                <PhoneIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Téléphone</h3>
              <p className="my-2.5 text-muted-foreground">
                Lundi - Dimanche de 8 h à 20 h.
              </p>
              <Link
                className="font-medium text-primary"
                href="tel:+33616224682"
              >
                +33 6 16 22 46 82
              </Link>
            </div>
          </div>

          {/* --- Formulaire --- */}
          <Card className="bg-accent shadow-none py-0">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      placeholder="Votre prénom"
                      className="mt-2 bg-white h-10 shadow-none"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      placeholder="Votre nom"
                      className="mt-2 bg-white h-10 shadow-none"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Votre adresse email"
                      className="mt-2 bg-white h-10 shadow-none"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Votre message..."
                      className="mt-2 bg-white shadow-none"
                      rows={6}
                      required
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Checkbox id="acceptTerms" required />
                    <Label htmlFor="acceptTerms">
                      J’accepte les{" "}
                      <Link href="#" className="underline">
                        conditions générales d'utilisation
                      </Link>
                    </Label>
                  </div>
                </div>

                <Button
                  className="mt-6 w-full"
                  size="lg"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Envoi en cours..." : "Envoyer"}
                </Button>

                {success && (
                  <p className="text-teal-500 text-center mt-4">
                    ✅ Message envoyé avec succès !
                  </p>
                )}
                {error && (
                  <p className="text-red-600 text-center mt-4">{error}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact02Page;
