import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Suspense } from "react";
import Loader from "@/components/loader";
import { Toaster } from "react-hot-toast";

export const dynamic = "force-dynamic";

const PlusJakartaSans = localFont({
  src: "./fonts/PlusJakartaSans-VariableFont_wght.ttf",
  variable: "--font-jakarta-sans",
  weight: "100 900",
});
const PlusJakartaSansItalic = localFont({
  src: "./fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf",
  variable: "--font-jakarta-sans-italic",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EasyRide - Rent Cars Today",
  description: "Car rental application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${PlusJakartaSans.variable} ${PlusJakartaSansItalic.variable} antialiased bg-light`}
      >
        <Suspense fallback={<Loader />}>{children}</Suspense>
        <Toaster />
      </body>
    </html>
  );
}
