import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Hero02 = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-(--breakpoint-xl) w-full mx-auto grid lg:grid-cols-2 items-stretch gap-12 px-6 py-12">
        {/* Bloc texte */}
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="rounded-full py-1 border-border w-fit">
            <Link href="/auth/login" className="flex items-center gap-1">
              S'inscrire gratuitement en tant que professionnel
              <ArrowUpRight className="size-4 text-teal-500" />
            </Link>
          </Badge>

          <h1 className="mt-6 max-w-[17ch] text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-semibold leading-[1.2]! tracking-wider">
            Trouvez le meilleur artisan pour vos travaux
          </h1>

          <p className="mt-6 max-w-[60ch] sm:text-lg">
            Publiez gratuitement votre projet pour accéder aux artisans disposant des compétences dont vous avez besoin.
          </p>

          <div className="mt-12 flex items-center gap-4">
            <Button asChild>
  <Link href="/chatbox">
    Publiez votre projet <ArrowUpRight className="h-5 w-5" />
  </Link>
</Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
            >
              <CirclePlay className="h-5! w-5!" /> Agent ia
            </Button>
          </div>
        </div>

        {/* Bloc image */}
        <div className="w-full rounded-xl border overflow-hidden relative">
          <Image
            src="/peinture-1.jpg"
            alt="Peinture artisan"
            fill
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Hero02;
