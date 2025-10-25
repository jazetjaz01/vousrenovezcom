import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent className="px-6 py-3">
        {/* 🔹 Ajout d’un titre masqué pour l’accessibilité */}
        <VisuallyHidden>
          <SheetTitle>Navigation principale</SheetTitle>
        </VisuallyHidden>

        <Logo />
        <NavMenu orientation="vertical" className="mt-6 [&>div]:h-full" />
      </SheetContent>
    </Sheet>
  );
};
