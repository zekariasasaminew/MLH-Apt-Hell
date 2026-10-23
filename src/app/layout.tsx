import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { AnnoyanceHost } from "@/annoyances/AnnoyanceHost";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const displayFace = Plus_Jakarta_Sans({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["800"],
});

export const metadata: Metadata = {
  title: "Hellow: Real Estate, Apartments, Mortgages & Home Values",
  description: "Find your next apartment. Eventually.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${displayFace.variable}`}>
      <body>
        {children}
        <Suspense>
          <AnnoyanceHost />
        </Suspense>
      </body>
    </html>
  );
}
