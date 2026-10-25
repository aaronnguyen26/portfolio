import type { Metadata } from "next";
import { Playfair_Display, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { TurnProvider, Sheet } from "@/components/PageTurn";
import { ResumeProvider } from "@/components/ResumeModal";
import { LLMProvider } from "@/components/LLMModal";
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
  alternates: {
    types: {
      "text/markdown": [
        { url: "/llms.txt", title: "LLM-friendly text summary" },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${serif.variable} ${mono.variable} ${hand.variable}`}>
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM-friendly text summary" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Full LLM Dossier" />
      </head>
      <body>
        <TurnProvider>
          <ResumeProvider>
            <LLMProvider>
              <Nav />
              <Sheet>{children}</Sheet>
            </LLMProvider>
          </ResumeProvider>
        </TurnProvider>
      </body>
    </html>
  );
}
