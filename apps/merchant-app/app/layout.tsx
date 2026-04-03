import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { AppbarClient } from "@/components/AppbarClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Merchant App",
  description: "Merchant Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-slate-950 text-slate-50`}
      >
        <Providers>
          <AppbarClient />
          {children}
        </Providers>
      </body>
    </html>
  );
}
