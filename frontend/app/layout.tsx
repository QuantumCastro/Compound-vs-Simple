import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { CyberBackground } from "@/components/ui/cyber-background";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interest Growth Explorer",
  description:
    "Interactive static experience to understand differences between simple and compound interest with educational guidance.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background font-sans text-text-primary selection:bg-accent-compound/30`}
      >
        <Providers>
          <div className="relative isolate min-h-screen overflow-hidden">
            <CyberBackground />
            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-10">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
