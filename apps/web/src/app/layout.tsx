import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DualCartDrawer } from "@/components/cart/DualCartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF9F6",
};

export const metadata: Metadata = {
  title: "Phoenix A* — Luxury Fashion Atelier | Doorstep Fitting Service",
  description:
    "Contemporary luxury fashion. Try up to 5 garments in the comfort of your home for 20 minutes before paying a single rupee.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-[#111111]">
        {children}
        <DualCartDrawer />
      </body>
    </html>
  );
}
