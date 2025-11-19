import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interest Growth Explorer",
  description:
    "Interactive static experience to understand differences between simple and compound interest with educational guidance.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body
        className={`${inter.variable} bg-background font-sans text-text-primary selection:bg-accent-compound/30`}
      >
        <Providers>
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

