import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/navbar-01/navbar-01";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Vousrenovez.com - Le moyen le plus fiable d'engager un artisan dans votre région",
  description: "Vous avez des travaux à réaliser chez vous ? Confiez-les à des artisans qualifiés. Publiez gratuitement votre projet sur Renovez.com et trouvez l artisan qu il vous faut pour vos travaux.",
};

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${outfitSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
           <Navbar />
          {children}
        
        </ThemeProvider>
      </body>
    </html>
  );
}
