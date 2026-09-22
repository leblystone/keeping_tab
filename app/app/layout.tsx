import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import { KillNextOverlays } from "@/components/KillNextOverlays";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keeping Tab — Interactive Savings Book",
  description:
    "Digitize your cash-envelope savings challenges — tap live $ overlays on real card art.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-ktab-cream">
        <div className="flex-1 flex flex-col pb-20">{children}</div>
        <BottomNav />
        <KillNextOverlays />
      </body>
    </html>
  );
}
