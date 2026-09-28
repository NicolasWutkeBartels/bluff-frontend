import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

// Uma família só. Os eixos opsz (tamanho óptico) e wdth (largura) dão a hierarquia.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

export const metadata: Metadata = {
  title: "Bluff",
  description: "Planning Poker: cada um estima em segredo e todos revelam juntos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
