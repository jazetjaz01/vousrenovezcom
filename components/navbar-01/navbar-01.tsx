
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import Link from "next/link";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
const Navbar01Page = () => {
  return (
    <div className=" bg-muted ">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
           <Link href="/">
          <div className="gap-2 flex items-end">
          <Logo />
          <div className=" tracking-wider text-lg hidden md:block font-bold  ">
   vousrenovez.com
   </div>
  
  </div>
  </Link>

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
             {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar01Page;
