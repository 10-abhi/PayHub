import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "../providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "PayHub — Digital Wallet",
  description: "Send money, pay merchants, and manage your digital wallet securely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}>
          {children}
        </body>
      </Providers>
    </html>
  );
}
