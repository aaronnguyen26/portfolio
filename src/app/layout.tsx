import type { Metadata } from "next";
import { Playfair_Display, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { TurnProvider, Sheet } from "@/components/PageTurn";
import { site } from "@/data/site";

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${site.name} — field journal`,
  description: site.tagline,
  openGraph: {
    title: site.name,
    description: site.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${serif.variable} ${mono.variable} ${hand.variable}`}>
      <body>
        <TurnProvider>
          <Nav />
          <Sheet>{children}</Sheet>
        </TurnProvider>
      </body>
    </html>
  );
}
